<script setup>
import { onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";

//props
const props = defineProps({
  searchCountry: {
    type: Object,
    default: {},
  },
});

// data
const map = ref(null);
const marker = ref(null);

function createMap() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoid2FsdWxlbGFkbWluIiwiYSI6ImNrMm5samZ3bzBya2QzY29maDh6czJ6bGcifQ.LRMREa0M12e8Cjdk7TCS6w";

  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-96, 37.8],
    zoom: 9,
  });
  // disable map zoom when using scroll
  map.value.scrollZoom.disable();

  map.value.flyTo({
    center: [props.searchCountry.lon, props.searchCountry.lat],
    zoom: 9,
  });

  marker.value = new mapboxgl.Marker()
    .setLngLat([props.searchCountry.lon, props.searchCountry.lat])
    .addTo(map.value);
}

onMounted(() => {
  createMap();
});

watch(
  () => props.searchCountry,
  (newSearchCountry, oldSearchCountry) => {
    if (newSearchCountry.city !== oldSearchCountry.city) {
      map.value.flyTo({
        center: [newSearchCountry.lon, newSearchCountry.lat],
        zoom: 9,
      });
      marker.value.remove();
      marker.value = new mapboxgl.Marker()
        .setLngLat([newSearchCountry.lon, newSearchCountry.lat])
        .addTo(map.value);
    }
  }
);
</script>

<template>
  <div class="shadow-xl card my-4">
    <div id="map" class="h-[300px] w-full"></div>
  </div>
</template>
