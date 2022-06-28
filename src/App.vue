<script setup>
import { ref, computed, defineAsyncComponent, watch } from "vue";
import axios from "axios";
import SearchInput from "./components/SearchInput.vue";
import WeatherCard from "./components/WeatherCard.vue";
import ShowMore from "./components/ShowMore.vue";
import countries from "./services/countries";
import {
  makeHistoricalWeatherDataRequest,
  getCurrentWeatherData,
} from "./services/api.service";
import MapContainer from "./components/MapContainer.vue";
import Loader from "./components/Loader.vue";

const currentWeatherData = ref({});
const historicWeatherData = ref([]);
const more = ref(false);
const searchCountry = ref({});
const currentComponent = ref("WeekForecast");

//for loader
const message = ref("Loading...");
const showLoader = ref(false);
// in case no location is found
const notFound = ref(false);

//toggle loader
function toggleLoader(event) {
  showLoader.value = event;
}

// when the location entered is not found
function noLocationFound() {
  currentWeatherData.value = [];
  historicWeatherData.value = [];
  notFound.value = true;
}

//now using https
// request for current weather data
// async function getCurrentWeatherData(lat, lon) {
//   try {
//     const response = await axios.get(
//       `${
//         import.meta.env.VITE_BASE_URL
//       }/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${
//         import.meta.env.VITE_WEATHER_APP_ID
//       }&units=metric`
//     );
//     return response.data;
//   } catch ({ error }) {
//     console.log(error);
//   }
// }

async function setCurrentWeatherData(lat, lon) {
  toggleLoader(true);
  const response = await getCurrentWeatherData(lat, lon);
  currentWeatherData.value = response;
  toggleLoader(false);
}

// create historical data requests
// function createHistoricalWeatherDataRequest(lat, lon) {
//   const timeStampRequests = [];
//   // last 5 days as timestamps
//   for (let i = 5; i > 0; i--) {
//     const today = Date.now();
//     const days = Math.floor((today - 24 * 60 * 60 * 1000 * i) / 1000);
//     const request = axios.get(
//       `${
//         import.meta.env.VITE_BASE_URL
//       }/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&appid=${
//         import.meta.env.VITE_WEATHER_APP_ID
//       }&units=metric&exclude=hourly&dt=${days}&only_current=true`
//     );
//     timeStampRequests.push(request);
//   }

//   return timeStampRequests;
// }

// request hostorical weather data together
// async function makeHistoricalWeatherDataRequest(lat, lon) {
//   try {
//     const responses = await Promise.all(
//       createHistoricalWeatherDataRequest(lat, lon)
//     );
//     return responses.map((response) => response.data);
//   } catch ({ error }) {
//     console.log(error);
//   }
// }

async function setHistoricalWeatherData(lat, lon) {
  const response = await makeHistoricalWeatherDataRequest(lat, lon);
  historicWeatherData.value = response;
}

//show the extra component
function showMore(event) {
  more.value = event;
}

function useLngLat(event) {
  const { lon, lat, country, city } = event;
  setCurrentWeatherData(lat, lon);
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

const changePropsToComponents = computed(() => {
  return currentComponent.value === "WeekForecast"
    ? {
        daily: currentWeatherData.value.daily,
      }
    : {
        history: historicWeatherData.value.reverse(),
      };
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

watch(
  () => searchCountry.value,
  (newSearchCountry, oldSearchCountry) => {
    if (
      newSearchCountry.city !== oldSearchCountry.city &&
      currentComponent.value === "HistoryCard"
    ) {
      setHistoricalWeatherData(newSearchCountry.lat, newSearchCountry.lon);
    }
  }
);

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="p-2 md:p-40 relative">
    <Loader v-if="showLoader" />
    <SearchInput
      @lngLatFound="useLngLat"
      @toggleLoader="toggleLoader"
      @noLocationFound="noLocationFound"
    />

    <div
      v-if="Object.keys(currentWeatherData).length > 0"
      class="w-full"
      data-testid="searchResults"
    >
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
        <div
          class="w-full h-72 overflow-y-auto card my-4 px-2 shadow-xl relative"
        >
          <keep-alive>
            <Transition name="slide" mode="out-in">
              <component
                :is="historyVsForcecast"
                v-bind="changePropsToComponents"
                @callHistoryApi="
                  setHistoricalWeatherData(searchCountry.lat, searchCountry.lon)
                "
              ></component>
            </Transition>
          </keep-alive>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center w-full my-40"
      v-else
      data-testid="noSearchOrError"
    >
      <div
        class="card w-3/4 md:w-1/2 shadow-xl bg-gray-100 opacity-70 text-sm p-4"
      >
        {{
          notFound
            ? "Seems you have entered a city that does not exist, lets try this again"
            : "Hi, looks like you haven't made a search yet. Enter a city into the search box and let me get you the weather conditions"
        }}
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
