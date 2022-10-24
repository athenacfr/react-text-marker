import {
  Children,
  cloneElement,
  createElement,
  ReactNode,
  useMemo,
} from 'react'

const escapeRegexp = (term: string): string =>
  term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`)

function createRegex(queries: string[], flags?: string) {
  const formattedQueries = queries
    .map((query) => escapeRegexp(query.trim()))
    .filter((regex) => regex.length !== 0)

  if (formattedQueries.length === 0) return null

  const pattern = `(${formattedQueries.join('|')})`

  return new RegExp(pattern, flags)
}

export type HighlightFilterData = {
  text: string
  index: number
  texts: string[]
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
  const regex = createRegex(queries, 'ig')

  if (!regex) return element

  const children = Children.map(element, (child) => {
    if (!child) return null

    if (typeof child === 'string') {
      const texts = child
        .split(regex)
        .map((text, index, texts) => {
          const matches = index % 2 === 1

          if (matches) {
            const occurrence = (index - 1) / 2

            return {
              text,
              mark: filter({
                fullText: child,
                occurrence,
                text,
                index,
                texts,
                regex,
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
