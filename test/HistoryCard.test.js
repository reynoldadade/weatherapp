/** @vitest-environment happy-dom */

import { beforeEach, describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HistoryCard from "../src/components/HistoryCard.vue";

describe("HistoryCard", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(HistoryCard, {
      props: {
        current: {
          dt: 1656245125,
          sunrise: 1656222615,
          sunset: 1656267408,
          temp: 28.19,
          feels_like: 31.63,
          pressure: 1014,
          humidity: 74,
          dew_point: 23.11,
          uvi: 9.45,
          clouds: 75,
          visibility: 10000,
          wind_speed: 5.66,
          wind_deg: 190,
          weather: [
            {
              id: 803,
              main: "Clouds",
              description: "broken clouds",
              icon: "04d",
            },
          ],
        },
      },
    });
  });

  it("should display the correct day", () => {
    expect(wrapper.find('[data-testid="historyCard-day"]').text()).toBe("Sun");
  });

  it("should display correct temperature", () => {
    expect(wrapper.find('[data-testid="historyCard-temp"]').text()).toBe(
      "28.19º"
    );
  });
});
