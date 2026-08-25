import { delay } from "@/lib/utils"
import { PERSONAS } from "@/data/personas"

const toAuthUser = (persona) => {
  const user = { ...persona }
  delete user.password
  return user
}

export const loginWithCredentials = async (email, password) => {
  await delay(320)

  const normalizedEmail = email.trim().toLowerCase()
  const persona = PERSONAS.find(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  )

  if (!persona || persona.password !== password) {
    throw new Error("Invalid email or password. Please try again.")
  }

  return toAuthUser(persona)
}

export const logoutSession = async () => {
  await delay(120)
  return true
}
