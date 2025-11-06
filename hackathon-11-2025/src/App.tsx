import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

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
    const url = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:2808'
    const s = io(url)
  
    s.on('connect', () => {
      setStatus(`Connected (${s.id})`)
    })
  
    s.on('disconnect', () => {
      setStatus('Disconnected')
      setScreen('menu')
    })
  
    s.on('gameStart', data => {
      console.log('Game started:', data)
      setScreen('game')
    })
  
    s.on('gameOver', data => {
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
  const [score, setScore] = useState<number>(0)
  const [stars, setStars] = useState<number>(5)

  useEffect(() => {
    if (!socket) return

    // Listen for new orders
    socket.on('newOrder', (order: any) => {
      console.log('🧾 New order:', order)
      setOrderId(order.id)
    })

    // Listen for score updates
    socket.on('scoreUpdate', (data: any) => {
      console.log('📊 Score update:', data)
      setScore(data.score)
      setStars(data.stars)
      if (data.orderStatus) setOrderId(null) // clear current order if completed
    })

    // Listen for game over
    socket.on('gameOver', (data: any) => {
      alert(`Game Over! Final Score: ${data.finalScore}`)
      setScreen('menu')
    })

    return () => {
      socket.off('newOrder')
      socket.off('scoreUpdate')
      socket.off('gameOver')
    }
  }, [socket])

  // --- UI SCREENS ---

  // Menu screen
  if (screen === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center space-y-6">
        <h1 className="text-3xl font-bold mb-2">🍣 Sushi Game</h1>
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
            onChange={e => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            className="text-black px-3 py-2 rounded mb-2"
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
    // Handlers
    const handleCreateOrder = () => {
      socket?.emit('createOrder', (res: any) => {
        console.log('createOrder →', res)
        if (res?.order?.id) setOrderId(res.order.id)
      })
    }
  
    const handleCompleteOrder = (status: 'pass' | 'fail') => {
      if (!orderId) return
      socket?.emit('completeOrder', { orderId, status }, (res: any) => {
        console.log('completeOrder →', res)
        setOrderId(null)
      })
    }
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
        <h1 className="text-3xl font-bold">Game Scene</h1>
        <p>Match ID: {matchId}</p>
        <p>You are <strong>{role}</strong></p>
  
        <div className="flex gap-4 mt-4">
          <div className="bg-gray-800 px-4 py-2 rounded">⭐ Stars: {stars}</div>
          <div className="bg-gray-800 px-4 py-2 rounded">🏆 Score: {score}</div>
        </div>
  
        {/* Show create order only if no order exists */}
        {!orderId && (
          <button
            onClick={handleCreateOrder}
            className="px-6 py-3 bg-yellow-600 rounded hover:bg-yellow-700 mt-6"
          >
            Create Order
          </button>
        )}
  
        {/* If an order exists, show its ID and pass/fail buttons */}
        {orderId && (
          <div className="flex flex-col items-center mt-6 space-y-3">
            <p className="text-green-400 font-mono">Order ID: {orderId}</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleCompleteOrder('pass')}
                className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
              >
                ✅ Pass Order
              </button>
              <button
                onClick={() => handleCompleteOrder('fail')}
                className="px-6 py-3 bg-red-600 rounded hover:bg-red-700"
              >
                ❌ Fail Order
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  

  return null
}
