declare global {
  /**  */
  interface GreenDotErrors { }
  type GreenDotErrorNames = keyof GreenDotErrors
}

export default {} // avoid typescript bug