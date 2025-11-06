import React from 'react'
import Origami from '../components/origami'
import { assets } from '../assets/index'
import type { Order } from '@/types'

interface ChefSceneProps {
  // Props to be defined based on requirements
}

interface DraggableIngredientProps {
  order: Order
  type: 'rice' | 'fish' | 'garnish' | 'sauce'
  index: number
  label: string
}

const DraggableIngredient: React.FC<DraggableIngredientProps> = ({
  order,
  type,
  index,
  label,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type, index, order }),
    )
  }

  // Add extra margin for garnish and sauce to center them visually
  const ingredientStyle =
    type === 'garnish' || type === 'sauce' ? { marginTop: '2rem' } : {}

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        cursor: 'move',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={ingredientStyle}>
        <Origami order={order} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '500' }}>{label}</span>
    </div>
  )
}

const ChefScene: React.FC<ChefSceneProps> = () => {
  const fishNames = ['Salmon', 'Tamago', 'Tuna', 'Whitefish', 'Yellowtail']
  const garnishNames = ['Ginger', 'Momiji', 'Ume', 'Wasabi', 'Yuzu Kosho']
  const sauceNames = ['Aioli', 'Soy Sauce', 'Sriracha']

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
        Chef Ingredients
      </h1>

      {/* Rice Row */}
      <div>
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Rice
        </h2>
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
          />
        </div>
      </div>

      {/* Fish Row */}
      <div>
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Fish
        </h2>
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
            />
          ))}
        </div>
      </div>

      {/* Garnish Row */}
      <div>
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Garnish
        </h2>
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
            />
          ))}
        </div>
      </div>

      {/* Sauce Row */}
      <div>
        <h2
          style={{
            margin: '0 0 1rem 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Sauce
        </h2>
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChefScene
