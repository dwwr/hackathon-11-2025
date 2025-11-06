export interface OrigamiEngineProps {
  order: Order
  size?: number
}

export interface TicketProps {
  order: Order
  orderNumber?: number | string
  table?: string
  waiter?: string
  sentTime?: Date | string
}

export interface Order {
  rice: boolean
  fish: number
  garnish?: number
  sauce?: number
}
