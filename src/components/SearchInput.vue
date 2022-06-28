<script setup>
import { onMounted, ref } from "vue";
import { getReverseGeoCode, getGeoCode } from "../services/api.service";

const location = ref({});

const place = ref("");

// emitters
const emit = defineEmits(["lngLatFound", "toggleLoader", "noLocationFound"]);

// search for LngLat using city name
async function searchPlace(place) {
  if (!place) return;
  emit("toggleLoader", true);
  const response = await getGeoCode(place);

  if (response.length > 0) {
    const [first] = response;
    location.value = first;
    emit("lngLatFound", { ...first, city: first.name });
    emit("toggleLoader", false);
  } else {
    emit("noLocationFound");
    emit("toggleLoader", false);
  }
}

// request for location using LngLat
async function searchWithLonLat(lat, lon) {
  emit("toggleLoader", true);
  const response = await getReverseGeoCode(lat, lon);
  if (response) {
    const [first] = response;
    place.value = first.name;
    location.value = first;
    emit("toggleLoader", false);
  } else {
    emit("toggleLoader", false);
  }
}

// Pre-fill the input field with the user current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        searchWithLonLat(latitude, longitude);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

onMounted(() => {
  getLocation();
});
</script>

<template>
  <!-- <div id="autocomplete"> -->
  <div class="w-full flex justify-between items-center relative">
    <input
      type="search"
      id="places"
      v-model="place"
      autocomplete="address-level2"
      class="input w-full shadow-md mx-2"
      placeholder="Enter City"
      @keydown.enter="searchPlace(place)"
      data-testid="search-input"
    />
    <button
      class="btn"
      @click="searchPlace(place)"
      data-testid="searchButton"
      required
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>

  <!-- </div> -->
</template>

<style scoped></style>
