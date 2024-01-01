/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it } from "vitest";
import TestComponent from "./TestComponent.tsx";
import useLocalStorage from "../src/index.ts";
import { mount, config } from "@vue/test-utils";

describe("use local storage hook", () => {
    beforeEach(() => {
        window.localStorage.clear();
        config.global.config.warnHandler = (_msg, _vm, _trace) => {};
    });

    it("should set default value to local storage if provided", async () => {
        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "testKey",
                initalValue: "defaultValue"
            }
        });
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;

        const text = wrapper.find("p");
        expect(data.value).toBe("defaultValue");
        expect(text.text()).toBe("defaultValue");
    });

    it("should return default value if no value in local storage", () => {
        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "testKey",
                initalValue: "defaultValue"
            }
        });
        const text = wrapper.find("p");
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;
        expect(data.value).toBe("defaultValue");
        expect(text.text()).toBe("defaultValue");
    });
    it("should return value from local storage if exists", () => {
        localStorage.setItem("test", JSON.stringify("storedValue"));

        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "test",
                initalValue: "defaultValue"
            }
        });
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;
        expect(data.value).toBe("storedValue");
        const text = wrapper.find("p");
        expect(text.text()).toBe("storedValue");
    });

    it("should update local storage when value is set", async () => {
        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "testKey",
                initalValue: "defaultValue"
            }
        });
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;

        data.value = "newValue";
        await wrapper.vm.$nextTick();
        expect(data.value).toBe("newValue");
        const text = wrapper.find("p");
        expect(text.text()).toBe("newValue");
        expect(localStorage.getItem("testKey")).toBe("newValue");
    });

    it("should use custom serializer and parser if provided", async () => {
        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "testKey",
                initalValue: "defaultValue"
            }
        });
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;
        expect(localStorage.getItem("testKey")).toBe("defaultValue");
        expect(data.value).toBe("defaultValue");
        data.value = "newValue";
        await wrapper.vm.$nextTick();
        expect(localStorage.getItem("testKey")).toBe("newValue");
        expect(data.value).toBe("newValue");
        const text = wrapper.find("p");
        expect(text.text()).toBe("newValue");
    });

    it("value is object", async () => {
        const wrapper = mount(TestComponent, {
            props: {
                localStorageKey: "testKey",
                initalValue: { name: "defaultValue" }
            }
        });
        const data = wrapper.vm.dataRef.data as ReturnType<typeof useLocalStorage>;
        expect(data.value).toEqual({ name: "defaultValue" });
    });
});
