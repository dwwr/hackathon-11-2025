/** @jsxImportSource react */
import { useState, useEffect } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { assets } from './assets/index'
import Origami from '.'
import type { Order } from '@/types'

const generateRandomOrder = () => {
  const fishIndex = Math.floor(Math.random() * assets.fish.length)
  const garnishIndex =
    Math.random() > 0.3
      ? Math.floor(Math.random() * assets.garnish.length)
      : undefined
  const sauceIndex =
    Math.random() > 0.3
      ? Math.floor(Math.random() * assets.sauce.length)
      : undefined
  const rice = Math.random() > 0.2

  return {
    rice,
    fish: fishIndex,
    garnish: garnishIndex,
    sauce: sauceIndex,
  }
}

const meta = {
  title: 'Components/Origami Sushi Engine',
  component: Origami,
  argTypes: {},
} satisfies Meta<typeof Origami>

export default meta

const Template: StoryFn<{ order: Order }> = ({ order }) => {
  const { rice, fish, garnish, sauce } = order

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '2rem',
      }}
    >
      <Origami order={order} />
      <div
        style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          marginTop: '1rem',
        }}
      >
        <div>
          <strong>Order:</strong>
        </div>
        <div>Rice: {rice ? 'Yes (Nigiri)' : 'No (Sashimi)'}</div>
        <div>Fish: {fish}</div>
        <div>Garnish: {garnish !== undefined ? garnish : 'None'}</div>
        <div>Sauce: {sauce !== undefined ? sauce : 'None'}</div>
      </div>
    </div>
  )
}

export const Default = () => {
  const [randomOrder, setRandomOrder] = useState(generateRandomOrder())
  const { rice, fish, garnish, sauce } = randomOrder

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomOrder(generateRandomOrder())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '2rem',
      }}
    >
      <Origami order={randomOrder} />
      <div
        style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          marginTop: '1rem',
        }}
      >
        <div>
          <strong>Order:</strong>
        </div>
        <div>Rice: {rice ? 'Yes (Nigiri)' : 'No (Sashimi)'}</div>
        <div>Fish: {fish}</div>
        <div>Garnish: {garnish !== undefined ? garnish : 'None'}</div>
        <div>Sauce: {sauce !== undefined ? sauce : 'None'}</div>
      </div>
    </div>
  )
}

export const Nigiri = Template.bind({})
Nigiri.args = {
  order: {
    rice: true,
    fish: 0,
    garnish: 1,
    sauce: 2,
  } as Order,
}

export const Sashimi = Template.bind({})
Sashimi.args = {
  order: {
    rice: false,
    fish: 1,
    garnish: undefined,
    sauce: undefined,
  } as Order,
}

export const NigiriWithGarnish = Template.bind({})
NigiriWithGarnish.args = {
  order: {
    rice: true,
    fish: 2,
    garnish: 0,
    sauce: undefined,
  } as Order,
}

export const SashimiWithSauce = Template.bind({})
SashimiWithSauce.args = {
  order: {
    rice: false,
    fish: 3,
    garnish: undefined,
    sauce: 1,
  } as Order,
}

export const FullNigiri = Template.bind({})
FullNigiri.args = {
  order: {
    rice: true,
    fish: 4,
    garnish: 2,
    sauce: 0,
  } as Order,
}
