import type { AppContext, Plugin, Ref } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _content: AppContext | null
}

export type MayBeRef<T> = T | Ref<T>