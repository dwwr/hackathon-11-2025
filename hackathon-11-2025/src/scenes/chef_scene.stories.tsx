/** @jsxImportSource react */
import type { Meta, StoryFn } from '@storybook/react'
import ChefScene from './chef_scene'

const meta = {
  title: 'Scenes/Chef Scene',
  component: ChefScene,
  argTypes: {},
} satisfies Meta<typeof ChefScene>

export default meta

const Template: StoryFn<typeof ChefScene> = (args) => <ChefScene {...args} />

export const Default = Template.bind({})
Default.args = {}
