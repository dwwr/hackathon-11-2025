/** @jsxImportSource react */
import { useState, useEffect } from 'react'
import type { Meta } from '@storybook/react'
import Origami from './origami'
import Ticket from './ticket'
import { assets } from './origami/assets/index'

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
    'AC Carter',
    'Sweet Baby D',
    'Francois',
    'Jacoby',
    'Keanu',
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
  title: 'Components/Paperdoll Demo',
  component: Origami,
} satisfies Meta<typeof Origami>

export default meta

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
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        boxSizing: 'border-box',
        padding: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Origami order={randomOrder} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ticket
          order={randomOrder}
          orderNumber={ticketData.orderNumber}
          table={ticketData.table}
          waiter={ticketData.waiter}
          sentTime={ticketData.sentTime}
        />
      </div>
    </div>
  )
}
