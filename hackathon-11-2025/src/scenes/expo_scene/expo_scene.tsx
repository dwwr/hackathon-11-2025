import React, { useState, useEffect } from 'react'
import passImage from '../../assets/pass.jpg'
import Origami from '../../components/origami'
import Ticket from '../../components/ticket'
import type { Order } from '@/types'
import type { Socket } from 'socket.io-client'

// Add CSS animation for fade in/out
const successMessageStyle = `
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.05);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = successMessageStyle
  if (!document.head.querySelector('style[data-success-message]')) {
    styleSheet.setAttribute('data-success-message', 'true')
    document.head.appendChild(styleSheet)
  }
}

interface ExpoSceneProps {
  order: Order
  ticket: Order
  serverName: string
  tableNumber: number
  score: number
  stars: number
  sentTime: Date
  socket?: Socket | null
  orderId?: string | null
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
  order: initialOrder,
  ticket,
  serverName,
  sentTime,
  score,
  stars,
  tableNumber,
  socket,
  orderId,
}: ExpoSceneProps) => {
  const starsArray = Array.from({ length: stars }, (_, i) => i)

  // Local state for the order (updated via socket)
  const [currentOrder, setCurrentOrder] = useState<Order>(initialOrder)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showFailureMessage, setShowFailureMessage] = useState(false)

  // Compare order with ticket to determine if they match
  const compareOrder = (order: Order, ticketOrder: Order): boolean => {
    // Check all keys match
    if (order.rice !== ticketOrder.rice) return false
    if (order.fish !== ticketOrder.fish) return false

    // Handle optional fields - both must be undefined or both must match
    if ((order.garnish === undefined) !== (ticketOrder.garnish === undefined)) {
      return false
    }
    if (order.garnish !== undefined && order.garnish !== ticketOrder.garnish) {
      return false
    }

    if ((order.sauce === undefined) !== (ticketOrder.sauce === undefined)) {
      return false
    }
    if (order.sauce !== undefined && order.sauce !== ticketOrder.sauce) {
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!socket || !orderId) {
      console.warn('Cannot submit: missing socket or orderId')
      return
    }

    const isPass = compareOrder(currentOrder, ticket)
    const status: 'pass' | 'fail' = isPass ? 'pass' : 'fail'

    console.log('📤 Submitting order:', {
      orderId,
      status,
      order: currentOrder,
      ticket,
    })

    socket.emit('completeOrder', { orderId, status }, (res: any) => {
      console.log('completeOrder response:', res)

      // Show message based on status
      if (status === 'pass') {
        setShowSuccessMessage(true)
      } else {
        setShowFailureMessage(true)
      }

      // Restart the loop by requesting a new order
      if (res.success !== false) {
        console.log('🔄 Requesting new order to restart loop...')
        socket.emit('createOrder', (createRes: any) => {
          console.log('createOrder response:', createRes)
        })
      }
    })
  }

  const handleReject = () => {
    if (!socket || !orderId) {
      console.warn('Cannot reject: missing socket or orderId')
      return
    }

    console.log('📤 Rejecting order:', { orderId, order: currentOrder, ticket })

    socket.emit(
      'completeOrder',
      { orderId, status: 'fail' as const },
      (res: any) => {
        console.log('completeOrder response:', res)

        // Show failure message
        setShowFailureMessage(true)

        // Restart the loop by requesting a new order
        if (res.success !== false) {
          console.log('🔄 Requesting new order to restart loop...')
          socket.emit('createOrder', (createRes: any) => {
            console.log('createOrder response:', createRes)
          })
        }
      },
    )
  }

  // Listen for orderProgress updates
  useEffect(() => {
    if (!socket) return

    const handleOrderProgress = (data: any) => {
      console.log('📦 ExpoScene: Order progress update received:', data)
      let orderData: Order | null = null

      if (data.order) {
        orderData = data.order as Order
      } else if (data.rice !== undefined || data.fish !== undefined) {
        orderData = data as Order
      }

      if (orderData) {
        console.log('📦 ExpoScene: Updating order to:', orderData)
        setCurrentOrder(orderData)
      } else {
        console.warn('📦 ExpoScene: Could not parse order data from:', data)
      }
    }

    socket.on('orderProgress', handleOrderProgress)

    return () => {
      socket.off('orderProgress', handleOrderProgress)
    }
  }, [socket])

  // Update local state if prop changes
  useEffect(() => {
    setCurrentOrder(initialOrder)
  }, [initialOrder])

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])

  // Auto-hide failure message after 3 seconds
  useEffect(() => {
    if (showFailureMessage) {
      const timer = setTimeout(() => {
        setShowFailureMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showFailureMessage])

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
        position: 'relative',
      }}
    >
      {/* Celebratory success message */}
      {showSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            padding: '2rem 4rem',
            backgroundColor: 'rgba(76, 175, 80, 0.95)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeInOut 3s ease-in-out',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🎉</span>
          <span>Perfect! Order Complete!</span>
          <span style={{ fontSize: '3rem' }}>🎉</span>
        </div>
      )}

      {/* Failure message */}
      {showFailureMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            padding: '2rem 4rem',
            backgroundColor: 'rgba(244, 67, 54, 0.95)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeInOut 3s ease-in-out',
          }}
        >
          <span style={{ fontSize: '3rem' }}>❌</span>
          <span>Order Mismatch! Please Try Again</span>
          <span style={{ fontSize: '3rem' }}>❌</span>
        </div>
      )}
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
              <Origami order={currentOrder} size={200} />
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
            onClick={handleReject}
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
            onClick={handleSubmit}
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
