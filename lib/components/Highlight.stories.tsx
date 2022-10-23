import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Highlight } from './Highlight'

export default {
  component: Highlight,
} as ComponentMeta<typeof Highlight>

export const PlainText: ComponentStoryObj<typeof Highlight> = {
  args: {
    children: 'Hello World!',
    query: 'world',
  },
}

export const NestedElements: ComponentStoryObj<typeof Highlight> = {
  args: {
    children: (
      <span>
        Hello <b>World</b>!
      </span>
    ),
    query: 'world',
    nestedElements: true,
  },
}

export const CustomRender: ComponentStoryObj<typeof Highlight> = {
  args: {
    children: 'Hello World!',
    query: 'world',
    renderMark: (text) => (
      <span style={{ backgroundColor: 'red' }}>{text}</span>
    ),
  },
}
