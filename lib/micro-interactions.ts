// Micro-interactions for list items and other UI elements
export const listItemHover = {
  scale: 1.02,
  backgroundColor: "var(--accent)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}

export const listItemTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
}

export const buttonHover = {
  scale: 1.05,
  transition: {
    duration: 0.2,
  },
}

export const buttonTap = {
  scale: 0.95,
}

export const cardHover = {
  y: -5,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const iconSpin = {
  rotate: 360,
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear",
  },
}

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}
