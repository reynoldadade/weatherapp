<script setup>
import { computed, ref } from "vue";

// emitters
const emit = defineEmits(["showMore"]);
const props = defineProps({
  current: {
    type: Object,
    default: {},
  },
  highAndLowCurrent: {
    type: Object,
    default: { min: 0, max: 0 },
  },
});

// data

const more = ref(false);

// functions
function showMore() {
  more.value = !more.value;
  emit("showMore", more.value);
}

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
    return `http://openweathermap.org/img/wn/${weather.value.icon}@2x.png`;
  } else {
    return null;
  }
});
</script>

<template>
  <div class="card w-full bg-teal-300 shadow-lg m-1">
    <div class="card-body items-center text-center">
      <figure>
        <img :src="weatherIcon" alt="" />
      </figure>
      <div class="text-5xl text-gray-700">{{ current.temp }} º</div>
      <h2 class="text-sm capitalize">{{ weather?.description }}</h2>

      <div class="">
        <span class="text-xs mx-1">L:</span>
        <span class="text-sm">{{ highAndLowCurrent.min }}º</span>
        <span class="text-xs mx-1">H:</span>
        <span class="text-sm">{{ highAndLowCurrent.max }}º</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary text-xs" @click="showMore">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            v-if="!more"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>

          <svg
            v-else
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
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
