
const MAPID_KEY = import.meta.env.VITE_MAPID_KEY;
export const HAS_MAPID_KEY = Boolean(MAPID_KEY);
const DEMO_STYLE = 'https://demotiles.maplibre.org/style.json';

export const basemaps = {
  street: HAS_MAPID_KEY ? `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${MAPID_KEY}` : DEMO_STYLE,
  light: HAS_MAPID_KEY ? `https://basemap.mapid.io/styles/light/style.json?key=${MAPID_KEY}` : DEMO_STYLE,
  satellite: HAS_MAPID_KEY ? `https://basemap.mapid.io/styles/satellite/style.json?key=${MAPID_KEY}` : DEMO_STYLE,
  demo: DEMO_STYLE
};

export const MVT_TILES = 'http://127.0.0.1:8080/suppliers/{z}/{x}/{y}.mvt';
export const MVT_SOURCE_LAYER = 'suppliers';
export const MAP_CENTER = [-7.7, 7.2];
export const MAP_ZOOM = 9;
