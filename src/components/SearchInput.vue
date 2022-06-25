<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Loader from "./Loader.vue";

const location = ref({});
const error = ref(false);
const place = ref("");
const message = ref("Loading...");
const showLoader = ref(false);

// emitters
const emit = defineEmits(["lngLatFound"]);

function toggleLoader(event) {
  showLoader.value = event;
}
// search for LngLat using city name
function searchPlace(place) {
  toggleLoader(true);
  axios
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=ae11ff30d19df8f21cb53a7b12688d1d`
    )
    .then((response) => {
      if (response.data.length > 0) {
        const [first] = response.data;
        location.value = first;
        emit("lngLatFound", { ...first, city: place });
        toggleLoader(false);
      } else {
        error.value = true;
        toggleLoader(false);
      }
    });
}
// request for location using LngLat
function searchWithLonLat(lat, lon) {
  toggleLoader(true);
  axios
    .get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=ae11ff30d19df8f21cb53a7b12688d1d&limit=1`
    )
    .then((response) => {
      const [first] = response.data;
      place.value = first.name;
      location.value = first;
      toggleLoader(false);
    });
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

// function initAutocomplete() {
//   autocomplete({
//     container: "#autocomplete",
//     getSources() {
//       return [
//         {
//           sourceId: "cities",
//           getItems({ query }) {
//             const items = cities.map((city) => city.name);

//             return items.filter((name) =>
//               name.toLowerCase().includes(query.toLowerCase())
//             );
//           },

//           templates: {
//             item({ item }) {
//               return item.name;
//             },
//           },
//         },
//       ];
//     },
//   });

//   // autocomplete.on(
//   //   "autocomplete:selected",
//   //   function (event, suggestion, dataset) {
//   //     place.value = suggestion.name;
//   //     searchPlace(suggestion.name);
//   //   }
//   // );
// }

// onMounted(() => {
//   initAutocomplete();
// });
</script>

<template>
  <!-- <div id="autocomplete"> -->
  <div class="w-full flex justify-between items-center relative">
    <Loader v-if="showLoader" />
    <input
      type="search"
      id="places"
      v-model="place"
      autocomplete="on"
      class="input w-full shadow-md mx-2"
      placeholder="Enter City"
      @keydown.enter="searchPlace(place)"
    />
    <button class="btn" @click="searchPlace(place)">
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
