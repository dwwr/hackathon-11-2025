/** @jsxImportSource react */
import type { Meta, StoryFn } from '@storybook/react'
import Ticket from '.'
import type { Order } from '@/types'

const meta = {
  title: 'Components/Ticket',
  component: Ticket,
  argTypes: {},
} satisfies Meta<typeof Ticket>

export default meta

const Template: StoryFn<typeof Ticket> = (args) => <Ticket {...args} />

export const Default = Template.bind({})
Default.args = {
  order: {
    rice: true,
    fish: 0,
    garnish: 1,
    sauce: 2,
  } as Order,
}

export const NoRice = Template.bind({})
NoRice.args = {
  order: {
    rice: false,
    fish: 1,
    garnish: undefined,
    sauce: undefined,
  } as Order,
}

export const FullOrder = Template.bind({})
FullOrder.args = {
  order: {
    rice: true,
    fish: 2,
    garnish: 0,
    sauce: 1,
  } as Order,
}
