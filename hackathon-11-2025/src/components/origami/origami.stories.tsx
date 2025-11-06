/** @jsxImportSource react */
import { useState, useEffect } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { assets } from './assets/index'
import Origami from './origami'

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

export default {
  title: 'Components/Origami Sushi Engine',
  component: Origami,
  argTypes: {},
} as Meta

const Template: StoryFn = () => {
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
        }}
      >
        <div>
          <strong>Order:</strong>
        </div>
        <div>Rice: {rice ? 'Yes' : 'No'}</div>
        <div>Fish: {fish}</div>
        <div>Garnish: {garnish !== undefined ? garnish : 'None'}</div>
        <div>Sauce: {sauce !== undefined ? sauce : 'None'}</div>
      </div>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}
