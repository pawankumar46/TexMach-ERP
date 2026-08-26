import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FacilitySwitcher } from "@/components/layout/FacilitySwitcher"
import { ROLE_LABELS } from "@/constants/roles"
import { Badge } from "@/components/ui/badge"

export const Header = ({ user, onMenu }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-white/80 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenu} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-900">Hari Chand Anand & Co.</p>
            <p className="hidden text-xs text-muted sm:block">Multi-facility inventory & warehouse operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge tone="navy" className="hidden sm:inline-flex">
            {ROLE_LABELS[user?.role] ?? user?.role}
          </Badge>
          <FacilitySwitcher />
        </div>
      </div>
    </header>
  )
}
