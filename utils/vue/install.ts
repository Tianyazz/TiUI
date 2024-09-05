import type { App, Directive } from 'vue'
import type { SFCInstallWithContext, SFCWithInstall } from './types'

/// 返回一个新的组件对象，这个组件对象具有一个空的install方法
export const withNoopInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = () => {}

  return component as SFCWithInstall<T>
}