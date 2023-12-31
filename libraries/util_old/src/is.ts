/* eslint-disable space-before-function-paren */
// export * from 'ts-util-is';
// export * is not supported by rollup with commonjs :(((

// https://github.com/justinlettau/ts-util-is is using ESM, so I forked it + I added up mines

/**
 * Determines if a reference is an `Array`.
 *
 * @param value - Reference to check.
 */
export function isArray(value: any): value is any[] {
    return Array.isArray(value);
}

/**
 * Determines if a reference is a valid base64 string.
 *
 * @param value - Reference to check.
 */
export function isBase64(value: any): value is string {
    const base64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

    return isString(value) && base64.test(value);
}

/**
 * Determines if a reference is a `Boolean`.
 *
 * @param value - Reference to check.
 */
export function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}

/**
 * Determines if a reference is a `Date`.
 *
 * @param value - Reference to check.
 */
export function isDate(value: any): value is Date {
    return Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * Determines if a reference is a valid `Date`.
 *
 * @param value - Reference to check.
 */
export function isDateValid(value: any): value is Date {
    return isDate(value) && !Number.isNaN(value.getTime());
}

/**
 * Determines if a reference is defined.
 *
 * @param value - Reference to check.
 */
export function isDefined<T>(value: T | undefined): value is T {
    return typeof value !== 'undefined';
}

/**
 * Determines if a reference is an `Error`.
 *
 * @param value - Reference to check.
 */
export function isError(value: any): value is Error {
    return (
        Object.prototype.toString.call(value) === '[object Error]' ||
        value instanceof Error
    );
}

/**
 * Determines if a reference is a `Function`.
 *
 * @param value - Reference to check.
 */
// tslint:disable-next-line:ban-types
export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}

/**
 * Determines if a reference is a valid GUID string.
 *
 * @param value - Reference to check.
 */
export function isGuid(value: any): value is string {
    const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return isString(value) && guid.test(value);
}

/**
 * Determines if a reference is `Infinity` (positive or negative).
 *
 * @param value - Reference to check.
 */
export function isInfinity(value: any): value is number {
    return value === Infinity || value === -Infinity;
}

/**
 * Determines if a reference is `null`.
 *
 * @param value - Reference to check.
 */
export function isNull(value: any): value is null {
    return value === null;
}


type IsNumberOptions = { acceptsNaN?: boolean; acceptsInfinity?: boolean; };

/**
 * Determines if a reference is a `Number`.
 *
 * @param value - Reference to check.
 */
export function isNumber(value: any, options?: IsNumberOptions): value is number {
    const { acceptsNaN = false, acceptsInfinity = false } = options || {};

    const isNb = typeof value === 'number';

    if (!isNb)
        return false;

    if (!acceptsNaN && Number.isNaN(value))
        return false;

    if (!acceptsInfinity && isInfinity(value))
        return false;

    return true;
}

/**
 * Determines if a reference is an 'Object'.
 *
 * @param value - Reference to check.
 */
export function isObject(value: any): value is object | null {
    return typeof value === 'object';
}



/**
 * Determines if a reference is a plain `Object`. A "plain" object is typically created by `{}` or
 * `new Object()`. Some types such as arrays and null, while technically objects, are not considered
 * plain objects.
 *
 * @param value - Reference to check.
 */
export function isPlainObject(value: any): value is object {
    return (
        isObject(value) &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
}

/**
 * Determines if a reference is a `RegExp`.
 *
 * @param value - Reference to check.
 */
export function isRegExp(value: any): value is RegExp {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}

/**
 * Determines if a reference is a `String`.
 *
 * @param value - Reference to check.
 */
export function isString(value: any): value is string {
    return typeof value === 'string';
}

/**
 * Determines if a reference is a `Symbol`.
 *
 * @param value - Reference to check.
 */
export function isSymbol(value: any): value is symbol {
    return typeof value === 'symbol';
}

/**
 * Determines if a reference is `undefined`.
 *
 * @param value - Reference to check.
 */
export function isUndefined(value: any): value is undefined {
    return typeof value === 'undefined';
}

/**
 * Determines if a reference is null or undefined.
 *
 * @param value - Reference to check
 */
export function isNil(value: any): value is null | undefined {
    return isNull(value) || isUndefined(value);
}

/**
 * Determines if a reference is an instance of `type`.
 *
 * @param value - Reference to check
 * @param ctor - Constructor type to check against
 */
export function isInstance<T extends new (...args: any[]) => any>(
    value: any,
    ctor: T
): value is InstanceType<T> {
    return value instanceof ctor;
}




// MDN Polyfill
export function isInt(n: number) {
    return typeof n === 'number' &&
        Number.isFinite(n) &&
        Math.floor(n) === n;
}

export function isFloat(n: number) {
    return !isInt(n);
}


export function isAsyncFunction(value: any) {
    return Object.prototype.toString.call(value) === '[object AsyncFunction]';
}

export function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
    return isDefined(v) && (v instanceof Promise || isDefined((v as any).then));
}


export function isDefinedProp<T extends object | any[]>(o: T, k: keyof T) {
    return k in o;
}
