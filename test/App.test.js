/** @vitest-environment happy-dom */
import App from "../src/App.vue";
import { render, fireEvent } from "@testing-library/vue";
import { describe, it, vi } from "vitest";
import oneCallResponse from "./mocks/oneCall";
import timemachine from "./mocks/timeMachine";
import directLocation from "./mocks/direct";

describe("App", () => {
  it("should display weather data", async () => {
    const { getByTestId } = render(App);

    const searchInput = getByTestId("search-input");
    await fireEvent.update(searchInput, "Accra");
    const searchButton = getByTestId("searchButton");
    await fireEvent.click(searchButton);
  });
});
