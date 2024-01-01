/**
 * @jest-environment node
 */

import { describe, expect, it } from "vitest";
import useLocalStorage from "../src";

describe("use local storage hook in non-browser env", () => {
    it("should throw error if local storage is not supported", () => {
        expect(() => useLocalStorage("testKey", "defaultValue")).toThrowError("Local storage is not supported");
    });
});
