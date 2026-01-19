import type { ComponentType } from "react";

/**
 * Checks if the value is a React component (function or class component)
 * @param value - The value to check
 * @returns true if the value is a React component
 */
export function isReactComponent(value: unknown): value is ComponentType<any> {
    return typeof value === "function";
}
