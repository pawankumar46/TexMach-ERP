import { useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EASE_OUT } from "@/lib/motion"

export const Dialog = ({ open, title, description, onClose, children, footer }) => {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-[var(--shadow-elevated)] sm:rounded-2xl"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 id="dialog-title" className="text-lg font-semibold text-navy-900">
                  {title}
                </h2>
                {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto px-5 py-4">{children}</div>
            {footer ? <div className="border-t border-line px-5 py-4">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
