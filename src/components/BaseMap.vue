<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import L, { Map, TileLayer } from 'leaflet';
import userLocationIconUrl from './icons/user_location.svg';

const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<L.Map | null>(null);
const lat = ref();
const long = ref();
const userLocationIcon = ref();
const currentMarker = ref<L.Marker | null>(null);

interface Props {
  addMarkers?: boolean;
  landmarkMarkers?: { lat: number; lng: number }[];
}

const props = defineProps<Props>();
const emits = defineEmits(['placedMarker']);

onMounted(() => {
  if (!mapContainer.value) return;
  mapInstance.value = L.map(mapContainer.value).setView([51.505, -0.09], 3);

  const tileLayer: TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  tileLayer.addTo(mapInstance.value as Map);

  addLandmarkMarkers();

  if (props.addMarkers) {
    mapInstance.value.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (currentMarker.value) {
        mapInstance.value?.removeLayer(currentMarker.value as L.Marker);
      }

      const marker = L.marker([lat, lng]);

      currentMarker.value = marker;

      emits('placedMarker', { fl: true, lat, lng });

      marker.on('click', () => {
        mapInstance.value?.removeLayer(marker);
        currentMarker.value = null;
        emits('placedMarker', { fl: false, lat, lng });
      });

      marker.addTo(mapInstance.value as Map);
    });
  }

  getLocation();
});

function addLandmarkMarkers() {
  if (!props.landmarkMarkers || !mapInstance.value) return;

  props.landmarkMarkers.forEach((landmark) => {
    L.marker([landmark.lat, landmark.lng]).addTo(mapInstance.value as Map);
  });
}

watch(
  () => props.landmarkMarkers,
  () => {
    addLandmarkMarkers();
  },
  { deep: true },
);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude;
      long.value = position.coords.longitude;

      userLocationIcon.value = L.icon({
        iconUrl: userLocationIconUrl,
        iconSize: [35, 35],
      });
      mapInstance.value?.setView([lat.value, long.value], 13);
      L.marker([lat.value, long.value], { icon: userLocationIcon.value }).addTo(
        mapInstance.value as Map,
      );
    });
  } else {
    //mapInstance.value?.setView([51.505, -0.09], 13);
  }
}
</script>

<template>
  <div ref="mapContainer" class="map"></div>
</template>

<style scoped>
.map {
  /* width: 70%; */
  height: 100%;
  border-radius: 8px;
}
</style>
