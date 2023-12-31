"use strict";
import { computed, WritableComputedRef } from "vue";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | string;

type Options<T> = Partial<{
    serializer: Serializer<T>;
    parser: Parser<T>;
}>;

/**
 * Check if the local storage exists
 * @returns true if the local storage exists
 */
function localStorageExists(): boolean {
    try {
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
 * @param defaultValue default value if there is no value in the local storage
 * @param options Options for the hook. This is an object that can have the following properties:
 * - `serializer` the function to serialize the object to string before storing it in the local storage. Default to `JSON.stringify`
 * - `parser` the function to parse the string to object. Default to safeParse which will return the value itself if it cannot be parsed
 * - `logger` the function to log the error. Default to `console.error`
 */
function useLocalStorage<T>(key: string, defaultValue?: T, options?: Options<T>): WritableComputedRef<T | string>;
function useLocalStorage<T>(key: string, defaultValue?: T, options?: Options<T>): WritableComputedRef<T | string> {
    if (!localStorageExists()) {
        throw new Error("Local storage is not supported");
    }

    const opts: Options<T> = {
        serializer: (object: T | undefined) => JSON.stringify(object),
        parser: <T>(val: string) => safeParse<T>(val),
        ...options
    };

    const { serializer, parser } = opts;

    if (defaultValue) {
        localStorage.setItem(key, serializer(defaultValue));
    }

    const data = computed({
        get: () => parser(localStorage.getItem(key) || "") || defaultValue,
        set: (newValue: T) => {
            localStorage.setItem(key, serializer(newValue));
        }
    });

    return data;
}

export default useLocalStorage;
