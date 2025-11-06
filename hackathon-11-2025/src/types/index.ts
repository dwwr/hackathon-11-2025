export interface OrigamiEngineProps {
  order: Order
}

export interface Order {
  rice: boolean
  fish: number
  garnish?: number
  sauce?: number
}
