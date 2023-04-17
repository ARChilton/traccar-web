import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  color: {
    name: t('attributeColor'),
    type: 'string',
  },
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'number',
    subtype: 'speed',
  },
  polylineDistance: {
    name: t('attributePolylineDistance'),
    type: 'number',
    subtype: 'distance',
  },
  opacity: {
    name: 'Opacity (min: 0, max: 1)',
    type: 'number',
  },
  lineWidth: {
    name: 'Line Width',
    type: 'number',
  },
  lineOpacity: {
    name: 'Line Opacity (min:0, max: 1)',
    type: 'number',
  },
}), [t]);
