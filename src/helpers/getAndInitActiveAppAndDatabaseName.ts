import { throwError } from '../core.error'


let activeAppName: string

export function initActiveAppName(appName) {
  activeAppName = appName
}

export function getActiveAppName() {
  if (!activeAppName) throwError.serverError('getActiveAppName() is called but initActiveAppName() has not been called')
  return activeAppName
}

// DUPLICATE / ALIASES

let activeDbName: string

export function initActiveDbName(dbName) {
  activeDbName = dbName
}

export function getActiveDbName() {
  if (!activeDbName) throwError.serverError('getActiveDbName() is called but initActiveDbName() has not been called')
  return activeDbName
}