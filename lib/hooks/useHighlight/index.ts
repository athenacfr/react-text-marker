import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  PropsWithChildren,
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

export type HighlightExcludeData = {
  element: ReactNode
  depth: number
}

export type HighlightOptions = {
  element: ReactNode
  query: string | string[]
  renderMark?: (text: string) => ReactNode
  filter?: (data: HighlightFilterData) => boolean
  exclude?: (data: HighlightExcludeData) => boolean
  nestedElements?: boolean
  depth?: number
}

function highlight({
  element,
  query,
  renderMark = (text) => createElement('mark', undefined, text),
  filter = () => true,
  exclude = () => false,
  nestedElements = false,
  depth = 0,
}: HighlightOptions): ReactNode {
  const queryRegex = new QueryRegExp(query, {
    global: true,
    ignoreCase: true,
  })

  if (!queryRegex.isValid) return element

  const markedElement = Children.map(element, (child) => {
    if (!child || exclude({ element: child, depth })) {
      return child
    }

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
                regex: queryRegex.regex,
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
      isValidElement<PropsWithChildren>(child) &&
      !!child.props.children
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
          filter,
          exclude,
          depth: depth + 1,
        })
      )
    }

    return child
  })!

  return markedElement
}

export function useHighlight({
  element,
  query,
  renderMark,
  nestedElements,
  filter,
  exclude,
}: HighlightOptions) {
  return useMemo(
    () =>
      highlight({
        element,
        query,
        renderMark,
        nestedElements,
        filter,
        exclude,
      }),
    [element, query, renderMark, nestedElements, filter, exclude]
  )
}
