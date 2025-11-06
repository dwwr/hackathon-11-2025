/** @jsxImportSource react */
import type { Meta, StoryFn } from '@storybook/react'
import DnD, { type DnDItem } from '.'
import Origami from '../origami'
import type { Order } from '@/types'

const meta = {
  title: 'Components/Drag and Drop',
  component: DnD,
} satisfies Meta<typeof DnD>

export default meta

const Template: StoryFn<typeof DnD> = (args) => <DnD {...args} />

export const Default = Template.bind({})
Default.args = {}

export const OrigamiDragAndDrop = Template.bind({})
OrigamiDragAndDrop.args = {
  sourceTitle: 'Available Orders',
  destinationTitle: 'Selected Orders',
  sourceItems: [
    {
      id: '1',
      content: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Origami
            order={
              {
                rice: true,
                fish: 1,
                garnish: 1,
                sauce: 2,
              } as Order
            }
          />
          <span style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            Tamago Nigiri
          </span>
        </div>
      ),
    },
    {
      id: '2',
      content: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Origami
            order={
              {
                rice: false,
                fish: 1,
                garnish: undefined,
                sauce: undefined,
              } as Order
            }
          />
          <span style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            Tamago Sashimi
          </span>
        </div>
      ),
    },
    {
      id: '3',
      content: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Origami
            order={
              {
                rice: true,
                fish: 2,
                garnish: 0,
                sauce: 1,
              } as Order
            }
          />
          <span style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            Tuna Nigiri
          </span>
        </div>
      ),
    },
    {
      id: '4',
      content: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Origami
            order={
              {
                rice: true,
                fish: 4,
                garnish: 2,
                sauce: 0,
              } as Order
            }
          />
          <span style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            Yellowtail Full
          </span>
        </div>
      ),
    },
  ] as DnDItem[],
  destinationItems: [] as DnDItem[],
}
