<script setup>
import moment from "moment";
import { computed } from "vue";

const props = defineProps({
  current: {
    type: Object,
    default: {},
  },
});
const weather = computed(() => {
  if (Object.keys(props.current).length > 0) {
    const [first] = props.current.weather;
    return first;
  } else {
    return { description: "none", icon: null };
  }
});

const weatherIcon = computed(() => {
  if (weather.value) {
    return `http://openweathermap.org/img/wn/${weather.value.icon}.png`;
  } else {
    return null;
  }
});
</script>

<template>
  <tr>
    <td class="font-semibold">
      {{ moment(props.current.dt * 1000).format("ddd") }}
    </td>
    <td>
      <figure>
        <img :src="weatherIcon" alt="" />
      </figure>
    </td>
    <td class="">
      <!-- Today's low temperature -->
      <span class="text-xs mx-1">L:</span>
      <span class="text-sm">{{ props.current.temp.min }}º</span>
      <!-- today's high temperature -->
      <span class="text-xs mx-1">H:</span>
      <span class="text-sm">{{ props.current.temp.max }}º</span>
    </td>
    <td class="hidden md:table-cell">
      <!-- Today's low temperature -->
      <span class="text-xs mx-1 opacity-80">sunrise:</span>

      <span class="text-sm">{{
        moment(props.current.sunrise * 1000).format("LT")
      }}</span>
      <!-- today's high temperature -->
      <span class="text-xs mx-1">sunset:</span>
      <span class="text-sm">{{
        moment(props.current.sunset * 1000).format("LT")
      }}</span>
    </td>
  </tr>
</template>
