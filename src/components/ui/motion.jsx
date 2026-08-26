import { motion, useReducedMotion } from "framer-motion"
import { fadeIn, fadeUp, pageTransition, scaleIn, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"

export const FadeIn = ({ children, className, delay = 0, y = true }) => {
  const reduceMotion = useReducedMotion()
  const variants = y ? fadeUp : fadeIn

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export const Stagger = ({ children, className }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  )
}

export const PageFade = ({ children, className }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({ children, className }) => {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={scaleIn}
    >
      {children}
    </motion.div>
  )
}
