import React from 'react'
import { getItemName } from './item_map'
import type { TicketProps } from '@/types'
import { formatDate } from './format_date'

const Ticket: React.FC<TicketProps> = ({
  order,
  orderNumber = 466,
  table,
  waiter,
  sentTime,
}) => {
  const { rice, fish, garnish, sauce } = order
  const formattedTime = formatDate(sentTime)

  return (
    <div
      style={{
        backgroundColor: '#fefefe',
        color: '#1a1a1a',
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.4',
        padding: '16px',
        maxWidth: '400px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#1a1a1a' }}>Order:</span>{' '}
        <span style={{ color: '#d32f2f' }}>{orderNumber}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#1a1a1a' }}>Table:</span>{' '}
        <span style={{ color: '#d32f2f' }}>{table}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#1a1a1a' }}>Waiter:</span>{' '}
        <span style={{ color: '#d32f2f' }}>{waiter}</span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ color: '#1a1a1a' }}>Sent:</span>{' '}
        <span style={{ color: '#d32f2f' }}>{formattedTime}</span>
      </div>

      <div
        style={{
          borderTop: '1px dashed #ccc',
          margin: '12px 0',
          paddingTop: '8px',
        }}
      >
        <div style={{ marginBottom: '4px', color: '#1a1a1a' }}>
          <strong>Course 1</strong>
        </div>
        {rice && (
          <div
            style={{ marginLeft: '8px', marginBottom: '2px', color: '#1a1a1a' }}
          >
            -{' '}
            <span style={{ color: '#d32f2f' }}>
              {getItemName('rice', 0, rice)}
            </span>
          </div>
        )}
        {fish >= 0 && (
          <div
            style={{ marginLeft: '8px', marginBottom: '2px', color: '#1a1a1a' }}
          >
            -{' '}
            <span style={{ color: '#d32f2f' }}>
              {getItemName('fish', fish)}
            </span>
          </div>
        )}
        {garnish !== undefined && garnish >= 0 && (
          <div
            style={{
              marginLeft: '16px',
              marginBottom: '2px',
              color: '#1a1a1a',
            }}
          >
            +{' '}
            <span style={{ color: '#d32f2f' }}>
              {getItemName('garnish', garnish)}
            </span>
          </div>
        )}
        {sauce !== undefined && sauce >= 0 && (
          <div
            style={{
              marginLeft: '16px',
              marginBottom: '2px',
              color: '#1a1a1a',
            }}
          >
            +{' '}
            <span style={{ color: '#d32f2f' }}>
              {getItemName('sauce', sauce)}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px dashed #ccc',
          margin: '12px 0',
          paddingTop: '8px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#1a1a1a' }}>Order:</span>{' '}
          <span style={{ color: '#d32f2f' }}>{orderNumber}</span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#1a1a1a' }}>Table:</span>{' '}
          <span style={{ color: '#d32f2f' }}>{table}</span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#1a1a1a' }}>Waiter:</span>{' '}
          <span style={{ color: '#d32f2f' }}>{waiter}</span>
        </div>
        <div>
          <span style={{ color: '#1a1a1a' }}>Sent:</span>{' '}
          <span style={{ color: '#d32f2f' }}>{formattedTime}</span>
        </div>
      </div>
    </div>
  )
}

export default Ticket
