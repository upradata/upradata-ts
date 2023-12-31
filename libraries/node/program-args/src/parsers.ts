/* eslint-disable object-shorthand */
import { requireModule, RequireOptions } from '@upradata/module';
import { setRecursive } from '@upradata/object';
import { composeLeft, isBoolean, isNil, isUndefined, stringToRegex } from '@upradata/useful';
import { InvalidArgumentError } from 'commander';

import type { ObjectOf } from '@upradata/types';
import type { AliasTransform, CliParserPrevious, CommanderParser, CommanderReducer, CommanderValueParser, ICliOption } from './cli.option.types';


const concat = <T>(value: T, previous: T[]) => [ ...previous, value ];

export const concatIfVariadic = <T>(isVariadic: boolean, value: T, previous?: CliParserPrevious<T>): CliParserPrevious<T> => {
    const array = isUndefined(previous) ? [] : Array.isArray(previous) ? previous : [ previous ];
    return isVariadic ? concat(value, array) : value;
};



const parseNumber = (type: 'int' | 'float'): CommanderParser<number> => function (this: ICliOption, value, previous) {
    // parseInt takes a string and a radix
    const parsedValue = type === 'int' ? parseInt(value, 10) : parseFloat(value);

    if (Number.isNaN(parsedValue))
        throw new InvalidArgumentError(`"${parsedValue}" is not a ${type === 'int' ? 'number' : 'float'}.`);

    return concatIfVariadic(this?.variadic, parsedValue, previous);
};



const reduce = <R, V = string>(
    init: R, reducer: (container: R, value: V) => R, parser?: CommanderValueParser<V>
): CommanderReducer<R> => function (this: ICliOption, value, previous, aliasOriginOption) {

    // if this.isValueFromDefault ==> option value was initially set with the option.defaultValue at creation
    const container = previous || (this.isValueFromDefault ? previous as R : init);

    return reducer(container, (parser?.call(this, value, undefined, aliasOriginOption) ?? value as V));
};


const parseArray = <V = string>(parser?: CommanderValueParser<V>): CommanderParser<V[], V[]> => {
    return reduce([] as V[], (container, value) => container.concat(value), parser);
};

export const parsers = {
    int: parseNumber('int'),
    float: parseNumber('float'),

    string: function (this: ICliOption, value, previous) {
        return concatIfVariadic(this?.variadic, value, previous);
    } as CommanderParser<string>,

    boolean: function (this: ICliOption, value: string, previous: CliParserPrevious<boolean>) {
        // when it is a boolean type option, like command --enable, there is no value

        const v = isNil(value) ?
            this.negate ? false : this.defaultValue || true :
            value;

        const ret = (v: boolean) => concatIfVariadic(this?.variadic, v, previous);

        if (isBoolean(v))
            return ret(v);

        if (v === 'true')
            return ret(true);

        if (v === 'false')
            return ret(false);

        throw new InvalidArgumentError(`"${v}" is not a boolean`);
    } as CommanderParser<boolean>,

    reduce,
    increaseNumber: (init: number): CommanderParser<number> => reduce(init, (sum, _v) => sum + 1),
    decreaseNumber: (init: number): CommanderParser<number> => reduce(init, (sum, _v) => sum - 1),

    array: parseArray,

    stringToArray: <V = string>(options: { separator?: string | RegExp; parser?: CommanderValueParser<V>; }) => {
        const { separator = ',', parser } = options;

        return parseArray((value: string) => {
            const values = value.split(separator);

            if (parser)
                return values.map(v => parser(v));

            return values;
        });
    },

    object: (key?: string) => function (this: ICliOption, value, previous) {
        let v: any = undefined;

        try {
            v = JSON.parse(value);
        } catch (e) {
            v = value;
        }

        if (key)
            v = setRecursive({}, key, v);

        return concatIfVariadic(this?.variadic, v, previous);

    } as CommanderParser<ObjectOf<any>>,

    cumulateObject: function <T extends object>(this: ICliOption, value: string, previous: CliParserPrevious<T>) {
        const o = JSON.parse(value);

        const trySetLastValue = () => {
            const lastValue = Array.isArray(previous) ? previous?.at(-1) : previous;

            if (!lastValue)
                return o;

            let isSet = false;

            for (const [ key, value ] of Object.entries(o)) {
                if (lastValue && !(key in lastValue)) {
                    lastValue[ key ] = value;
                    isSet = true;
                }
            }

            return isSet ? lastValue : o;
        };

        return concatIfVariadic(this?.variadic, trySetLastValue(), previous);
    },

    choices: <T = string>(choices: readonly T[], parser?: CommanderValueParser<T>): CommanderParser<T> => {
        const parsedChoices = (parser ? choices.map(c => typeof c === 'string' ? parser(c) : c) : choices) as T[];

        return function (this: ICliOption, value, previous) {
            const parsedValue = parser?.(value, previous) ?? value as unknown as T;

            if (!parsedChoices.includes(parsedValue))
                throw new InvalidArgumentError(`Allowed choices are ${choices.join(', ')}.`);

            return concatIfVariadic(this?.variadic, parsedValue, previous);
        };
    },

    regex: function (this: ICliOption, value: string, previous: CliParserPrevious<RegExp>) {
        const getRegex = () => {
            const res = value.match(/\/(.*)\/(.*)/);

            if (res) {
                const [ , regexS, flags ] = res;
                return { regexS, flags };
            }

            return { regexS: value, flags: undefined };
        };

        const { regexS, flags } = getRegex();
        const regex = stringToRegex(regexS, flags);

        return concatIfVariadic(this?.variadic, regex, previous);
    } as CommanderParser<RegExp>,

    require: <T = any>(options: RequireOptions): CommanderParser<T> => function (this: ICliOption, value, previous) {
        return concatIfVariadic(this?.variadic, requireModule(value, options), previous);
    },

    compose: <T = any, R = T>(...parsers: CommanderValueParser<any>[]): CommanderParser<T, R> => function (this: ICliOption, value, previous, aliasOriginOption) {
        const parsedValue = composeLeft(parsers.map(p => (v: string) => p.call(this, v, previous, aliasOriginOption)), value);
        return concatIfVariadic(this?.variadic, parsedValue, previous);
    },

    try: <T>(parser: CommanderParser<T>) => function (this: ICliOption, value: string, previous: CliParserPrevious<T>) {
        try {
            return parser.call(this, value, previous);
        } catch (e) {
            return value;
        }
    } as CommanderParser<T | string>,
};


type Map<T1, T2> = (value: T1) => T2;
export type AliasTransformer = (...transforms: [ Map<string, any>, ...Map<any, any>[], Map<any, string> ]) => AliasTransform;

export const transformCompose: AliasTransformer = (...transforms) => parsers.compose<never, string>(...transforms);

export const transforms = {
    toObject: (prop: string): AliasTransform => transformCompose(parsers.object(prop), (v: any) => JSON.stringify(v))
};
