import React from 'react'
import { assets } from './assets/index'

const Origami: React.FC<Props> = ({ order }: Props) => {
  const { rice, fish, garnish, sauce } = order

  const fishAsset = assets.fish[fish]
  const garnishAsset = garnish ? assets.garnish[garnish] : null
  const sauceAsset = sauce ? assets.sauce[sauce] : null

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
        }}
      >
        {rice && <img src={assets.rice} alt="Rice" />}
        {fishAsset && (
          <img
            src={fishAsset}
            alt="Fish"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        )}
        {sauceAsset && (
          <img
            src={sauceAsset}
            alt="Sauce"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          />
        )}
        {garnishAsset && (
          <img
            src={garnishAsset}
            alt="Garnish"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 3,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Origami

interface Props {
  order: Order
}

interface Order {
  rice: boolean
  fish: number
  garnish?: number
  sauce?: number
}
