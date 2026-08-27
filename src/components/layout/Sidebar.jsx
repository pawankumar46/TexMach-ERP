import { NavLink } from "react-router-dom"
import {
  Barcode,
  Building2,
  LayoutDashboard,
  LogOut,
  Package,
  ScanLine,
  Users,
  Warehouse,
  X,
} from "lucide-react"
import { USER_ROLES } from "@/constants/roles"
import { PERMISSIONS } from "@/constants/roles"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, permission: PERMISSIONS.INVENTORY_VIEW },
  { to: "/inventory", label: "Inventory", icon: Package, permission: PERMISSIONS.INVENTORY_VIEW },
  { to: "/stock", label: "Stock ledger", icon: Warehouse, permission: PERMISSIONS.STOCK_VIEW },
  { to: "/warehouses", label: "Venues", icon: Building2, permission: PERMISSIONS.WAREHOUSE_VIEW },
  { to: "/scan", label: "Scan components", icon: ScanLine, permission: PERMISSIONS.SCAN_USE },
  { to: "/users", label: "Users & roles", icon: Users, permission: PERMISSIONS.USERS_MANAGE },
]

export const Sidebar = ({ user, can, onLogout, open, onClose }) => {
  const items = NAV_ITEMS.filter((item) => can(item.permission))

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-navy-950 text-slate-200 shadow-[8px_0_32px_rgb(7_21_38/0.2)] transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/25">
              <Barcode className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-white">InvenTree</p>
              <p className="text-xs text-slate-400">HCA · Phase 1</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-300 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white shadow-sm before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-gold-500"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-sm font-semibold text-white">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.title}</p>
          {user?.role === USER_ROLES.VENDOR ? (
            <p className="mt-2 text-xs text-amber-300">Vendor portal · add & edit catalog</p>
          ) : null}
          {user?.role === USER_ROLES.CATEGORY_MANAGER ? (
            <p className="mt-2 text-xs text-amber-300">Category scope · assigned machines & BOM</p>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Switch account
          </Button>
        </div>
      </aside>
    </>
  )
}
