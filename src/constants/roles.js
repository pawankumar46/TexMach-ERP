export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  STORE_MANAGER: "store_manager",
  USER: "user",
  VENDOR: "vendor",
}

export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
  [USER_ROLES.STORE_MANAGER]: "Store Manager",
  [USER_ROLES.USER]: "Store Executive",
  [USER_ROLES.VENDOR]: "Vendor",
}

export const PERMISSIONS = {
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_MANAGE: "inventory.manage",
  STOCK_VIEW: "stock.view",
  STOCK_ADJUST: "stock.adjust",
  STOCK_TRANSFER: "stock.transfer",
  WAREHOUSE_VIEW: "warehouse.view",
  SCAN_USE: "scan.use",
  USERS_MANAGE: "users.manage",
  CONSOLIDATED_VIEW: "consolidated.view",
}

const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.STORE_MANAGER]: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.STOCK_ADJUST,
    PERMISSIONS.STOCK_TRANSFER,
    PERMISSIONS.WAREHOUSE_VIEW,
    PERMISSIONS.SCAN_USE,
  ],
  [USER_ROLES.USER]: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.STOCK_ADJUST,
    PERMISSIONS.SCAN_USE,
  ],
  [USER_ROLES.VENDOR]: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_MANAGE],
}

export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export const canManageInventoryItem = (user, product) => {
  if (!hasPermission(user?.role, PERMISSIONS.INVENTORY_MANAGE)) {
    return false
  }

  if (user?.brandFilter && product?.brand && product.brand !== user.brandFilter) {
    return false
  }

  return true
}
