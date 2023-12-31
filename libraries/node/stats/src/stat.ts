import type { TableRow, TableRows } from '@upradata/terminal';
import type { ObjectOf } from '@upradata/types';


export type StatType = 'global' | 'detailed';

export interface StatData<T extends StatType = StatType> {
    headers: string[];
    data: T extends 'global' ? TableRow : TableRows;
}

export interface Stat {
    name: string;
    datas(collectionName: string): ObjectOf<StatData>;
    /* successes: string[];
    fails: StatFail[];
    processed: string[]; // not cached for instance
    all: string[]; // all (before cache for instance) */
}


export type StatCtor<S extends Stat> = new (name: string) => S;
