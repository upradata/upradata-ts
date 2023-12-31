/**
 * Utility functions for TypeScript and JavaScript development.
 * @packageDocumentation
 */

/**
 * This file contains a collection of utility functions and types that can be used across a TypeScript project.
 * The functions include type guards, array and promise helpers, and a function to safely access nested object properties.
 * The types include a generic constructor type and several type aliases for arrays and object keys.
 */

import { isArray, isDefined, isPromise } from './is';

import type { Arr, InferArrayType, Key, TT$, Constructor } from '@upradata/types';


// chain(() => o.a.b.c) ==> if a prop doesn't exist ==> return defaultValue
// Now it is not necessary anymore with o?.a syntax
/**
 * Safely accesses a nested property of an object using a function expression.
 * If any property in the chain is undefined or null, returns the specified default value.
 * @param exp - A function expression that returns the nested property to access.
 * @param defaultValue - The default value to return if any property in the chain is undefined or null.
 * @returns The value of the nested property, or the default value if any property in the chain is undefined or null.
 */
export function chain<T>(exp: () => T, defaultValue: T = undefined as T) {
    try {
        return exp();
    } catch (e) {
        if (!(isErrorOf(e, ReferenceError) || isErrorOf(e, TypeError)))
            throw e;
    }
    return defaultValue;
}

/**
 * Checks if an error object is an instance of a specified error constructor or has the same constructor or name.
 * @param e - The error object to check.
 * @param errorCtor - The error constructor to check against.
 * @returns True if the error object is an instance of the specified error constructor or has the same constructor or name, false otherwise.
 */
export function isErrorOf(e: any, errorCtor: Constructor) {
    return e instanceof errorCtor || e.constructor === errorCtor || e.name === errorCtor.name;
}



/**
 * Ensures that a value is an array, wrapping it in an array if it is not already an array.
 * @param v - The value to ensure as an array.
 * @returns An array containing the value, or the original array if it is already an array.
 */
export function ensureArray<T, ValueCanBeUndefined extends boolean = false>(
    v: T, options?: { valueCanBeUndefined?: ValueCanBeUndefined; }
): T extends Arr<any, 'readonly'> ? T : Array<ValueCanBeUndefined extends true ? T : Exclude<T, undefined>> {

    return (isArray(v) ? v : isDefined(v) || options?.valueCanBeUndefined ? [ v ] : []) as any;
}

/**
 * Ensures that a value is an array, wrapping it in an array if it is not already an array.
 * @param v - The value to ensure as an array.
 * @returns An array containing the value, or the original array if it is already an array.
 */
export function ensurePromise<T>(v: T | Promise<T>): Promise<T> {
    return isPromise(v) ? v : Promise.resolve(v);
}


/**
 * Ensures that a value is a Promise, wrapping it in a Promise if it is not already a Promise.
 * @param v - The value to ensure as a Promise.
 * @returns A Promise containing the value, or the original Promise if it is already a Promise.
 */
export function ensureFunction<T>(v: T): T extends (...args: any[]) => any ? T : never {
    return typeof v === 'function' ? v as any : (..._args: any[]) => v;
}

/* type F = ((data: number) => string) | string;
const f: F = 'test';

const ff = ensureFunction(f as F); */


type Filler<T> = (i: number) => T;
/**
 * Ensures that a value is a function, returning the original function if it is already a function.
 * @param v - The value to ensure as a function.
 * @returns The original function if it is already a function, or a new function that returns the value if it is not a function.
 */
export const arrayN = <T = any>(n: number, fill: T | Filler<T> = undefined as T): T[] => {
    const filler: Filler<T> = typeof fill === 'function' ? fill as Filler<T> : _i => fill;

    const create = (array: T[], i: number): T[] => {
        if (i === n)
            return array;

        return create([ ...array, filler(i) ], i + 1);
    };

    return create([], 0);
};


/**
 * Creates an array of a specified length, optionally filled with a specified value or a function that generates values.
 * @param n - The length of the array to create.
 * @param fill - The value or function to use to fill the array. If a function is provided, it will be called with the index of each element.
 * @returns An array of the specified length, filled with the specified value or generated by the specified function.
 */
export const filterByKey = <A extends Arr<any>, T extends InferArrayType<A>, V extends T[ K ], K extends Key = 'type'>(array: A, value: V, key: K = 'key' as any):
    T extends { [ k in K ]: V } ? T[] : never => {
    return array.filter(v => v[ key ] === value) as any;
};

/* const a = filterByKey([ { type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 11 }, { type: 'a', v: 111 }, { type: 'c', v: 3 } ] as const, 'a' as const, 'type');
const a0 = a[ 0 ];
a0.type === 'a';
a0.v === 11;

const b = filterByKey([ { type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 11 }, { type: 'a', v: 111 }, { type: 'c', v: 3 } ], 'a', 'type');
 */

/**
 * Filters an array of objects by a specified key and value.
 * @param array - The array of objects to filter.
 * @param value - The value to filter by.
 * @param key - The key to filter by. Defaults to 'key'.
 * @returns An array of objects that have the specified value for the specified key.
 */
export const firstTruthy = <T>(...array: Array<T>): any => {
    const isFunction = (v: any): v is Function => typeof v === 'function' && v.length === 0;

    const first = (array: Array<T>): any => {
        if (array.length === 0)
            return false;

        const [ head, ...tail ] = array;

        const value = isFunction(head) ? head() : head;

        // eslint-disable-next-line no-extra-boolean-cast
        return !!value ? value : first(tail);
    };

    return first(array);
};

/* firstTruthy([ false, undefined, 1, 2 ]) === 1;
firstTruthy([ false, undefined, () => 'bonjour', 2 ]) === 'bonjour'; */


/**
 * Returns the first truthy value in an array of values, or false if no truthy value is found.
 * If a value is a function with no arguments, it will be called and its return value will be used.
 * @param array - The array of values to search.
 * @returns The first truthy value in the array, or false if no truthy value is found.
 */
export const arrayFromIterable = <T>(it: Iterable<T>): T[] => Array.isArray(it) ? it : [ ...it ];


export interface PollOptions {
    duration: number;
    timeStep?: number;
}

/**
 * Converts an iterable object to an array.
 * @param it - The iterable object to convert to an array.
 * @returns An array containing the elements of the iterable object.
 */
export const poll = <S, E>(handler: () => TT$<{ stop: boolean; error?: E; success?: S; }>, options: PollOptions) => {
    const { duration, timeStep = 100 } = options;
    let totalWait = 0;

    return new Promise<S>((resolve, reject) => {
        const id = setInterval(async () => {
            const { error, success, stop } = await handler();

            if (stop) {
                resolve(success as S);
                clearInterval(id);
            } else if (totalWait > duration) {
                reject(error);
                clearInterval(id);
            }

            totalWait += timeStep;
        }, timeStep);
    });
};
