<script>
  import { onMount } from "svelte";
  import MapView from "./lib/MapView.svelte";
  import { HAS_MAPID_KEY } from "./lib/config.js";

  let basemap = HAS_MAPID_KEY ? "street" : "demo";
  let mapView;
  let mvtEnabled = false;
  let theme = "dark";

  const options = HAS_MAPID_KEY
    ? [
        { id: "street", label: "MAPID Street 2D" },
        { id: "light", label: "MAPID Light" },
        { id: "satellite", label: "MAPID Satellite" },
        { id: "demo", label: "MapLibre Demo" },
      ]
    : [{ id: "demo", label: "MapLibre Demo" }];

  let dropdownOpen = false;
  let dropdownElement;
  let dropdownTrigger;
  let dropdownMenu;
  let controlPanel;
  let dropdownPosition = { top: 0, left: 0, width: 0 };

  $: selectedBasemap =
    options.find((option) => option.id === basemap)?.label ?? "Pilih basemap";

  function selectBasemap(id) {
    basemap = id;
    dropdownOpen = false;
    dropdownTrigger?.focus();
  }

  function toggleDropdown() {
    if (dropdownOpen) {
      dropdownOpen = false;
      return;
    }

    const trigger = dropdownTrigger.getBoundingClientRect();
    const panel = controlPanel.getBoundingClientRect();
    const menuHeight = options.length * 44 + 14;
    const below = trigger.bottom - panel.top + 8;
    const above = trigger.top - panel.top - menuHeight - 8;

    dropdownPosition = {
      top: below + menuHeight <= panel.height - 8 ? below : Math.max(8, above),
      left: trigger.left - panel.left,
      width: trigger.width,
    };
    dropdownOpen = true;
  }

  function closeDropdown(event) {
    if (
      dropdownOpen &&
      !dropdownElement?.contains(event.target) &&
      !dropdownMenu?.contains(event.target)
    ) {
      dropdownOpen = false;
    }
  }

  function handleDropdownKeydown(event) {
    if (event.key === "Escape" && dropdownOpen) {
      dropdownOpen = false;
      dropdownTrigger?.focus();
    }
  }

  onMount(() => {
    const saved = localStorage.getItem("supplier-webgis-theme");
    theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
  });

  $: if (typeof document !== "undefined")
    document.documentElement.dataset.theme = theme;

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("supplier-webgis-theme", theme);
  }

  function toggleMvt() {
    mvtEnabled = !mvtEnabled;
    mapView?.setMvtEnabled(mvtEnabled);
  }
</script>

<svelte:head>
  <title>Supplier WebGIS · MAPID × BINUS</title>
  <meta name="theme-color" content={theme === "dark" ? "#101a29" : "#f0f5f9"} />
</svelte:head>

<svelte:window
  on:click={closeDropdown}
  on:keydown={handleDropdownKeydown}
  on:resize={() => (dropdownOpen = false)}
/>

