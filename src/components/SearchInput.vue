<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
// import "@algolia/autocomplete-theme-classic";
// import { autocomplete } from "@algolia/autocomplete-js";
// import cities from "cities.json";

const location = ref({});
const error = ref(false);
const place = ref("");

// emitters
const emit = defineEmits({
  search: {
    lngLatFound: {
      type: String,
      default: "",
    },
  },
});

function searchPlace(place) {
  axios
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=ae11ff30d19df8f21cb53a7b12688d1d`
    )
    .then((response) => {
      if (response.data.length > 0) {
        const [first] = response.data;
        location.value = first;
        emit("lngLatFound", first);
      } else {
        error.value = true;
      }
    });
}

function searchWithLonLat(lat, lon) {
  axios
    .get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=ae11ff30d19df8f21cb53a7b12688d1d&limit=1`
    )
    .then((response) => {
      const [first] = response.data;
      place.value = first.name;
    });
}

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
  <input
    type="search"
    id="places"
    v-model="place"
    autocomplete="on"
    class="border border-gray-200 p-2 rounded-lg focus:shadow-lg"
    @keydown.enter="searchPlace(place)"
  />
  <!-- </div> -->
</template>
