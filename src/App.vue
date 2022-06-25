<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import axios from "axios";
import SearchInput from "./components/SearchInput.vue";
import WeatherCard from "./components/WeatherCard.vue";
import ShowMore from "./components/ShowMore.vue";
import countries from "./services/countries";
import MapContainer from "./components/MapContainer.vue";

const currentWeatherData = ref({});
const historicWeatherData = ref({});
const more = ref(false);
const searchCountry = ref({});
const currentComponent = ref("WeekForecast");
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

function useLngLat(event) {
  const { lon, lat, country, city } = event;
  getCurrentWeatherData(lat, lon);
  const result = countries.find((item) => item.code === country).name;
  searchCountry.value = { country: result, city, lat, lon };
}

//changeComponent
function changeComponent() {
  currentComponent.value === "WeekForecast"
    ? (currentComponent.value = "HistoryCard")
    : (currentComponent.value = "WeekForecast");
}

const historyVsForcecast = computed(() => {
  return currentComponent.value === "WeekForecast"
    ? defineAsyncComponent(() => import("./components/WeekForecast.vue"))
    : defineAsyncComponent(() => import("./components/HistoryComponent.vue"));
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
  <div class="p-2 md:p-40">
    <SearchInput @lngLatFound="useLngLat" />
    <div v-if="Object.keys(currentWeatherData).length > 0" class="w-full">
      <WeatherCard
        :current="currentWeatherData.current"
        :highAndLowCurrent="highAndLowCurrent"
        @showMore="showMore"
        :searchCountry="searchCountry"
      />
      <Transition name="slide" mode="out-in">
        <ShowMore :current="currentWeatherData.current" v-if="more" />
      </Transition>
      <MapContainer :searchCountry="searchCountry" />
      <div class="w-full">
        <button class="btn" @click="changeComponent">
          {{
            currentComponent === "WeekForecast"
              ? "View Last 5 days"
              : "View For the next 7 days"
          }}
        </button>
        <keep-alive>
          <Transition name="slide" mode="out-in">
            <component
              :is="historyVsForcecast"
              :daily="currentWeatherData.daily"
              :history="historicWeatherData"
              @callHistoryApi="
                makeHistoricalWeatherDataRequest(
                  searchCountry.lat,
                  searchCountry.lon
                )
              "
            ></component>
          </Transition>
        </keep-alive>
      </div>
    </div>
    <div class="flex justify-center w-full my-40" v-else>
      <div
        class="card w-3/4 md:w-1/2 shadow-xl bg-gray-100 opacity-70 text-sm p-4"
      >
        Hi, looks like you haven't made a search yet. Enter a city into the
        search box and let me get you the weather conditions
      </div>
    </div>
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
