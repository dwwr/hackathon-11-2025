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

  // Game scene (shared for player1 and player2)
  if (screen === 'game') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
        <h1 className="text-3xl font-bold">Game Scene</h1>
        <p>Match ID: {matchId}</p>
        <p>You are <strong>{role}</strong></p>
        <button
          onClick={() => socket?.emit('createOrder', res => console.log('createOrder →', res))}
          className="px-6 py-3 bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Create Order
        </button>
        <button
          onClick={() =>
            socket?.emit(
              'completeOrder',
              { orderId: 'fake', status: 'fail' },
              res => console.log('completeOrder →', res)
            )
          }
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-700"
        >
          Fail Order (Test Game Over)
        </button>
      </div>
    )
  }

  return null
}
