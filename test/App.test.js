/** @vitest-environment happy-dom */
import App from "../src/App.vue";

import { beforeEach, describe, it, vi, expect } from "vitest";
import oneCallResponse from "./mocks/oneCall";
import timemachine from "./mocks/timeMachine";
import directLocation from "./mocks/direct";
import reverseLocation from "./mocks/reverse";
import Vue from "vue";

import {
  getCurrentWeatherData,
  getGeoCode,
  getReverseGeoCode,
  makeHistoricalWeatherDataRequest,
} from "../src/services/api.service";
import { mount, flushPromises } from "@vue/test-utils";

vi.mock("../src/services/api.service");

describe("App", () => {
  let wrapper;
  beforeEach(() => {
    getCurrentWeatherData.mockResolvedValue(oneCallResponse);
    getGeoCode.mockResolvedValue(directLocation);
    getReverseGeoCode.mockResolvedValue(reverseLocation);
    makeHistoricalWeatherDataRequest.mockResolvedValue(timemachine);

    wrapper = mount(App, {
      global: {
        stubs: {
          MapContainer: true,
        },
      },
    });
  });

  it("should display weather data when a request is made", async () => {
    // test to see if results is not in dom
    expect(wrapper.find("[data-testid=searchResults']").exists()).toBe(false);
    expect(wrapper.find("[data-testid=noSearchOrError']").exists()).toBe(true);
    const searchInput = wrapper.find("[data-testid='search-input']");
    await searchInput.setValue("Accra");
    const searchButton = wrapper.find("[data-testid='searchButton']");
    await searchButton.trigger("click");
    await flushPromises();
    //check to see if results is in dom
    expect(wrapper.find("[data-testid=searchResults']").exists()).toBe(true);
    //check to see if noSearchOnError is not in dom
    expect(wrapper.find("[data-testid=noSearchOrError']").exists()).toBe(false);
  });

  it("Should show or hide component on click of showMore Button", async () => {
    expect(wrapper.find("[data-testid='searchResults']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='noSearchOrError']").exists()).toBe(true);
    const searchInput = wrapper.find("[data-testid='search-input']");
    await searchInput.setValue("Accra");
    const searchButton = wrapper.find("[data-testid='searchButton']");
    await searchButton.trigger("click");
    await flushPromises();
    // test that showMoreComponent does not exist
    const showMoreButton = wrapper.find("[data-testid='showMoreButton']");

    await showMoreButton.trigger("click");
    //component should show After click of showMoreButton
    expect(wrapper.find("[data-testid='showMoreComponent']").exists()).toBe(
      true
    );
  });
});
