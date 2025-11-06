/** @jsxImportSource react */
import type { Meta, StoryFn } from '@storybook/react'
import ExpoScene from './expo_scene'
import type { Order } from '@/types'

const meta = {
  title: 'Scenes/Expo Scene',
  component: ExpoScene,
  argTypes: {},
} satisfies Meta<typeof ExpoScene>

export default meta

const Template: StoryFn<typeof ExpoScene> = (args) => <ExpoScene {...args} />

export const Default = Template.bind({})
Default.args = {
  order: {
    rice: true,
    fish: 1,
    garnish: 2,
    sauce: 1,
  } as Order,
  ticket: {
    rice: true,
    fish: 1,
    garnish: 2,
    sauce: 1,
  } as Order,
  serverName: 'Server Name',
  tableNumber: 12,
  sentTime: new Date(),
  score: 85,
  stars: 4,
}
