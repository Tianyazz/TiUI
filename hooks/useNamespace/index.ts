import { computed, inject, ref, unref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export const defaultNamespace = 'ti'

/**
 * BEM类名生成
 * @param namespace 命名空间
 * @param block BEM命名中的第一级，是一个独立的可复用的组件或模块。
 * @param blockSuffix Block的后缀，用于进一步区分Block的某个特定变体。
 * @param element BEM命名中的第二级，用于描述Block内部的某个具体部分。
 * @param modifier BEM命名中的第三级，用于描述Block或Element的状态或外观的变化。
 * @returns 
 */
const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

/**
 * 获取命名空间值
 * @returns { string } namespace
*/
export const namespaceContextKey: InjectionKey<Ref<string | undefined>> = Symbol('localContextKey')

export const useGetDerivedNamespace = () => {
  const derivedNamespace = inject(namespaceContextKey, ref(defaultNamespace))
  const namespace = computed(() => unref(derivedNamespace) || defaultNamespace)
  return namespace
}

/**
 * class类名生成方法集合
 * @param { string } block BEM命名中的第一级，是一个独立的可复用的组件或模块。
 * @returns 
 */
export const useNamespace = (block: string) => {
  const namespace = useGetDerivedNamespace()

  /// 组件或模块
  const b = (blockSuffix: '') => _bem(namespace.value, block, blockSuffix, '', '')

  /// 模块内部的具体部分
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''

  /// 组件或模块的状态等变体
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''

  /// 组件或模块内的特定变体的具体部分
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''

  /// 模块具体部分的状态
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''

  /// 组件或模块内的特定变体的状态
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''

  /// 组件或模块内部变体模块的具体部分的状态
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
     ? _bem(namespace.value, block, blockSuffix, element, modifier)
     : ''

  /// 根据组件的状态生成带有 is- 前缀的类名
  const is: {
    (name: string, state: boolean | undefined) : string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `is-${name}` : ''
  }

  /// 生成css变量
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }

  /// 生成模块或组件的css变量
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) => `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarBlock,
    cssVarName,
    cssVarBlockName
  }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>