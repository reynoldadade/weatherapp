<script setup>
import moment from "moment";

const props = defineProps({
  current: {
    type: Object,
    default: {},
  },
});
</script>
<!-- Add extra info about the current conditions on a hidden component the user can toggle the visibility:

Wind Speed
Humidity
Pressure
Sunrise/Sunset Time -->
<template>
  <div class="card shadow-lg my-4 p-2 w-full bg-gray-100 opacity-75">
    <div class="grid grid-cols-2">
      <div class="p-2 text-center">
        <h1 class="text-sm text-gray-500">Wind Speed</h1>
        <p class="text-2xl">
          {{ current.wind_speed }} <span class="text-sm">m/s</span>
        </p>
      </div>
      <div class="p-2">
        <h1 class="text-sm text-gray-500">Pressure</h1>
        <p class="text-2xl">
          {{ current.pressure }} <span class="text-sm">hPa</span>
        </p>
      </div>
      <div class="p-2">
        <h1 class="text-sm text-gray-500">Sunrise</h1>
        <p class="text-xl">
          {{ moment(current.sunrise * 1000).format("LT") }}
        </p>
      </div>
      <div class="p-2">
        <h1 class="text-sm text-gray-500">Sunset</h1>
        <p class="text-xl">
          {{ moment(current.sunset * 1000).format("LT") }}
        </p>
      </div>
    </div>
  </div>
</template>
