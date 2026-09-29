# Supplier WebGIS — class

Svelte 4, Vite, and MapLibre. You switch the MAPID basemap, then load supplier points as vector tiles from your own laptop.

The slow GeoJSON demo is not in this folder. That stays on the projector.

You need Node 18 or newer, and Python 3. The tile file `data_mvt/suppliers.mbtiles` comes with the clone.

## Clone

```bash
git clone https://github.com/radenpranantya/webgis-binus-mapid-svelte.git
cd webgis-binus-mapid-svelte/webgis-binus-class
```

## Basemap key

```bash
cp .env.example .env
```

Open `.env` and set `VITE_MAPID_KEY` to the key shown in class. If you change it later, stop `npm run dev` and start it again.

## Tiles

From this folder, in one terminal:

```bash
python3 tiles/server.py
```

Leave it running. It serves `http://127.0.0.1:8080/suppliers/{z}/{x}/{y}.mvt` from the MBTiles in the repo. A missing square returns 204.

## Page

In a second terminal, from this same folder:

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://127.0.0.1:5173/`).

1. Switch Street, Light, and Satellite.
2. Click **Use MVT**.
3. Pan the map. DevTools → Network shows small `.mvt` requests.
4. Click a green point. Read supplier, plot area, and region.
