import React, { useState } from 'react'
import Origami from '../components/origami'
import { assets } from '../assets/index'
import type { Order } from '@/types'
import lineImage from '../assets/line.jpg'

interface ChefSceneProps {
  easyMode?: boolean
}

interface IngredientRowLabelProps {
  title: string
  required?: boolean
}

const IngredientRowLabel: React.FC<IngredientRowLabelProps> = ({
  title,
  required = false,
}) => {
  return (
    <h2
      style={{
        margin: '0 0 1rem 0',
        fontSize: '24px',
        fontWeight: '600',
        color: '#0a1fa8',
        fontFamily: 'sans-serif',
        textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
        fontStyle: 'italic',
      }}
    >
      {title} ({required ? 'Required' : 'Optional'})
    </h2>
  )
}

interface DraggableIngredientProps {
  order: Order
  type: 'rice' | 'fish' | 'garnish' | 'sauce'
  index: number
  label: string
  easyMode?: boolean
}

const DraggableIngredient: React.FC<DraggableIngredientProps> = ({
  order,
  type,
  index,
  label,
  easyMode = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type, index, order }),
    )
  }
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '1rem',
        border: '2px solid rgba(180, 180, 180, 0.6)',
        borderRadius: '10px',
        background: 'linear-gradient(145deg, #e8e8e8, #c8c8c8)',
        cursor: 'move',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        boxShadow:
          '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow =
          '0 6px 16px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.background =
          'linear-gradient(145deg, #f0f0f0, #d0d0d0)'
        e.currentTarget.style.borderColor = 'rgba(200, 200, 200, 0.8)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow =
          '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.background =
          'linear-gradient(145deg, #e8e8e8, #c8c8c8)'
        e.currentTarget.style.borderColor = 'rgba(180, 180, 180, 0.6)'
      }}
    >
      <div>
        <Origami order={order} size={50} />
      </div>
      {easyMode && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: '#0a1fa8',
            fontFamily: 'sans-serif',
            textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
            fontStyle: 'italic',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

const ChefScene: React.FC<ChefSceneProps> = ({
  easyMode: initialEasyMode = false,
}) => {
  const fishNames = ['Salmon', 'Tamago', 'Tuna', 'Whitefish', 'Yellowtail']
  const garnishNames = ['Ginger', 'Momiji', 'Ume', 'Wasabi', 'Yuzu Kosho']
  const sauceNames = ['Aioli', 'Soy Sauce', 'Sriracha']

  const [easyMode, setEasyMode] = useState(initialEasyMode)
  const [debugMode, setDebugMode] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order>({
    rice: false,
    fish: -1,
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const { type, index } = JSON.parse(data)

      setCurrentOrder((prevOrder) => {
        const newOrder = { ...prevOrder }

        switch (type) {
          case 'rice':
            newOrder.rice = true
            break
          case 'fish':
            newOrder.fish = index
            break
          case 'garnish':
            // Only allow garnish if fish has been added
            if (prevOrder.fish >= 0) {
              newOrder.garnish = index
            }
            break
          case 'sauce':
            // Only allow sauce if fish has been added
            if (prevOrder.fish >= 0) {
              newOrder.sauce = index
            }
            break
        }

        return newOrder
      })
    } catch (error) {
      console.error('Error parsing drop data:', error)
    }
  }

  const clearOrder = () => {
    setCurrentOrder({
      rice: false,
      fish: -1,
    })
  }

  const handleSubmit = () => {
    console.log('Order submitted:', currentOrder)
  }

  // Show order preview if any ingredient has been added
  const hasAnyIngredient =
    currentOrder.rice ||
    currentOrder.fish >= 0 ||
    currentOrder.garnish !== undefined ||
    currentOrder.sauce !== undefined

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url(${lineImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Left side - Ingredients */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* Rice Row */}
        <div>
          <IngredientRowLabel title="Rice" required={false} />
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <DraggableIngredient
              order={{ rice: true, fish: -1 } as Order}
              type="rice"
              index={0}
              label="Rice"
              easyMode={easyMode}
            />
          </div>
        </div>

        {/* Fish Row */}
        <div>
          <IngredientRowLabel title="Fish" required={true} />
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {assets.fish.map((_, index) => (
              <DraggableIngredient
                key={`fish-${index}`}
                order={{ rice: false, fish: index }}
                type="fish"
                index={index}
                label={fishNames[index]}
                easyMode={easyMode}
              />
            ))}
          </div>
        </div>

        {/* Sauce Row */}
        <div>
          <IngredientRowLabel title="Sauce" required={false} />
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {assets.sauce.map((_, index) => (
              <DraggableIngredient
                key={`sauce-${index}`}
                order={{ rice: false, fish: -1, sauce: index } as Order}
                type="sauce"
                index={index}
                label={sauceNames[index]}
                easyMode={easyMode}
              />
            ))}
          </div>
        </div>

        {/* Garnish Row */}
        <div>
          <IngredientRowLabel title="Garnish" required={false} />
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {assets.garnish.map((_, index) => (
              <DraggableIngredient
                key={`garnish-${index}`}
                order={{ rice: false, fish: -1, garnish: index } as Order}
                type="garnish"
                index={index}
                label={garnishNames[index]}
                easyMode={easyMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Droppable area and order display */}
      <div
        style={{
          flex: 0,
          minWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 1rem 0',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            Build Your Order
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <button
              onClick={() => setEasyMode(!easyMode)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: easyMode ? '#4caf50' : '#e0e0e0',
                color: easyMode ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              Easy Mode
            </button>
            <button
              onClick={() => setDebugMode(!debugMode)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: debugMode ? '#2196f3' : '#e0e0e0',
                color: debugMode ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              Debug Mode
            </button>
          </div>
        </div>

        {/* Droppable area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            minHeight: '300px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            border: '3px dashed #ccc',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            e.currentTarget.style.borderColor = '#4caf50'
            e.currentTarget.style.backgroundColor = '#f1f8f4'
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.currentTarget.style.borderColor = '#ccc'
            e.currentTarget.style.backgroundColor = '#ffffff'
          }}
        >
          {hasAnyIngredient ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Origami order={currentOrder} />
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={clearOrder}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Order
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                color: '#999',
                fontSize: '16px',
              }}
            >
              <p>Drag ingredients here to build your order</p>
              <p style={{ fontSize: '12px', marginTop: '0.5rem' }}>
                Start with rice (optional), then add fish (required). Sauce and
                garnish (optional) can only be added after fish.
              </p>
            </div>
          )}
        </div>

        {/* Debug order display */}
        {debugMode && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Order State (Debug):
            </div>
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(currentOrder, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChefScene
