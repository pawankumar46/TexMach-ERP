import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { getBomForProduct, getComponentFacilityStock } from "@/data/bom-seed"

export const getProductBom = async (productId) => {
  try {
    await delay(260)
    return getBomForProduct(productId)
  } catch (error) {
    throw toAppError(error)
  }
}

export const getBomComponentStock = async (bomId) => {
  try {
    await delay(220)
    return getComponentFacilityStock(bomId)
  } catch (error) {
    throw toAppError(error)
  }
}
