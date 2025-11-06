import React from 'react'
import passImage from '../../assets/pass.jpg'
import Origami from '../../components/origami'
import Ticket from '../../components/ticket'
import type { Order } from '@/types'

interface ExpoSceneProps {
  order: Order
  ticket: Order
  serverName: string
  tableNumber: number
  score: number
  stars: number
  sentTime: Date
}

const Plate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '320px',
        height: '240px',
      }}
    >
      {/* Plate shadow */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '220px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(8px)',
        }}
      />
      {/* Plate rim */}
      <div
        style={{
          position: 'absolute',
          width: '310px',
          height: '230px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #f8f8f8, #e0e0e0)',
          border: '3px solid #d0d0d0',
          boxShadow:
            'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      />
      {/* Plate center */}
      <div
        style={{
          position: 'absolute',
          width: '290px',
          height: '210px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      />
      {/* Content on plate */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

const ExpoScene: React.FC<ExpoSceneProps> = ({
  order,
  ticket,
  serverName,
  sentTime,
  score,
  stars,
  tableNumber,
}: ExpoSceneProps) => {
  const starsArray = Array.from({ length: stars }, (_, i) => i)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '2rem',
        gap: '2rem',
        backgroundColor: '#f5f5f5',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url(${passImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Left side - Info display */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginLeft: '2rem',
          marginTop: '2rem',
        }}
      >
        {/* Score and stars display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '1rem',
            border: '2px solid rgba(180, 180, 180, 0.6)',
            borderRadius: '10px',
            background: 'linear-gradient(145deg, #e8e8e8, #c8c8c8)',
            boxShadow:
              '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
            minWidth: '300px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#2a2a2a',
              textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Score:</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>{score}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '20px',
            }}
          >
            {starsArray.map((i) => (
              <span key={i} style={{ color: '#ffd700' }}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {/* Ticket and Origami */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4rem',
          }}
        >
          {/* Left side - Ticket display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ticket
              order={ticket}
              waiter={serverName}
              sentTime={sentTime}
              table={`Table ${tableNumber}`}
            />
          </div>

          {/* Right side - Order display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plate>
              <Origami order={order} size={200} />
            </Plate>
          </div>
        </div>

        {/* Submit and Reject buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => console.log('Order rejected:', { order, ticket })}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '16px',
              fontFamily: 'monospace',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d32f2f'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f44336'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Reject
          </button>
          <button
            onClick={() => console.log('Order submitted:', { order, ticket })}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '16px',
              fontFamily: 'monospace',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4caf50'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpoScene
