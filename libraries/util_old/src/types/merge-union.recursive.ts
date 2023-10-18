import { ExcludeExact, Levels } from './useful';

type IsRecursivable<T> = never |
    T extends (RegExp | Date | Promise<any>) ? false :
    T extends (...args: any[]) => any ? false :
    T extends unknown[] ? true :
    T extends object ? true :
    false;


type CommonKeys<T> = keyof T;
type Keys<T> = T extends unknown ? keyof T : never;
type NonCommonKeys<T> = Exclude<Keys<T>, CommonKeys<T>>;


// it it well know that conditional type distribution is made on the first parameter of the condition only if the parameter is naked (only the parameter T)
// you can see it there https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// For instance type ToArray<T> = T extends any ? T[] : never;  => ToArray<string | number> == string[] | number[] and not (string | number)[]
// To avoid it, T must not be naked, i.e. T must be the parameter of something => [T] extends any or AnyGeneric<T> extends any => T is NOT naked
// see https://github.com/microsoft/TypeScript/issues/29368
// So ToArray<T> = [T] extends [any] ? T[] : never; =>  ToArray<string | number> == (string | number)[] this time string | number is seen as one Type (one element)

// But be careful, in each branch where T appears, the [T] extends trick has to be repeated.
// Here, T appears in the [ K in CommmonKeys<T> ] first, so we have to put the trick before leading to this ugly syntax CommonKeys<T> extends infer K1 ... to avoid
// distribution !! :)))
type Common<T, Level extends number> = CommonKeys<T> extends infer K1 ? {
    [ K in K1 & CommonKeys<T> ]: IsRecursivable<T[ K ]> extends true ? MergeReduce<T[ K ], Level> : T[ K ]
} : never;

type NonCommonValue<T, K extends PropertyKey> = T extends Partial<Record<K, infer V>> ? keyof T extends never ? never : V : never;


type NonCommon<T, Level extends number> = NonCommonKeys<T> extends infer K1 ? {
    // NonCommon properties must be optional as their are not in every type of the union
    [ K in K1 & NonCommonKeys<T> ]?: IsRecursivable<T[ K ]> extends true ? MergeReduce<T[ K ], Level> : NonCommonValue<T, K>
} : never;




type Values<T extends object> = T extends T ? {
    [ K in keyof T ]: T[ K ];
} : never;



type UnionToFuncParam<U> = U extends any ? (k: U) => void : never;
type UnionFuncParamToIntersection<U> = UnionToFuncParam<U> extends ((k: infer I) => void) ? I : never;
type ExtractFuncParm<F> = F extends { (a: infer A): void; } ? A : never;

// the built-in type Exclude<T, U> = T extends U ? never : T is not adapted for us because
// if A = { a: 1; } | { a: 1; b: 2; } => Exclude<A, { a: 1 }> == never
// ExcludeExact<A, { a: 1; }> == { a: 1; b: 2; } ===> excludes the "exact" type from a union
type SpliceOne<Union> = ExcludeExact<Union, ExtractOne<Union>>;
type ExtractOne<Union> = ExtractFuncParm<UnionFuncParamToIntersection<UnionToFuncParam<Union>>>;


type MergeReduce<Union, Level extends number = 5> = Level extends 0 ? Union : MergeReduceImpl<Union, {}, Levels[ Level ]>;
type MergeReducer<T, Container, Level extends number> = Merge<T | Container, Level>;
type Merge<T, Level extends number> = Values<Common<T, Level> & NonCommon<T, Level>>;

type MergeReduceImpl<Union, Container, Level extends number> =
    SpliceOne<Union> extends never ? MergeReducer<ExtractOne<Union>, Container, Level>
    : MergeReduceImpl<SpliceOne<Union>, MergeReducer<ExtractOne<Union>, Container, Level>, Level>;


// !! See union-reducer for an an explaination and some examples of how the Reducer is working !!
// !! Se merge-union for an an explaination and some examples of how the Merge is working !!
export type MergeRecursive<TUnion> = MergeReduce<TUnion>;


// type Test = MergeRecursive<
//     { a: 1; c: { c1?: 'c1', c2: { c3?: 'c3'; }; }; } |
//     { b?: 2; c: { a: 11; b: { b1: 'b1'; }; c2: { c3: 33; c4: 44; }; }; } |
//     { d: 'd'; c: { c1: '+', c2: { c3: '-'; c5: 55; }; c33: 333; }; }
// >;


// type Test = {
//     c: {
//         c1: "c1" | "+";
//         c2: {
//             c3: "c3" | 33 | "-";
//             c4?: 44;
//             c5?: 55;
//         };
//         b?: {
//             b1: 'b1';
//         };
//         a?: 11;
//         c33?: 333;
//     };
//     d?: "d";
//     b?: 2;
//     a?: 1;
// }


// type Test = MergeReduce<{ a: 1; } | { a: 2; b: 3; }>;
// type Test = {
//     a: 1 | 2;
//     b?: 3;
// }
