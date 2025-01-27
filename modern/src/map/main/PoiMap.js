import { useId, useEffect, useState } from 'react';
import { gpx, kml } from '@tmcw/togeojson';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { useEffectAsync } from '../../reactHelper';
import { usePreference } from '../../common/util/preferences';
import { findFonts } from '../core/mapUtil';

const PoiMap = () => {
  const id = useId();

  const theme = useTheme();

  const poiLayer = usePreference('poiLayer');

  const [data, setData] = useState(null);

  useEffectAsync(async () => {
    if (poiLayer) {
      const file = await fetch(poiLayer);
      const dom = new DOMParser().parseFromString(await file.text(), 'text/xml');
      if (poiLayer.endsWith('.kml')) {
        setData(kml(dom))
      } else {
        setData(gpx(dom));
      }
    }
  }, [poiLayer]);

  useEffect(() => {
    if (data) {
      map.addSource(id, {
        type: 'geojson',
        data,
      });
      map.addLayer({
        source: id,
        id: 'poi-point',
        type: 'circle',
        paint: {
          'circle-radius': 8,
          'circle-color': theme.palette.poi,
          'circle-opacity': 0.5,
        },
      });
      map.addLayer({
        source: id,
        id: 'poi-line',
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': theme.palette.poi,
          'line-width': 20,
          'line-opacity': 0.3,
        },
      });
      map.addLayer({
        source: id,
        id: 'poi-title',
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-anchor': 'bottom',
          'text-offset': [0, -0.5],
          'text-font': findFonts(map),
          'text-size': 14,
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1.5,
        },
      });
      return () => {
        if (map.getLayer('poi-point')) {
          map.removeLayer('poi-point');
        }
        if (map.getLayer('poi-line')) {
          map.removeLayer('poi-line');
        }
        if (map.getLayer('poi-title')) {
          map.removeLayer('poi-title');
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return () => { };
  }, [data]);

  return null;
};

export default PoiMap;
