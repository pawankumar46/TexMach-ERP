import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { mapInventoryProduct, toProductPayload } from "@/lib/inventory-mappers"
import { PRODUCTS, STOCK_ITEMS, getAvailableStock } from "@/data/inventory-seed"
import { findBomMatches } from "@/data/bom-seed"
import { deriveStockStatus } from "@/constants/stock-status"
import { PRODUCT_CATEGORIES } from "@/constants/product-categories"
import { hasPermission, PERMISSIONS, canAccessProduct, isProductScoped } from "@/constants/roles"

let stockLedger = STOCK_ITEMS.map((item) => ({ ...item }))
let productCatalog = PRODUCTS.map((item) => ({ ...item }))

export const getStockLedgerSnapshot = () => stockLedger

export const replaceStockLedger = (nextLedger) => {
  stockLedger = nextLedger
}

export const getProductCatalog = () => productCatalog

const visibleFacilityIds = (user, selectedFacilityId) => {
  if (selectedFacilityId && selectedFacilityId !== "all") {
    return [selectedFacilityId]
  }

  if (user?.canViewAllFacilities) {
    return null
  }

  return user?.facilityIds ?? []
}

const assertCanManage = (user, product) => {
  if (!hasPermission(user?.role, PERMISSIONS.INVENTORY_MANAGE)) {
    throw new Error("You do not have permission to change catalog items.")
  }

  if (user?.brandFilter && product?.brand && product.brand !== user.brandFilter) {
    throw new Error("You can only manage items for your own brand.")
  }

  if (product?.id && !canAccessProduct(user, product)) {
    throw new Error("You can only manage machines assigned to your category.")
  }
}

const assertUniqueSku = (sku, productId) => {
  const taken = productCatalog.some(
    (item) => item.sku.toLowerCase() === sku.toLowerCase() && item.id !== productId,
  )

  if (taken) {
    throw new Error("That SKU already exists in the catalog.")
  }
}

const slugFromName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

export const getInventoryItems = async ({ user, selectedFacilityId, search = "", category, status, brand } = {}) => {
  try {
    await delay()
    const facilityIds = visibleFacilityIds(user, selectedFacilityId)

    let products = productCatalog

    if (user?.brandFilter) {
      products = products.filter((product) => product.brand === user.brandFilter)
    }

    if (isProductScoped(user)) {
      products = products.filter((product) => canAccessProduct(user, product))
    }

    const mapped = products.map((product) => {
      const rows = stockLedger
        .filter((item) => item.productId === product.id)
        .filter((item) => !facilityIds || facilityIds.includes(item.facilityId))
        .map((item) => ({
          ...item,
          available: getAvailableStock(item.quantity, item.reserved),
          stockStatus: deriveStockStatus(
            getAvailableStock(item.quantity, item.reserved),
            product.reorderLevel,
          ),
        }))

      return mapInventoryProduct(product, rows)
    })

    const query = search.trim().toLowerCase()
    const bomMatches = query ? findBomMatches(query) : []
    const bomMatchesByProductId = bomMatches.reduce((acc, row) => {
      if (!acc[row.productId]) {
        acc[row.productId] = []
      }
      acc[row.productId].push({
        id: row.id,
        componentId: row.componentId,
        componentName: row.componentName,
        variantId: row.variantId,
        variantName: row.variantName,
      })
      return acc
    }, {})

    return mapped
      .map((product) => {
        const haystack =
          `${product.name} ${product.sku} ${product.brand} ${product.category} ${product.model}`.toLowerCase()
        const matchedComponents = bomMatchesByProductId[product.id] ?? []
        const matchesMachine = !query || haystack.includes(query)
        const matchesComponent = matchedComponents.length > 0
        const matchesSearch = !query || matchesMachine || matchesComponent
        const matchesCategory = !category || category === "all" || product.category === category
        const matchesBrand = !brand || brand === "all" || product.brand === brand
        const productStatus =
          product.totalAvailable <= 0
            ? "out_of_stock"
            : product.stockRows.some((row) => row.stockStatus === "low_stock")
              ? "low_stock"
              : "in_stock"
        const matchesStatus = !status || status === "all" || productStatus === status

        if (!matchesSearch || !matchesCategory || !matchesBrand || !matchesStatus) {
          return null
        }

        return {
          ...product,
          matchedComponents: query ? matchedComponents : [],
          matchedViaMachine: Boolean(query && matchesMachine),
          matchedViaComponent: Boolean(query && matchesComponent),
        }
      })
      .filter(Boolean)
      .sort((left, right) => {
        // Prefer machines that matched via BOM components when searching.
        if (Boolean(right.matchedViaComponent) !== Boolean(left.matchedViaComponent)) {
          return right.matchedViaComponent ? 1 : -1
        }
        return (right.matchedComponents?.length ?? 0) - (left.matchedComponents?.length ?? 0)
      })
  } catch (error) {
    throw toAppError(error)
  }
}

