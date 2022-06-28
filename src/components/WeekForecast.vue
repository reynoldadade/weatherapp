<script setup>
import ForecastCard from "./ForecastCard.vue";
import { computed } from "vue";
const props = defineProps({
  daily: {
    type: Array,
    default: [],
  },
});

const sevenDays = computed(() => {
  if (props.daily.length > 0) {
    return props.daily.slice(1, 8);
  } else {
    return [];
  }
});
</script>

<template>
  <div class="w-full" data-testid="WeekForecast">
    <h1 class="flex items-center w-full">
      <span class="mx-1"
        ><svg
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </span>
      <span> 7-day Forecast </span>
    </h1>
    <table class="table-auto w-full">
      <thead class="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-50">
        <tr class="text-xs">
          <th class="px-4 py-2">Day</th>
          <th class="px-4 py-2">Weather</th>
          <th class="px-4 py-2">Temperature</th>
          <th class="px-4 py-2 hidden md:table-cell">Sunrise/Sunset</th>
        </tr>
      </thead>
      <tbody>
        <forecast-card
          :day="day"
          v-for="day in sevenDays"
          :key="day.dt"
          :current="day"
        ></forecast-card>
      </tbody>
    </table>
  </div>
</template>
