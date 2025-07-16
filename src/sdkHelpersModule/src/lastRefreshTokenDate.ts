

let lastRefreshTokenDate: number | undefined

export function getLastRefreshTokenDate() {
  return lastRefreshTokenDate
}

export function setLastRefreshTokenDate(value: number | undefined) {
  lastRefreshTokenDate = value
}