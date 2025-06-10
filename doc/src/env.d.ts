/// <reference types="astro/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}

// Declare the types for your components
declare module '@astrojs/starlight/components' {
  export const Card: any
  export const CardGrid: any
  export const Code: any
  export const FileTree: any
  export const Steps: any
  export const Tabs: any
  export const TabItem: any
  export const LinkCard: any
  export const Aside: any
  export const LinkButton: any
}