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

export const CustomMarkRender: ComponentStoryObj<typeof Highlight> = {
  args: {
    children: 'Hello World!',
    query: 'world',
    renderMark: (text) => (
      <span style={{ backgroundColor: 'red' }}>{text}</span>
    ),
  },
}

export const CustomFilter: ComponentStoryObj<typeof Highlight> = {
  args: {
    children: Array(10).fill('Hello World!').join(' '),
    query: ['hello', 'world'],
    filter: ({ occurrence }) => {
      return [6, 4, 2, 7].includes(occurrence)
    },
  },
}
