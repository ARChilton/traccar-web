import { useEffect } from 'react'

export const useHillShadeToggle = ({ map, hillShadeLayerName }) => {
  useEffect(() => {
    const hillshadeToggle = ({ terrain }) => {
      if (map.getLayer(hillShadeLayerName)) {
        if (terrain) {
          map.setLayoutProperty(hillShadeLayerName, 'visibility', 'visible');
        } else {
          map.setLayoutProperty(hillShadeLayerName, 'visibility', 'none');
        }
      }
    }
    map.on('terrain', hillshadeToggle)
    return () => { map.off('terrain', hillshadeToggle) }
  }, [])
}
