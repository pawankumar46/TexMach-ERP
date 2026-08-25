import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { PERMISSIONS } from "@/constants/roles"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { InventoryPage } from "@/features/inventory/pages/InventoryPage"
import { InventoryDetailPage } from "@/features/inventory/pages/InventoryDetailPage"
import { StockPage } from "@/features/stock/pages/StockPage"
import { WarehousesPage } from "@/features/warehouses/pages/WarehousesPage"
import { ScanPage } from "@/features/scan/pages/ScanPage"
import { UsersPage } from "@/features/users/pages/UsersPage"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/:productId" element={<InventoryDetailPage />} />
          <Route element={<ProtectedRoute permission={PERMISSIONS.STOCK_VIEW} />}>
            <Route path="/stock" element={<StockPage />} />
          </Route>
          <Route element={<ProtectedRoute permission={PERMISSIONS.WAREHOUSE_VIEW} />}>
            <Route path="/warehouses" element={<WarehousesPage />} />
          </Route>
          <Route element={<ProtectedRoute permission={PERMISSIONS.SCAN_USE} />}>
            <Route path="/scan" element={<ScanPage />} />
          </Route>
          <Route element={<ProtectedRoute permission={PERMISSIONS.USERS_MANAGE} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
