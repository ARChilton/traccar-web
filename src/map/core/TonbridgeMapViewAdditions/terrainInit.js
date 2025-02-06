export const terrainInit = ({ map, hillShadeLayerName }) => { // adds terrain if it doesn't exist every time we init the map
  if (!map.terrain) {
    map.addSource('terrainSource', {
      type: 'raster-dem',
      url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=QqdGI20vgmlXVM85Lrdo',
    })
  }
  // adds an invisible hills layer every time we init the map
  if (!map.getLayer(hillShadeLayerName)) {
    map.addSource('hillshadeSource', {
      type: 'raster-dem',
      url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=QqdGI20vgmlXVM85Lrdo',
    })
    map.addLayer({
      id: hillShadeLayerName,
      type: 'hillshade',
      source: 'hillshadeSource',
      layout: { visibility: 'none' },
      paint: { 'hillshade-shadow-color': '#473B24' },
    })
  }
}
