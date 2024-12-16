import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocationStore = defineStore('location', () => {
  const lat = ref<number | null>(null);
  const long = ref<number | null>(null);
  const isLocationFetched = ref(false);

  const fetchLocation = async () => {
    if (!isLocationFetched.value && navigator.geolocation) {
      return new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat.value = position.coords.latitude;
            long.value = position.coords.longitude;
            isLocationFetched.value = true;
            console.log('got user locationL ', lat.value, long.value);
            resolve();
          },
          (error) => {
            console.error('Failed to fetch location:', error);
            reject(error);
          },
        );
      });
    }
  };

  return {
    lat,
    long,
    fetchLocation,
    isLocationFetched,
  };
});