import { PropsWithChildren, ReactNode } from 'react'
import {
  HighlightOptions,
  useHighlight,
} from 'react-text-marker/hooks/useHighlight'

export type HighlightProps = PropsWithChildren<
  Omit<HighlightOptions, 'element'>
>

export function Highlight({
  children,
  ...options
}: HighlightProps): JSX.Element {
  const content = useHighlight({
    element: children,
    ...options,
  })

  return <>{content}</>
}
