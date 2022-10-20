import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Highlight } from './Highlight'

export default {
  component: Highlight,
} as ComponentMeta<typeof Highlight>

export const PlainText = () => {
  return <Highlight query="world">Hello World!</Highlight>
}

export const NestedElements = () => {
  return (
    <Highlight query="world" searchNestedElements>
      <b>
        Hello <span>World</span>!
      </b>
    </Highlight>
  )
}

export const ArrayAsChildren = () => {
  return (
    <Highlight query="world" searchNestedElements>
      {['Hello ', 'World', '!']}
    </Highlight>
  )
}

export const CustomRender = () => {
  return (
    <Highlight
      query="world"
      renderMark={(text) => (
        <span style={{ backgroundColor: 'red' }}>{text}</span>
      )}
    >
      Hello World!
    </Highlight>
  )
}
