<script setup>
import { computed, onMounted } from "vue";
import HistoryCard from "./HistoryCard.vue";
const emits = defineEmits(["callHistoryApi"]);
const props = defineProps({
  history: {
    type: Array,
    default: [],
  },
});
onMounted(() => {
  emits("callHistoryApi");
});
</script>
<template>
  <div class="w-full">
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
      <span> 5-day History </span>
    </h1>
    <table class="table-auto w-full">
      <thead class="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-50">
        <tr class="text-xs">
          <th class="px-4 py-2">Date</th>
          <th class="px-4 py-2">Weather</th>
          <th class="px-4 py-2">Temperature</th>
          <!-- <th class="px-4 py-2 hidden md:table-cell">Sunrise/Sunset</th> -->
        </tr>
      </thead>
      <tbody>
        <HistoryCard
          :current="day.current"
          v-for="(day, index) in history"
          :key="index"
        />
      </tbody>
    </table>
  </div>
</template>