export const getInventoryItemById = async (productId, { user, selectedFacilityId } = {}) => {
  try {
    const items = await getInventoryItems({ user, selectedFacilityId })
    const product = items.find((item) => item.id === productId)

    if (!product) {
      throw new Error("Inventory item not found.")
    }

    return product
  } catch (error) {
    throw toAppError(error)
  }
}

export const createInventoryItem = async (values, user) => {
  try {
    await delay(480)

    if (isProductScoped(user)) {
      throw new Error("Category managers can only edit machines assigned to their category.")
    }

    const payload = toProductPayload(values)
    const brand = user?.brandFilter || payload.brand

    assertCanManage(user, { brand })
    assertUniqueSku(payload.sku)

    const created = {
      id: `prd-custom-${Date.now()}`,
      sourceId: Date.now(),
      name: payload.name,
      sku: payload.sku,
      model: payload.model,
      brand,
      manufacturer: "Hari Chand Anand & Co.",
      category: payload.category,
      tags: [payload.category, brand].filter(Boolean),
      image: payload.image,
      handle: slugFromName(payload.name),
      catalogUrl: "",
      itemType: "fg",
      uom: "unit",
      reorderLevel: payload.reorderLevel,
      minQty: payload.reorderLevel,
      maxQty: Math.max(payload.reorderLevel * 8, 8),
      costPrice: payload.costPrice,
      abcClass: "B",
      serialTracked: true,
    }

    productCatalog = [created, ...productCatalog]
    return mapInventoryProduct(created, [])
  } catch (error) {
    throw toAppError(error)
  }
}

export const updateInventoryItem = async (productId, values, user) => {
  try {
    await delay(480)
    const current = productCatalog.find((item) => item.id === productId)

    if (!current) {
      throw new Error("Inventory item not found.")
    }

    assertCanManage(user, current)

    const payload = toProductPayload({
      ...values,
      brand: user?.brandFilter || values.brand,
    })

    if (user?.brandFilter && payload.brand !== user.brandFilter) {
      throw new Error("You can only manage items for your own brand.")
    }

    assertUniqueSku(payload.sku, productId)

    const updated = {
      ...current,
      name: payload.name,
      sku: payload.sku,
      model: payload.model,
      brand: payload.brand,
      category: payload.category,
      tags: [payload.category, payload.brand].filter(Boolean),
      image: payload.image,
      reorderLevel: payload.reorderLevel,
      minQty: payload.reorderLevel,
      costPrice: payload.costPrice,
    }

    productCatalog = productCatalog.map((item) => (item.id === productId ? updated : item))
    return getInventoryItemById(productId, { user })
  } catch (error) {
    throw toAppError(error)
  }
}

export const deleteInventoryItem = async (productId, user) => {
  try {
    await delay(420)
    const current = productCatalog.find((item) => item.id === productId)

    if (!current) {
      throw new Error("Inventory item not found.")
    }

    assertCanManage(user, current)

    productCatalog = productCatalog.filter((item) => item.id !== productId)
    stockLedger = stockLedger.filter((item) => item.productId !== productId)

    return { id: productId, name: current.name, sku: current.sku }
  } catch (error) {
    throw toAppError(error)
  }
}

export const getInventoryMeta = () => {
  const categories = [...new Set([...PRODUCT_CATEGORIES, ...productCatalog.map((product) => product.category)])].sort()
  const brands = [...new Set(productCatalog.map((product) => product.brand))].sort()
  const tags = [
    ...new Set(productCatalog.flatMap((product) => (Array.isArray(product.tags) ? product.tags : []))),
  ].sort()
  return { categories, brands, tags }
}
