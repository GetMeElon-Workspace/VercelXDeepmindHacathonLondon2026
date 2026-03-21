import { Node, Edge } from 'reactflow';

export type BaseNodeData = {
  label: string;
  type: 'calc' | 'physics' | 'financial';
  data: Array<{ label: string; value: string }>;
};

export const initialNodes: Node<BaseNodeData>[] = [
  {
    id: 'feedstock',
    type: 'base',
    position: { x: 350, y: 150 },
    data: {
      label: 'Feedstock Input',
      type: 'physics',
      data: [
        { label: 'Feed Rate', value: '1000 kg/hr' },
        { label: 'Temperature', value: '25 °C' },
      ],
    },
  },
  {
    id: 'reactor',
    type: 'base',
    position: { x: 350, y: 400 },
    data: {
      label: 'Main Reactor',
      type: 'calc',
      data: [
        { label: 'Conversion', value: '85 %' },
        { label: 'Pressure', value: '5 atm' },
        { label: 'Temperature', value: '350 °C' },
      ],
    },
  },
  {
    id: 'heatex',
    type: 'base',
    position: { x: 350, y: 650 },
    data: {
      label: 'Heat Exchanger',
      type: 'physics',
      data: [
        { label: 'Cooling Duty', value: '500 kW' },
        { label: 'Outlet Temp', value: '80 °C' },
      ],
    },
  },
  {
    id: 'product',
    type: 'base',
    position: { x: 350, y: 900 },
    data: {
      label: 'Product Output',
      type: 'physics',
      data: [
        { label: 'Yield', value: '820 kg/hr' },
        { label: 'Purity', value: '99.5 %' },
      ],
    },
  },
  {
    id: 'cost',
    type: 'base',
    position: { x: 350, y: 1150 },
    draggable: false,
    data: {
      label: 'Cost Summary',
      type: 'financial',
      data: [
        { label: 'OpEx', value: '$120 /hr' },
        { label: 'Profit Margin', value: '22 %' },
      ],
    },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'feedstock', target: 'reactor', animated: true },
  { id: 'e2-3', source: 'reactor', target: 'heatex', animated: true },
  { id: 'e3-4', source: 'heatex', target: 'product', animated: true },
  { id: 'e4-5', source: 'product', target: 'cost', animated: true },
];

export const completedFranceNodes: Node<BaseNodeData>[] = [
  ...initialNodes,
  {
    id: 'france-feedstock',
    type: 'base',
    position: { x: 50, y: 150 },
    data: {
      label: 'Feedstock Localization',
      type: 'physics',
      data: [
        { label: 'Local Feedstock', value: 'European Supply' },
        { label: 'Price Premium', value: '15 %' },
      ],
    },
  },
  {
    id: 'france-ets',
    type: 'base',
    position: { x: 650, y: 1150 },
    data: {
      label: 'EU ETS',
      type: 'financial',
      data: [
        { label: 'Carbon Tax', value: '€90 /tonne' },
        { label: 'Allowance', value: 'Reduced' },
      ],
    },
  }
];

export const completedFranceEdges: Edge[] = [
  ...initialEdges,
  { id: 'e-feedstock-fr', source: 'france-feedstock', target: 'feedstock', animated: true },
  { id: 'e-ets-cost', source: 'france-ets', target: 'cost', animated: true },
];