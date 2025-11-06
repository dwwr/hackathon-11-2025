import React, { useState } from 'react'
import type { ReactNode } from 'react'

export interface DnDItem {
  id: string
  content: ReactNode
}

interface DnDContainerProps {
  items: DnDItem[]
  onItemsChange: (items: DnDItem[]) => void
  title?: string
  draggedItem: DnDItem | null
  onDragStart: (item: DnDItem) => void
  onDragEnd: () => void
}

const DnDContainer: React.FC<DnDContainerProps> = ({
  items,
  onItemsChange,
  title,
  draggedItem,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStart = (e: React.DragEvent, item: DnDItem) => {
    onDragStart(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault()
    if (!draggedItem) return

    const draggedIndex = items.findIndex((item) => item.id === draggedItem.id)

    if (targetId) {
      // Dropping on a specific item - reorder within container
      const targetIndex = items.findIndex((item) => item.id === targetId)
      if (
        draggedIndex !== -1 &&
        targetIndex !== -1 &&
        draggedIndex !== targetIndex
      ) {
        const newItems = [...items]
        const [removed] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, removed)
        onItemsChange(newItems)
      }
    } else {
      // Dropping on empty container - add if not already present
      if (draggedIndex === -1) {
        onItemsChange([...items, draggedItem])
      }
    }

    onDragEnd()
  }

  const handleRemove = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e)}
      style={{
        minHeight: '200px',
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {title && (
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
          {title}
        </h3>
      )}
      {items.length === 0 && (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          Drop items here
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={onDragEnd}
          style={{
            padding: '1rem',
            backgroundColor:
              draggedItem?.id === item.id ? '#e3f2fd' : '#ffffff',
            border: '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'move',
            transition: 'background-color 0.2s',
            position: 'relative',
          }}
        >
          <button
            onClick={() => handleRemove(item.id)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '14px',
              lineHeight: '1',
            }}
          >
            ×
          </button>
          {item.content}
        </div>
      ))}
    </div>
  )
}

interface DnDProps {
  sourceItems?: DnDItem[]
  destinationItems?: DnDItem[]
  sourceTitle?: string
  destinationTitle?: string
}

const DnD: React.FC<DnDProps> = ({
  sourceItems = [],
  destinationItems = [],
  sourceTitle = 'Source',
  destinationTitle = 'Destination',
}) => {
  const [source, setSource] = useState<DnDItem[]>(sourceItems)
  const [destination, setDestination] = useState<DnDItem[]>(destinationItems)
  const [draggedItem, setDraggedItem] = useState<DnDItem | null>(null)
  const [draggedFromContainer, setDraggedFromContainer] = useState<
    'source' | 'destination' | null
  >(null)

  const handleSourceDragStart = (item: DnDItem) => {
    setDraggedItem(item)
    setDraggedFromContainer('source')
  }

  const handleDestinationDragStart = (item: DnDItem) => {
    setDraggedItem(item)
    setDraggedFromContainer('destination')
  }

  const handleSourceChange = (newItems: DnDItem[]) => {
    setSource(newItems)

    // If item was removed from source and dropped in destination, it will be handled by destination change
    // If item was added to source from destination, remove from destination
    if (draggedItem && draggedFromContainer === 'destination') {
      const wasAdded =
        newItems.find((item) => item.id === draggedItem.id) &&
        !source.find((item) => item.id === draggedItem.id)
      if (wasAdded) {
        setDestination(destination.filter((item) => item.id !== draggedItem.id))
      }
    }
  }

  const handleDestinationChange = (newItems: DnDItem[]) => {
    setDestination(newItems)

    // If item was added to destination from source, remove from source
    if (draggedItem && draggedFromContainer === 'source') {
      const wasAdded =
        newItems.find((item) => item.id === draggedItem.id) &&
        !destination.find((item) => item.id === draggedItem.id)
      if (wasAdded) {
        setSource(source.filter((item) => item.id !== draggedItem.id))
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggedFromContainer(null)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: 1, minWidth: '300px' }}>
        <DnDContainer
          items={source}
          onItemsChange={handleSourceChange}
          title={sourceTitle}
          draggedItem={draggedItem}
          onDragStart={handleSourceDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <DnDContainer
          items={destination}
          onItemsChange={handleDestinationChange}
          title={destinationTitle}
          draggedItem={draggedItem}
          onDragStart={handleDestinationDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  )
}

export default DnD
