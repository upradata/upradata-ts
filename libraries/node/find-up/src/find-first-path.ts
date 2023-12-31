import { SyncAsyncMode, SyncAsyncType } from '@upradata/node-util';
import fs from 'fs-extra';
import process from 'node:process';
import path from 'node:path';


const typeMappings = {
    directory: 'isDirectory',
    file: 'isFile',
};

export type Type = keyof typeof typeMappings;

export class FindFirstPathOptions {
    /**
    The current working directory.
    @defaultValue process.cwd()
    */
    readonly directory: string = process.cwd();

    /**
    The type of path to match.
    @defaultValue 'file'
    */
    readonly type: Type = 'file';

    /**
    Allow symbolic links to match if they point to the requested path type.
    @defaultValue true
    */
    readonly allowSymlinks: boolean = true;

    /**
    Preserve `paths` order when searching.
    Disable this to improve performance if you don't care about the order.
    @defaultValue true
    */
    readonly preserveOrder: boolean = true;

    /**
    The number of concurrently pending promises.
    Minimum: `1`
    @defaultValue Infinity
    */
    readonly nbConcurrentPromises: number = Infinity;

    constructor(options: FindFirstPathOpts = {}) {
        Object.assign(this, options);
    }
}


export type FindFirstPathOpts = Partial<FindFirstPathOptions>;


const getStatFunction = <Mode extends SyncAsyncMode>(
    mode: Mode, allowSymlinks: boolean
): SyncAsyncType<Mode, fs.StatSyncFn, (path: fs.PathLike) => Promise<fs.Stats | undefined>> => {

    const statSync = allowSymlinks ? fs.statSync : fs.lstatSync;
    const statAsync = (allowSymlinks ? fs.stat : fs.lstat);

    const statSyncNoError = (path: fs.PathLike, options?: fs.StatOptions): fs.Stats | undefined => {
        try {
            return statSync(path, options) as fs.Stats;
        } catch (e) {
            return undefined;
        }
    };

    const statAsyncNoError = (path: fs.PathLike): Promise<fs.Stats | undefined> => {
        return statAsync(path).catch(_e => undefined);
    };

    return mode === 'sync' ? statSyncNoError : statAsyncNoError as any;
};

type GetStat<M extends SyncAsyncMode> = SyncAsyncType<M, fs.StatSyncFn, (path: fs.PathLike) => Promise<fs.Stats>>;


const _findFirstPath = <Mode extends SyncAsyncMode>(mode: Mode) =>
    (paths: string[], options?: FindFirstPathOpts): SyncAsyncType<Mode, string> | undefined => {

        const { allowSymlinks, directory, type, nbConcurrentPromises, preserveOrder } = new FindFirstPathOptions(options);

        const matchType = <M extends SyncAsyncMode>(stat: fs.Stats | undefined): SyncAsyncType<M, boolean> => stat?.[ typeMappings[ type ] ]() ?? false;

        const getStat = getStatFunction(mode, allowSymlinks);

        const findPathInOrder = (paths: string[]): SyncAsyncType<Mode, string> | undefined => {
            if (paths.length === 0)
                return undefined;

            const [ p, ...restPaths ] = paths;

            const stat = getStat(path.resolve(directory, p));
            const found = stat instanceof Promise ? stat.then(matchType) : matchType(stat);

            if (typeof found === 'boolean')
                return found ? p : findPathInOrder(restPaths) as any;


            return found.then(isFound => isFound ? p : findPathInOrder(restPaths)) as any;
        };


        const findRandom = async (i: number = 0): Promise<string | undefined> => {
            const nextI = i + nbConcurrentPromises;
            const slicePaths = paths.slice(i, nextI);

            try {
                return await Promise.any(slicePaths.map(async p => {
                    const isFound = await (getStat as GetStat<'async'>)(path.resolve(directory, p)).then(matchType);
                    return isFound ? p : Promise.reject(new Error('not found'));
                }));
            } catch (e) {
                if (nextI > paths.length)
                    return undefined;

                return findRandom(nextI);
            }
        };

        return mode === 'sync' || preserveOrder ? findPathInOrder(paths) : findRandom() as any;
    };



export type FindFirstPath = {
    (paths: string[], options?: FindFirstPathOpts): Promise<string | undefined>;
    async: (paths: string[], options?: FindFirstPathOpts) => Promise<string | undefined>;
    sync: (paths: string[], options?: FindFirstPathOpts) => string | undefined;
};

export const findFirstPath = _findFirstPath('async') as FindFirstPath;
export const findFirstPathSync = _findFirstPath('sync');

findFirstPath.async = findFirstPath;
findFirstPath.sync = findFirstPathSync;
