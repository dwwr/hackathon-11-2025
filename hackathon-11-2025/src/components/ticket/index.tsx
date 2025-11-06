import React from 'react'
import type { Order } from '@/types'

export interface TicketProps {
  order: Order
}

const Ticket: React.FC<TicketProps> = ({ order }) => {
  const { rice, fish, garnish, sauce } = order

  return (
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
  )
}

export default Ticket
