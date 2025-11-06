/** @jsxImportSource react */
import { useState, useEffect } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import Ticket from '.'
import type { Order } from '@/types'
import { assets } from '../../assets/index'

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

const generateRandomTicketData = () => {
  const orderNumbers = [466, 123, 789, 234, 567, 890, 345, 678]
  const tables = [
    '5, 6 Top 3 Covers',
    'Table 12',
    'VIP Table 1',
    'Bar Seat 3',
    'Table 5',
    'Window Seat 2',
    'Table 8',
  ]
  const waiters = [
    'JW England',
    'Sweet Baby D',
    'Sarah K.',
    'Mike T.',
    'Alex R.',
    'Jordan L.',
  ]

  return {
    orderNumber: orderNumbers[Math.floor(Math.random() * orderNumbers.length)],
    table: tables[Math.floor(Math.random() * tables.length)],
    waiter: waiters[Math.floor(Math.random() * waiters.length)],
    sentTime: new Date(
      Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24 hours
    ),
  }
}

const meta = {
  title: 'Components/Ticket',
  component: Ticket,
  argTypes: {
    orderNumber: {
      control: 'text',
      description: 'Order number',
    },
    table: {
      control: 'text',
      description: 'Table information',
    },
    waiter: {
      control: 'text',
      description: 'Waiter name',
    },
    sentTime: {
      control: 'date',
      description: 'Time when order was sent',
    },
  },
} satisfies Meta<typeof Ticket>

export default meta

const Template: StoryFn<typeof Ticket> = (args) => <Ticket {...args} />

export const Default = () => {
  const [randomOrder, setRandomOrder] = useState(generateRandomOrder())
  const [ticketData, setTicketData] = useState(generateRandomTicketData())

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomOrder(generateRandomOrder())
      setTicketData(generateRandomTicketData())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Ticket
      order={randomOrder}
      orderNumber={ticketData.orderNumber}
      table={ticketData.table}
      waiter={ticketData.waiter}
      sentTime={ticketData.sentTime}
    />
  )
}

export const NoRice = Template.bind({})
NoRice.args = {
  order: {
    rice: false,
    fish: 1,
    garnish: undefined,
    sauce: undefined,
  } as Order,
  orderNumber: 123,
  table: 'Table 12',
  waiter: 'Sweet Baby D',
  sentTime: new Date('2024-01-15T18:45:00'),
}

export const FullOrder = Template.bind({})
FullOrder.args = {
  order: {
    rice: true,
    fish: 2,
    garnish: 0,
    sauce: 1,
  } as Order,
  orderNumber: 789,
  table: 'VIP Table 1',
  waiter: 'Sarah K.',
  sentTime: new Date(),
}

export const CustomTime = Template.bind({})
CustomTime.args = {
  order: {
    rice: true,
    fish: 1,
    garnish: 2,
    sauce: 0,
  } as Order,
  orderNumber: 999,
  table: 'Bar Seat 3',
  waiter: 'Mike T.',
  sentTime: 'Dec 25, 2023, 7:30 PM',
}
