<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import SearchInput from "./components/SearchInput.vue";
import WeatherCard from "./components/WeatherCard.vue";
import ShowMore from "./components/ShowMore.vue";

const currentWeatherData = ref({});
const historicWeatherData = ref({});
const more = ref(false);

// request for current weather data
function getCurrentWeatherData(lat, lon) {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=ae11ff30d19df8f21cb53a7b12688d1d&units=metric`
    )
    .then((response) => {
      currentWeatherData.value = response.data;
    });
}

function createHistoricalWeatherDataRequest(lat, lon) {
  const timeStampRequests = [];
  // last 5 days as timestamps
  for (let i = 5; i > 0; i--) {
    const today = Date.now();
    const days = Math.floor((today - 24 * 60 * 60 * 1000 * i) / 1000);
    const request = axios.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&appid=ae11ff30d19df8f21cb53a7b12688d1d&units=metric&exclude=hourly&dt=${days}&only_current=true`
    );
    timeStampRequests.push(request);
  }

  return timeStampRequests;
}

function makeHistoricalWeatherDataRequest(lat, lon) {
  Promise.all(createHistoricalWeatherDataRequest(lat, lon)).then(
    (responses) => {
      historicWeatherData.value = responses.map((response) => response.data);
    }
  );
}

//show the extra component
function showMore(event) {
  more.value = event;
}

onMounted(() => {
  getCurrentWeatherData(5.614818, -0.205874);
  makeHistoricalWeatherDataRequest(5.614818, -0.205874);
  // console.log(createHistoricalWeatherDataRequest(5.614818, -0.205874));
});

const highAndLowCurrent = computed(() => {
  if (Object.keys(currentWeatherData.value).length > 0) {
    const temps = currentWeatherData.value.hourly.map((data) => data.temp);
    return {
      max: Math.max(...temps),
      min: Math.min(...temps),
    };
  }
  return {
    max: 0,
    min: 0,
  };
});

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- TODO: create component for current days weather data -->
  <!-- TODO: create component for the next 7 days and previous days -->
  <!-- TODO: create component for extra info -->
  <!-- TODO: add map option to allow for plotting of location on map -->
  <div class="p-2">
    <SearchInput />
    <WeatherCard
      :current="currentWeatherData.current"
      :highAndLowCurrent="highAndLowCurrent"
      @showMore="showMore"
    />
    <ShowMore :current="currentWeatherData.current" v-if="more" />
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
