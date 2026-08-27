import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN").format(value || 0)
}

export const formatDateTime = (value) => {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export const formatDate = (value) => {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value))
}

/** First letter of each word upper, remaining letters lower (handles spaces and hyphens). */
export const toTitleCase = (value) => {
  if (!value) {
    return ""
  }

  return String(value)
    .toLowerCase()
    .replace(/(^|[\s\-_/&(])([a-z])/g, (_, boundary, letter) => `${boundary}${letter.toUpperCase()}`)
}

export const delay = (ms = 420) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
