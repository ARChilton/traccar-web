import { useEffect } from 'react'
import maplibregl from 'maplibre-gl';
import { useAttributePreference } from '../../../common/util/preferences';

import { osTransform } from '../../../common/util/os-transform';

export const useMapLocationPopUp = ({ map }) => {
  const what3wordsKey = useAttributePreference('what3WordsToken')

  useEffect(() => {
    const mapLocationPopup = async (clickLocation) => {
      const { lat, lng } = clickLocation.lngLat
      const clickGridRef = osTransform.fromLatLng({ lat, lng });
      let osGridRef = ''
      if (clickGridRef.ea && clickGridRef.no) {
        osGridRef = osTransform.toGridRef(clickGridRef).text
      }
      const query = new URLSearchParams({ coordinates: `${lat},${lng}`, key: what3wordsKey });
      const response = await fetch(`https://api.what3words.com/v3/convert-to-3wa?${query.toString()}`);
      let what3words = ''
      let htmlLocation = ''
      if (response.ok) {
        const { words } = await response.json()
        what3words = words
      }
      if (osGridRef && what3words) {
        htmlLocation = `<div style="color:#000">${osGridRef}<br>${what3words}<br><a href='https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}&travelmode=driving' target='_blank'>Navigate to here..</a></div>`
      } else {
        htmlLocation = `<div style="color:#000">${osGridRef}${what3words}<br><a href='https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}&travelmode=driving' target='_blank'>Navigate to here..</a></div>`
      }
      new maplibregl.Popup()
        .setLngLat(clickLocation.lngLat)
        .setHTML(htmlLocation)
        .addTo(map);
    };
    map.on('click', mapLocationPopup);
    return () => {
      map.off('click', mapLocationPopup)
    };
  }, [])
}
