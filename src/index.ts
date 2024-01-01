"use strict";
import { onBeforeUnmount, ref, watch } from "vue";
import { isEqual } from "lodash";
/**
 * Check if the local storage exists
 * @returns true if the local storage exists
 */
function localStorageExists(): boolean {
    try {
        if (!window || !window.localStorage) return false;
        const testKey = "__useLocalStorage__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 *
 * @param value the value to be parse as object
 * @returns the parsed object or the value itself if it cannot be parsed
 */
function safeParse<T>(value: string) {
    try {
        return JSON.parse(value) as T;
    } catch (error) {
        return value as T;
    }
}

/**
 *
 * @param key the key in the local storage
 * @param defaultValue default value if there is no value in the local storage. It is most recommended to provide this value
 * @param options Options for the hook. This is an object that can have the following properties:
 * - `serializer` the function to serialize the object to string before storing it in the local storage. Default to `JSON.stringify`
 * - `parser` the function to parse the string to object. Default to safeParse which will return the value itself if it cannot be parsed
 * - `logger` the function to log the error. Default to `console.error`
 */
function useLocalStorage<T>(key: string, defaultValue?: T) {
    if (!localStorageExists()) {
        throw new Error("Local storage is not supported");
    }

    const opts = {
        serializer: (object: T | undefined) => {
            if (typeof object === "string") return object;
            return JSON.stringify(object);
        },
        parser: <T>(val: string) => safeParse<T>(val)
    };
    const { serializer, parser } = opts;

    const rawItem = localStorage.getItem(key) ?? "";
    if (rawItem) {
        try {
            parser(rawItem);
        } catch (error) {
            console.error(error);
            localStorage.removeItem(key);
        }
    } else if (defaultValue) {
        localStorage.setItem(key, serializer(defaultValue));
    }

    const data = ref<T | string>(parser(rawItem) || defaultValue || "");

    watch(data, (newValue) => {
        localStorage.setItem(key, serializer(newValue as unknown as T));
    });

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
            const newValue = parser(event.newValue || "") || defaultValue;
            if (!isEqual(newValue, data.value)) (data.value as T) = (parser(event.newValue || "") || defaultValue) as T;
        }
    };

    window.addEventListener("storage", handleStorageChange);

    onBeforeUnmount(() => {
        window.removeEventListener("storage", handleStorageChange);
    });
    return data;
}

export default useLocalStorage;
export { useLocalStorage };
