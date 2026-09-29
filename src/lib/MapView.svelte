<script>
  import { onMount, onDestroy } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import {
    basemaps,
    MVT_TILES,
    MVT_SOURCE_LAYER,
    MAP_CENTER,
    MAP_ZOOM
  } from './config.js';

  export let basemap = 'street';

  let container;
  let map;
  let appliedBasemap = basemap;
  let popup;
  let layerMode = 'none';

  const SOURCE_ID = 'suppliers';
  const LAYER_ID = 'suppliers-circles';

  const circlePaint = {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 3, 12, 6, 16, 9],
    'circle-color': '#0f6f4a',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff'
  };

  function escapeHtml(value) {
    return String(value ?? '—')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function onSupplierClick(event) {
    const props = event.features?.[0]?.properties;
    if (!props) return;
    const area = props.plotareaha ?? '—';
    popup
      .setLngLat(event.lngLat)
      .setHTML(
        `<strong>${escapeHtml(props.entityname)}</strong><br>` +
          `FID ${escapeHtml(props.FID)}<br>` +
          `Plot ${escapeHtml(area)} ha<br>` +
          `${escapeHtml(props.regionlabel)}`
      )
      .addTo(map);
  }

  function onPointer() {
    map.getCanvas().style.cursor = 'pointer';
  }

  function onPointerOut() {
    map.getCanvas().style.cursor = '';
  }

  function clearSupplierLayer() {
    if (!map.getStyle()) return;
    popup?.remove();
    map.getCanvas().style.cursor = '';
    if (map.getLayer(LAYER_ID)) {
      map.off('click', LAYER_ID, onSupplierClick);
      map.off('mouseenter', LAYER_ID, onPointer);
      map.off('mouseleave', LAYER_ID, onPointerOut);
      map.removeLayer(LAYER_ID);
    }
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
  }

  function bindClicks() {
    map.on('click', LAYER_ID, onSupplierClick);
    map.on('mouseenter', LAYER_ID, onPointer);
    map.on('mouseleave', LAYER_ID, onPointerOut);
  }

  // setStyle drops custom layers. style.load calls this again for the active mode.
  function applyLayer() {
    if (!map.getStyle()) return;
    clearSupplierLayer();
    if (layerMode !== 'mvt') return;
    map.addSource(SOURCE_ID, {
      type: 'vector',
      tiles: [MVT_TILES],
      minzoom: 0,
      maxzoom: 14
    });
    map.addLayer({
      id: LAYER_ID,
      type: 'circle',
      source: SOURCE_ID,
      'source-layer': MVT_SOURCE_LAYER,
      paint: circlePaint
    });
    bindClicks();
  }

  export function setMvtEnabled(enabled) {
    layerMode = enabled ? 'mvt' : 'none';
    if (map?.isStyleLoaded()) applyLayer();
  }

  onMount(() => {
    popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });
    map = new maplibregl.Map({
      container,
      style: basemaps[basemap],
      center: MAP_CENTER,
      zoom: MAP_ZOOM
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('style.load', applyLayer);
  });

  $: if (map && basemap !== appliedBasemap) {
    appliedBasemap = basemap;
    popup?.remove();
    map.setStyle(basemaps[basemap], { diff: false });
  }

  onDestroy(() => {
    popup?.remove();
    map?.remove();
  });
</script>

<div class="map" bind:this={container}></div>

<style>
  .map {
    flex: 1;
    height: 100%;
    min-height: 400px;
  }
</style>