<main class="app-shell">
  <div class="map-stage"><MapView bind:this={mapView} {basemap} /></div>

  <aside
    class="control-panel"
    aria-label="Kontrol peta"
    bind:this={controlPanel}
  >
    <div class="brand-row">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="currentColor"
          ><path
            d="M 22 3 C 18.699 3 16 5.699 16 9 C 16 9.992 16.383 11.004 16.875 12.125 C 17.367 13.246 17.988 14.43425 18.625 15.53125 C 19.898 17.72625 21.1875 19.5625 21.1875 19.5625 L 22 20.75 L 22.8125 19.5625 C 22.8125 19.5625 24.101 17.72625 25.375 15.53125 C 26.012 14.43325 26.633 13.246 27.125 12.125 C 27.617 11.004 28 9.992 28 9 C 28 5.699 25.301 3 22 3 z M 11.96875 4.9375 L 4 8.34375 L 4 27.53125 L 12.03125 24.0625 L 20.03125 27.0625 L 28 23.65625 L 28 14.9375 C 27.363 16.1605 26.656 17.332 26 18.375 L 26 22.34375 L 21 24.46875 L 21 22.84375 L 19.53125 20.71875 C 19.37525 20.49175 19.191 20.2225 19 19.9375 L 19 24.5625 L 13 22.3125 L 13 7.4375 L 14.09375 7.84375 C 14.19175 7.16775 14.367 6.51625 14.625 5.90625 L 11.96875 4.9375 z M 22 5 C 24.219 5 26 6.781 26 9 C 26 9.387 25.7585 10.3005 25.3125 11.3125 C 24.8675 12.3245 24.238 13.47225 23.625 14.53125 C 22.809 15.93725 22.457 16.438953 22 17.126953 C 21.543 16.438953 21.191 15.93725 20.375 14.53125 C 19.762 13.47225 19.1335 12.3245 18.6875 11.3125 C 18.2425 10.3005 18 9.387 18 9 C 18 6.781 19.781 5 22 5 z M 11 7.5 L 11 22.34375 L 6 24.46875 L 6 9.65625 L 11 7.5 z"
          /></svg
        >
      </div>
      <div class="brand-copy">
        <span class="eyebrow">MAPID × BINUS</span><strong
          >Supplier WebGIS</strong
        >
      </div>
      <button
        class="theme-button"
        type="button"
        on:click={toggleTheme}
        aria-label={theme === "dark"
          ? "Aktifkan mode terang"
          : "Aktifkan mode gelap"}
        title={theme === "dark" ? "Mode terang" : "Mode gelap"}
      >
        {#if theme === "dark"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            ><circle cx="12" cy="12" r="4" /><path
              d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            /></svg
          >
        {:else}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            ><path
              d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.5 8.5 0 1 0 20.5 14.1Z"
            /></svg
          >
        {/if}
      </button>
    </div>

    <div class="panel-content" on:scroll={() => (dropdownOpen = false)}>
      <div class="hero">
        <h1>Explore the<br /><span>landscape.</span></h1>
        <p>Visualisasi data supplier dalam satu peta interaktif.</p>
      </div>
      <div class="divider"></div>

      <div class="control-group">
        <div class="group-heading">
          <span>TAMPILAN PETA</span><span
            class="group-symbol"
            aria-hidden="true">—</span
          >
        </div>
        <label for="basemap">Pilih basemap</label>
        <div class="basemap-dropdown" bind:this={dropdownElement}>
          <button
            id="basemap"
            class="basemap-trigger"
            bind:this={dropdownTrigger}
            type="button"
            aria-expanded={dropdownOpen}
            aria-controls="basemap-options"
            on:click={toggleDropdown}
          >
            <svg
              class="basemap-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              ><path
                d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"
              /></svg
            >
            <span class="basemap-value">{selectedBasemap}</span>
            <svg
              class="dropdown-chevron"
              class:rotated={dropdownOpen}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg
            >
          </button>
        </div>
        {#if !HAS_MAPID_KEY}<p class="mapid-hint">
            Isi VITE_MAPID_KEY di file .env untuk mengaktifkan basemap MAPID.
          </p>{/if}
      </div>

      <div class="control-group layer-group">
        <div class="group-heading">
          <span>DATA LAYER</span><span class="group-symbol" aria-hidden="true"
            >—</span
          >
        </div>
        <div class="layer-card">
          <div class="layer-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"
              /></svg
            >
          </div>
          <div class="layer-details">
            <strong>Supplier Points</strong><span>Vector tiles · MVT</span>
          </div>
          <button
            class="switch"
            class:active={mvtEnabled}
            type="button"
            role="switch"
            aria-checked={mvtEnabled}
            aria-label="Use MVT"
            on:click={toggleMvt}><span class="switch-thumb"></span></button
          >
        </div>
        <p class="layer-hint">
          {mvtEnabled
            ? "Layer aktif. Klik titik hijau untuk melihat detail supplier."
            : "Aktifkan untuk menampilkan titik supplier pada peta."}
        </p>
      </div>
    </div>

    {#if dropdownOpen}
      <div
        id="basemap-options"
        class="basemap-menu"
        bind:this={dropdownMenu}
        role="group"
        aria-label="Pilihan basemap"
        style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
      >
        {#each options as option}
          <button
            type="button"
            class:selected={basemap === option.id}
            aria-current={basemap === option.id ? "true" : undefined}
            on:click={() => selectBasemap(option.id)}
          >
            <span>{option.label}</span>
            {#if basemap === option.id}<span aria-hidden="true">✓</span>{/if}
          </button>
        {/each}
      </div>
    {/if}

    <div class="panel-footer">
      <span class="footer-dot" class:enabled={mvtEnabled}></span><span
        >MVT {mvtEnabled ? "aktif" : "nonaktif"}</span
      ><span class="footer-version">Aeru</span>
    </div>
  </aside>
</main>
