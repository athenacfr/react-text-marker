import {
  Children,
  cloneElement,
  createElement,
  ReactNode,
  useMemo,
} from 'react'
import { QueryRegExp } from './QueryRegExp'

export type HighlightFilterData = {
  text: string
  fullText: string
  regex: RegExp
  occurrence: number
}

export type HighlightOptions = {
  element: ReactNode
  query: string | string[]
  renderMark?: (text: string) => ReactNode
  filter?: (data: HighlightFilterData) => boolean
  nestedElements?: boolean
}

function highlight({
  element,
  query,
  renderMark = (text) => createElement('mark', undefined, text),
  filter = () => true,
  nestedElements = false,
}: HighlightOptions): ReactNode {
  const queries = Array.isArray(query) ? query : [query]
  const queryRegex = new QueryRegExp(queries, 'ig')

  if (!queryRegex.isValid) return element

  const children = Children.map(element, (child) => {
    if (!child) return null

    if (typeof child === 'string') {
      const texts = queryRegex
        .split(child)
        .map(({ text, matches, occurrence }) => {
          if (matches) {
            return {
              text,
              mark: filter({
                fullText: child,
                occurrence,
                text,
                regex: queryRegex,
              }),
            }
          }

          return { text, mark: false }
        })
        .filter(({ text }) => text.length !== 0)

      return texts.map(({ text, mark }) => (mark ? renderMark(text) : text))
    }

    if (
      nestedElements &&
      typeof child === 'object' &&
      'props' in child &&
      child.props.children
    ) {
      const { children, ...props } = child?.props

      return cloneElement(
        child,
        props,
        highlight({
          element: children,
          query,
          renderMark,
          nestedElements,
        })
      )
    }

    return child
  })!

  return children
}

export function useHighlight({
  element,
  query,
  renderMark,
  nestedElements,
  filter,
}: HighlightOptions) {
  return useMemo(
    () =>
      highlight({
        element,
        query,
        renderMark,
        nestedElements,
        filter,
      }),
    [element, query, renderMark, nestedElements]
  )
}
