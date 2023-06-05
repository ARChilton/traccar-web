import { useId, useEffect } from 'react';
import { useAttributePreference } from '../../common/util/preferences';
import { map } from '../core/MapView';
import useMapOverlays from './useMapOverlays';

const MapOverlay = () => {
  const id = useId();

  const mapOverlays = useMapOverlays();
  const selectedMapOverlay = useAttributePreference('selectedMapOverlay');
  const activeOverlay = mapOverlays.filter((overlay) => overlay.available).find((overlay) => overlay.id === selectedMapOverlay);
  const activePaint = activeOverlay?.paint || {}

  useEffect(() => {
    if (activeOverlay) {
      map.addSource(id, activeOverlay.source);
      map.addLayer({
        id,
        type: 'raster',
        source: id,
        layout: {
          visibility: 'visible',
        },
        paint: {
          // any paint fields for all overlays
          ...activePaint,
        },
      });
    }
    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  });

  return null;
};

export default MapOverlay;
