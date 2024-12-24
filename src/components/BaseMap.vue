<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import L, { Map, TileLayer } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import userLocationIconUrl from './icons/user_location.svg';
import { useLocationStore } from '@/stores/location';
import { useToastsStore } from '@/stores/toasts';

const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<L.Map | null>(null);
const userLocationMaker = ref<L.Marker | null>(null);
const userLocationIcon = ref();
const currentMarker = ref<L.Marker | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const markerMap = ref<Record<string, L.Marker>>({});

interface Props {
  addMarkers?: boolean;
  landmarkMarkers?: { id: string; lat: number; lng: number }[];
}

const props = defineProps<Props>();
const emits = defineEmits(['placedMarker', 'openedLandmarkViewModal']);

function zoomToLandmark(id: string) {
  if (!mapInstance.value || !markerMap.value[id]) return;
  const marker = markerMap.value[id];
  const zoomLevel = 20;

  mapInstance.value.setView(marker.getLatLng(), zoomLevel);
}

defineExpose({
  zoomToLandmark,
});

const toastsStore = useToastsStore();
const locationStore = useLocationStore();

onMounted(async () => {
  if (!mapContainer.value) return;

  mapInstance.value = L.map(mapContainer.value, { zoomControl: false }).setView([51.505, -0.09], 3);

  const tileLayer: TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  tileLayer.addTo(mapInstance.value as Map);

  markerClusterGroup.value = L.markerClusterGroup();

  markerClusterGroup.value.addTo(mapInstance.value as Map);

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

  addLandmarkMarkers();

  if (!locationStore.isLocationFetched || !props.addMarkers) {
    try {
      await locationStore.fetchLocation();
    } catch (_) {
      toastsStore.addToast('Failed to fetch user location');
    }
  }

  if (locationStore.lat && locationStore.long) {
    if (userLocationMaker.value) {
      mapInstance.value.removeLayer(userLocationMaker.value as L.Marker);
    }

    mapInstance.value.setView([locationStore.lat, locationStore.long], 13);

    userLocationIcon.value = L.icon({
      iconUrl: userLocationIconUrl,
      iconSize: [35, 35],
    });

    userLocationMaker.value = L.marker([locationStore.lat, locationStore.long], {
      icon: userLocationIcon.value,
    });
    userLocationMaker.value.addTo(mapInstance.value as Map);

    userLocationMaker.value.bindPopup('You are here');
  }
});

function addLandmarkMarkers() {
  if (!props.landmarkMarkers || !mapInstance.value) return;
  markerClusterGroup.value!.clearLayers();

  props.landmarkMarkers.forEach((landmark) => {
    const marker = L.marker([landmark.lat, landmark.lng]);
    markerMap.value[landmark.id] = marker;

    marker.on('click', () => {
      emits('openedLandmarkViewModal', landmark.id);
    });

    markerClusterGroup.value?.addLayer(marker);
  });
}

watch(
  () => props.landmarkMarkers,
  () => {
    addLandmarkMarkers();
  },
  { deep: true },
);
</script>

<template>
  <div ref="mapContainer" class="map"></div>
</template>

<style scoped>
.map {
  height: 100%;
  border-radius: 8px;
}
</style>
