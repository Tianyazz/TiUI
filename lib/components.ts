/// <reference path="../node_modules/vite/types/importMeta.d.ts" />

import type { Plugin } from 'vue'
// import TiButton from '../components/TiButton/index.ts'

const Components = import.meta.glob('../compontns/**/*.ts')

// export default [
//   TiButton
// ] as Plugin[]

const loadComponents = async () => {
  const components = await Promise.all(
    Object.entries(Components).map(async ([path, loader]) => {
      const componentModule = await loader()
      return (componentModule as { default: Plugin }).default
    })
  )
  return components as Plugin[]
}

export default loadComponents