import React, { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import ExpoScene from './scenes/expo_scene/expo_scene'
import ChefScene from './scenes/chef_scene/chef_scene'
import Origami from './components/origami'
import { assets } from './assets/index'
import type { Order } from './types'

// Add CSS for yellow input placeholder and marquee animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    input[type="text"]::placeholder {
      color: rgba(255, 235, 59, 0.6);
    }
    input[type="text"]:focus::placeholder {
      color: rgba(255, 235, 59, 0.4);
    }
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .sushi-marquee {
      animation: marquee 30s linear infinite;
    }
  `
  if (!document.head.querySelector('style[data-app-styles]')) {
    styleSheet.setAttribute('data-app-styles', 'true')
    document.head.appendChild(styleSheet)
  }
}

// Generate random order for marquee
const generateRandomOrder = (): Order => {
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

// Menu Screen Component with Marquee
const MenuScreen: React.FC<{
  status: string
  inviteCode: string
  setInviteCode: (code: string) => void
  handleCreateMatch: () => void
  handleJoinMatch: () => void
}> = ({
  status,
  inviteCode,
  setInviteCode,
  handleCreateMatch,
  handleJoinMatch,
}) => {
  // Generate random orders for marquee
  const [marqueeOrders, setMarqueeOrders] = useState<Order[]>(() =>
    Array.from({ length: 20 }, () => generateRandomOrder()),
  )

  useEffect(() => {
    // Regenerate orders periodically for variety
    const interval = setInterval(() => {
      setMarqueeOrders((prev) => [...prev.slice(1), generateRandomOrder()])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center space-y-6">
      <h1
        style={{
          fontSize: '6rem',
          fontStyle: 'italic',
          color: '#ffeb3b',
          textShadow:
            '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          lineHeight: '1.2',
        }}
      >
        板前 On The Line: Sushi-ya Tactics
      </h1>

      {/* Sushi marquee */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          marginBottom: '2rem',
          position: 'relative',
          height: '120px',
        }}
      >
        <div
          className="sushi-marquee"
          style={{
            display: 'flex',
            gap: '3rem',
            width: 'fit-content',
            alignItems: 'center',
          }}
        >
          {/* Duplicate the orders for seamless looping */}
          {[...marqueeOrders, ...marqueeOrders].map((order, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Origami order={order} size={80} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm opacity-80">{status}</p>

      <button
        onClick={handleCreateMatch}
        className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
      >
        Create Match
      </button>

      <div className="flex flex-col items-center">
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter invite code"
          style={{
            color: '#ffeb3b',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid #ffeb3b',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            marginBottom: '0.5rem',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#ffc107'
            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 235, 59, 0.5)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ffeb3b'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <button
          onClick={handleJoinMatch}
          className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
        >
          Join Match
        </button>
      </div>
    </div>
  )
}

interface MatchResponse {
  success: boolean
  matchId: string
  inviteCode: string
  playerRole: 'player1' | 'player2'
  message: string
}

type Screen = 'menu' | 'waiting' | 'game'

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [screen, setScreen] = useState<Screen>('menu')
  const [inviteCode, setInviteCode] = useState('')
  const [matchId, setMatchId] = useState('')
  const [role, setRole] = useState<'player1' | 'player2' | null>(null)
  const [status, setStatus] = useState('Disconnected')

  // Connect once on mount
  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:2808'
    const s = io(url, {
      transports: ['websocket', 'polling'],
    })

    s.on('connect', () => {
      setStatus(`Connected (${s.id})`)
    })

    s.on('disconnect', () => {
      setStatus('Disconnected')
      setScreen('menu')
    })

    s.on('gameStart', (data) => {
      console.log('Game started:', data)
      // INSERT_YOUR_CODE
      s.emit('createOrder', () => {})
      setScreen('game')
    })

    s.on('gameOver', (data) => {
      alert(`Game Over! Final Score: ${data.finalScore}`)
      setScreen('menu')
    })

    setSocket(s)

    // ✅ return a cleanup FUNCTION (not the socket)
    return () => {
      s.disconnect()
    }
  }, [])

  // --- CREATE MATCH ---
  const handleCreateMatch = () => {
    if (!socket) return

    socket.emit('createMatch', 'player1', (res: MatchResponse) => {
      if (res.success) {
        setMatchId(res.matchId)
        setInviteCode(res.inviteCode)
        setRole('player1')
        setScreen('waiting')
      } else {
        alert(res.message)
      }
    })
  }

  // --- JOIN MATCH ---
  const handleJoinMatch = () => {
    if (!socket || !inviteCode) return

    socket.emit('joinMatch', inviteCode, (res: MatchResponse) => {
      if (res.success) {
        setMatchId(res.matchId)
        setRole(res.playerRole)
        setScreen('game')
      } else {
        alert(res.message)
      }
    })
  }

  const [orderId, setOrderId] = useState<string | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [currentTicket, setCurrentTicket] = useState<Order | null>(null)
  const [score, setScore] = useState<number>(0)
  const [stars, setStars] = useState<number>(5)
  const [serverName, setServerName] = useState<string>('Server Name')
  const [tableNumber, setTableNumber] = useState<number>(12)
  const [sentTime, setSentTime] = useState<Date>(new Date())

  useEffect(() => {
    if (!socket) return

    // Listen for new orders - server should send full order data
    socket.on('newOrder', (data: any) => {
      console.log('🧾 New order received:', data)

      // Handle different possible data structures from server
      let orderData: Order | null = null
      let orderIdValue: string | null = null

      if (data.order) {
        // If order is nested in data.order
        orderData = data.order as Order
        orderIdValue = data.id || data.order.id
      } else if (data.rice !== undefined || data.fish !== undefined) {
        // If order data is at top level
        orderData = data as Order
        orderIdValue = data.id
      } else if (data.id) {
        // If only ID is sent, we'll need the server to send full order
        // For now, log a warning
        console.warn(
          'Received order with only ID, but need full order data:',
          data.id,
        )
        setOrderId(data.id)
        return
      }

      if (orderData) {
        // Ticket shows what was ordered (from server)
        setCurrentTicket(orderData)
        // Origami starts blank - waiting for chef to submit their order
        setCurrentOrder({
          rice: false,
          fish: -1,
        })
        setOrderId(orderIdValue || null)

        // Update metadata if provided
        if (data.serverName) setServerName(data.serverName)
        if (data.tableNumber !== undefined) setTableNumber(data.tableNumber)
        if (data.sentTime) setSentTime(new Date(data.sentTime))
        else setSentTime(new Date()) // Default to current time
      }
    })

    // Listen for chef's order progress (real-time updates as chef builds)
    socket.on('orderProgress', (data: any) => {
      console.log('👨‍🍳 Order progress update received:', data)
      let orderData: Order | null = null

      if (data.order) {
        orderData = data.order as Order
      } else if (data.rice !== undefined || data.fish !== undefined) {
        orderData = data as Order
      }

      if (orderData) {
        console.log('👨‍🍳 Setting currentOrder to:', orderData)
        setCurrentOrder(orderData)
      } else {
        console.warn('👨‍🍳 Could not parse order data from:', data)
      }
    })

    // Listen for chef's completed order (what the chef actually made)
    socket.on('chefOrderSubmitted', (data: any) => {
      console.log('👨‍🍳 Chef order submitted:', data)
      if (data.order) {
        setCurrentOrder(data.order as Order)
      } else if (data.rice !== undefined || data.fish !== undefined) {
        setCurrentOrder(data as Order)
      }
    })

    // Listen for score updates
    socket.on('scoreUpdate', (data: any) => {
      console.log('📊 Score update:', data)
      setScore(data.score)
      setStars(data.stars)
      if (data.orderStatus) {
        setOrderId(null)
        setCurrentOrder(null)
        setCurrentTicket(null)
      }
    })

    // Listen for game over
    socket.on('gameOver', (data: any) => {
      alert(`Game Over! Final Score: ${data.finalScore}`)
      setScreen('menu')
      setCurrentOrder(null)
      setCurrentTicket(null)
      setOrderId(null)
    })

    return () => {
      socket.off('newOrder')
      socket.off('orderProgress')
      socket.off('chefOrderSubmitted')
      socket.off('scoreUpdate')
      socket.off('gameOver')
    }
  }, [socket])

  // --- UI SCREENS ---

  // Menu screen
  if (screen === 'menu') {
    // Generate random orders for marquee
    const [marqueeOrders, setMarqueeOrders] = useState<Order[]>(() =>
      Array.from({ length: 20 }, () => generateRandomOrder()),
    )

    useEffect(() => {
      // Regenerate orders periodically for variety
      const interval = setInterval(() => {
        setMarqueeOrders((prev) => [...prev.slice(1), generateRandomOrder()])
      }, 2000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center space-y-6">
        <h1
          style={{
            fontSize: '6rem',
            fontStyle: 'italic',
            color: '#ffeb3b',
            textShadow:
              '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            lineHeight: '1.2',
          }}
        >
          板前 On The Line: Sushi-ya Tactics
        </h1>

        {/* Sushi marquee */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            marginBottom: '2rem',
            position: 'relative',
            height: '120px',
          }}
        >
          <div
            className="sushi-marquee"
            style={{
              display: 'flex',
              gap: '3rem',
              width: 'fit-content',
              alignItems: 'center',
            }}
          >
            {/* Duplicate the orders for seamless looping */}
            {[...marqueeOrders, ...marqueeOrders].map((order, index) => (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Origami order={order} size={80} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm opacity-80">{status}</p>

        <button
          onClick={handleCreateMatch}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Create Match
        </button>

        <div className="flex flex-col items-center">
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            style={{
              color: '#ffeb3b',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '2px solid #ffeb3b',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ffc107'
              e.target.style.boxShadow = '0 0 10px rgba(255, 235, 59, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ffeb3b'
              e.target.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={handleJoinMatch}
            className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
          >
            Join Match
          </button>
        </div>
      </div>
    )
  }

  // Waiting screen
  if (screen === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center space-y-6">
        <h1 className="text-2xl font-bold">Match Created</h1>
        <p>Invite Code:</p>
        <p className="text-4xl text-green-400 font-mono">{inviteCode}</p>
        <p className="opacity-70">Waiting for another player to join...</p>
      </div>
    )
  }

  if (screen === 'game') {
    // Render ExpoScene for player1, ChefScene for player2
    if (role === 'player1') {
      // Default empty order
      const emptyOrder: Order = {
        rice: false,
        fish: -1,
      }

      // Use currentOrder if it exists, otherwise empty
      const orderToDisplay = currentOrder || emptyOrder
      // Use currentTicket if it exists, otherwise empty (will show empty ticket)
      const ticketToDisplay = currentTicket || emptyOrder

      console.log(
        '📺 Rendering ExpoScene with order:',
        orderToDisplay,
        'ticket:',
        ticketToDisplay,
      )

      return (
        <ExpoScene
          order={orderToDisplay}
          ticket={ticketToDisplay}
          serverName={serverName}
          tableNumber={tableNumber}
          score={score}
          stars={stars}
          sentTime={sentTime}
          socket={socket}
          orderId={orderId}
        />
      )
    }

    if (role === 'player2') {
      return <ChefScene socket={socket} />
    }

    // Fallback if role is not set yet
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <p>Match ID: {matchId}</p>
        <p>Role: {role || 'Unknown'}</p>
      </div>
    )
  }

  return null
}
