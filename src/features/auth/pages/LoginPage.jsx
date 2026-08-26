import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Barcode, Building2, ChevronDown, Eye, EyeOff, Package, ScanLine, Users } from "lucide-react"
import { PERSONAS } from "@/data/personas"
import { ROLE_LABELS } from "@/constants/roles"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion"
import { loginSchema } from "@/features/auth/login.schema"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { EASE_OUT } from "@/lib/motion"

const FEATURES = [
  { icon: Users, label: "User & role management" },
  { icon: Package, label: "Inventory & stock" },
  { icon: Building2, label: "Multi-facility warehouses" },
  { icon: ScanLine, label: "Handheld scanning" },
]

export const LoginPage = () => {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const authError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  const syncForUser = useFacilityStore((state) => state.syncForUser)
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = form.handleSubmit(async (values) => {
    clearError()
    try {
      const signedInUser = await login(values)
      syncForUser(signedInUser)
      navigate("/dashboard")
    } catch {
      // Store already holds the error message.
    }
  })

  const fillDemoAccount = (email, password) => {
    form.setValue("email", email, { shouldValidate: true })
    form.setValue("password", password, { shouldValidate: true })
    clearError()
  }

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between login-mesh">
        <div className="pointer-events-none absolute inset-0 login-grid" />
        <div className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-navy-600/40 blur-3xl" />

        <FadeIn className="relative px-10 pt-12" delay={0.05}>
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20">
              <Barcode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
                InvenTree
              </p>
              <p className="text-sm text-slate-300">Hari Chand Anand & Co.</p>
            </div>
          </div>
          <h1 className="max-w-md text-4xl font-extrabold tracking-tight">
            Inventory across every HCA facility.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
            Sign in with your company email to open stock, warehouses, and scanning for your role.
          </p>
        </FadeIn>

        <Stagger className="relative grid gap-3 px-10 pb-12 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.label}>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-colors duration-200 hover:border-white/20 hover:bg-white/10">
                  <Icon className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-100">{feature.label}</span>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>

      <div className="relative flex min-h-svh flex-col justify-center px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(219_231_244/0.7),transparent_55%)]" />
        <FadeIn className="relative mx-auto w-full max-w-md" delay={0.08}>
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md">
                <Barcode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-800">
                  InvenTree
                </p>
                <p className="text-sm text-slate-600">Hari Chand Anand & Co.</p>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-ink">Sign in</h1>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-ink">Sign in</h1>
            <p className="mt-2 text-sm text-slate-600">
              Use your HCA or partner account to continue.
            </p>
          </div>

          <form
            className="mt-8 space-y-5 rounded-2xl border border-line/80 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm"
            onSubmit={onSubmit}
            noValidate
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@grouphca.com"
                autoFocus
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="mt-1.5 text-xs text-red-600">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <AnimatePresence>
              {authError ? (
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {authError}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white/90 shadow-[var(--shadow-card)] backdrop-blur-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-navy-50/60"
              aria-expanded={showDemoAccounts}
              onClick={() => setShowDemoAccounts((value) => !value)}
            >
              Demo accounts for review
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showDemoAccounts ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {showDemoAccounts ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-line px-4 pb-4 pt-3">
                    <p className="mb-3 text-xs leading-5 text-slate-500">
                      Tap a row to fill the sign-in form. These accounts mirror the four Phase 1 roles.
                    </p>
                    <div className="space-y-2">
                      {PERSONAS.map((persona) => (
                        <button
                          key={persona.id}
                          type="button"
                          className="w-full rounded-xl border border-line px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:bg-navy-50 hover:shadow-sm"
                          onClick={() => fillDemoAccount(persona.email, persona.password)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-ink">{persona.name}</p>
                              <p className="text-xs text-slate-500">{ROLE_LABELS[persona.role]}</p>
                            </div>
                            <span className="text-xs text-slate-400">{persona.email}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
