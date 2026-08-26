export const EASE_OUT = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
}
