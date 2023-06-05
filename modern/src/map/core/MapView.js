import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React, {
  useRef, useLayoutEffect, useEffect, useState,
} from 'react';
import { SwitcherControl } from '../switcher/switcher';
import { useAttributePreference, usePreference } from '../../common/util/preferences';
import usePersistedState, { savePersistedState } from '../../common/util/usePersistedState';
import { mapImages } from './preloadImages';
import useMapStyles from './useMapStyles';
import { osTransform } from '../../common/util/os-transform';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

export const map = new maplibregl.Map({
  container: element,
  attributionControl: false,
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = (listener) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
  updateReadyValue(true);
};

map.addControl(new maplibregl.NavigationControl());

const switcher = new SwitcherControl(
  () => updateReadyValue(false),
  (styleId) => savePersistedState('selectedMapStyle', styleId),
  () => {
    map.once('styledata', () => {
      const waiting = () => {
        if (!map.loaded()) {
          setTimeout(waiting, 33);
        } else {
          initMap();
        }
      };
      waiting();
    });
  },
);

map.addControl(switcher);

// Add terrain Control button & Layers
map.addControl(
  new maplibregl.TerrainControl({
    source: 'terrainSource',
    exaggeration: 1,
  }),
);
map.on('load', () => {
  map.addSource('terrainSource', {
    type: 'raster-dem',
    url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=eIgS48TpQ70m77qKYrsx',
  });
  map.addSource('hillshadeSource', {
    type: 'raster-dem',
    url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=eIgS48TpQ70m77qKYrsx',
  });
  map.setTerrain({
    source: 'terrainSource',
    exaggeration: 1,
  });
  map.addLayer({
    id: 'hills',
    type: 'hillshade',
    source: 'hillshadeSource',
    layout: { visibility: 'visible' },
    paint: { 'hillshade-shadow-color': '#473B24' },
  });
});

const MapView = ({ children }) => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapStyles = useMapStyles();
  const activeMapStyles = useAttributePreference('activeMapStyles', 'locationIqStreets,osm,carto,bingOS,bingRoad,bingAerial,googleTraffic');
  const [defaultMapStyle] = usePersistedState('selectedMapStyle', usePreference('map', 'bingOS'));
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const maxZoom = useAttributePreference('web.maxZoom');
  const what3wordsKey = useAttributePreference('what3WordsToken')

  useEffect(() => {
    if (maxZoom) {
      map.setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    maplibregl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);

  useEffect(() => {
    const filteredStyles = mapStyles.filter((s) => s.available && activeMapStyles.includes(s.id));
    const styles = filteredStyles.length ? filteredStyles : mapStyles.filter((s) => s.id === 'osm');
    switcher.updateStyles(styles, defaultMapStyle);
  }, [mapStyles, defaultMapStyle]);

  useEffect(() => {
    const listener = (ready) => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  // adds OS grid reference and what3words on click
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
        htmlLocation = `${osGridRef}<br>${what3words}`
      } else {
        htmlLocation = `${osGridRef}${what3words}`
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
  }, []);

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(element);
    map.resize();
    return () => {
      currentEl.removeChild(element);
    };
  }, [containerEl]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerEl}>
      {mapReady && children}
    </div>
  );
};

export default MapView;
