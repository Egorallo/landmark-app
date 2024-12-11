<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L, { Map, TileLayer } from 'leaflet';
import abobaImage from '../assets/aboba.png';

const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<L.Map | null>(null);

onMounted(() => {
  if (!mapContainer.value) return;
  mapInstance.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);

  const tileLayer: TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  tileLayer.addTo(mapInstance.value as Map);

  const marker = L.marker([51.5, -0.09]).addTo(mapInstance.value as Map);
  marker
    .bindPopup(`<b>Hello world!</b><br>I am a popup.<img src="${abobaImage}" alt="haha">`)
    .openPopup();
});
</script>

<template>
  <div ref="mapContainer" class="map"></div>
</template>

<style scoped>
.map {
  /* width: 70%; */
  height: 100%;
}
</style>
