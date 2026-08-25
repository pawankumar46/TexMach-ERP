export const extractApiErrorMessage = (error) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Something went wrong. Please try again."
}

export const toAppError = (error) => {
  return new Error(extractApiErrorMessage(error), { cause: error })
}

