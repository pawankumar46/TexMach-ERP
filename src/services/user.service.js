import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { TEAM_USERS } from "@/data/personas"

let users = TEAM_USERS.map((user) => ({ ...user }))

export const getUsers = async () => {
  try {
    await delay(320)
    return users
  } catch (error) {
    throw toAppError(error)
  }
}

export const updateUserStatus = async (userId, status) => {
  try {
    await delay(360)
    users = users.map((user) => (user.id === userId ? { ...user, status } : user))
    return users.find((user) => user.id === userId)
  } catch (error) {
    throw toAppError(error)
  }
}
