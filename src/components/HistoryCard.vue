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
    <td class="font-semibold" data-testid="historyCard-day">
      {{ moment(props.current.dt * 1000).format("ddd") }}
    </td>
    <td>
      <figure>
        <img :src="weatherIcon" alt="" />
      </figure>
    </td>
    <td class="">
      <!-- Today's low temperature -->

      <span class="text-sm" data-testid="historyCard-temp"
        >{{ props.current.temp }}º</span
      >
      <!-- today's high temperature -->
    </td>
  </tr>
</template>
