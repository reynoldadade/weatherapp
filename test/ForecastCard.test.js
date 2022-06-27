/** @vitest-environment happy-dom */
import { beforeEach, describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ForecastCard from "../src/components/ForecastCard.vue";

describe("ForecastCard", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ForecastCard, {
      props: {
        current: {
          dt: 1656417600,
          sunrise: 1656395441,
          sunset: 1656440229,
          moonrise: 1656393000,
          moonset: 1656439020,
          moon_phase: 0.98,
          temp: {
            day: 27.27,
            min: 24.64,
            max: 27.9,
            night: 25.4,
            eve: 26.42,
            morn: 24.64,
          },
          feels_like: { day: 29.82, night: 26.24, eve: 26.42, morn: 25.46 },
          pressure: 1013,
          humidity: 75,
          dew_point: 22.19,
          wind_speed: 5.16,
          wind_deg: 203,
          wind_gust: 6.92,
          weather: [
            { id: 500, main: "Rain", description: "light rain", icon: "10d" },
          ],
          clouds: 91,
          pop: 0.59,
          rain: 0.34,
          uvi: 10.71,
        },
      },
    });
  });

  it("Should display correct sunrise time", () => {
    expect(wrapper.find("[data-testid='forecastCard-sunrise']").text()).toBe(
      "5:50 AM"
    );
  });

  it("Should display correct sunset time", () => {
    expect(wrapper.find("[data-testid='forecastCard-sunset']").text()).toBe(
      "6:17 PM"
    );
  });

  it("Should display correct minimum temperature", () => {
    expect(wrapper.find("[data-testid='forecastCard-min-temp']").text()).toBe(
      "24.64º"
    );
  });

  it("Should display correct minimum temperature", () => {
    expect(wrapper.find("[data-testid='forecastCard-max-temp']").text()).toBe(
      "27.9º"
    );
  });
  it("Should display correct day", () => {
    expect(wrapper.find("[data-testid='forecastCard-day']").text()).toBe("Tue");
  });
});
