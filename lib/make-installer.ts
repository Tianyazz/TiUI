import { INSTALLED_KEY } from '../constants'

import type { App, Plugin } from '@vue/runtime-core'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) {
      return
    }
    app[INSTALLED_KEY] = true
    components.forEach(component => app.use(component))
  }

  return { install }
}