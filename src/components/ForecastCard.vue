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
  <tr data-testid="forecastRow">
    <td class="font-semibold" data-testid="forecastCard-day">
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
      <span class="text-sm" data-testid="forecastCard-min-temp"
        >{{ props.current.temp.min }}º</span
      >
      <!-- today's high temperature -->
      <span class="text-xs mx-1">H:</span>
      <span class="text-sm" data-testid="forecastCard-max-temp"
        >{{ props.current.temp.max }}º</span
      >
    </td>
    <td class="hidden md:table-cell">
      <span class="text-sm" data-testid="forecastCard-sunrise">{{
        moment(props.current.sunrise * 1000).format("LT")
      }}</span>

      /
      <span class="text-sm" data-testid="forecastCard-sunset">{{
        moment(props.current.sunset * 1000).format("LT")
      }}</span>
    </td>
  </tr>
</template>
