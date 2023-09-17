## API Report File for "@upradata/heft-typescript-plugin"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { HeftConfiguration } from '@rushstack/heft';
import { ITerminal } from '@rushstack/node-core-library';
import { SyncHook } from 'tapable';
import type * as TTypescript from 'typescript';

// @beta (undocumented)
export interface IChangedFilesHookOptions {
    // (undocumented)
    changedFiles?: ReadonlySet<TTypescript.SourceFile>;
    // (undocumented)
    program: TTypescript.Program;
}

// @beta (undocumented)
export interface IEmitModuleKind {
    // (undocumented)
    jsExtension?: 'js' | 'cjs' | 'mjs';
    // (undocumented)
    jsExtensionOverride?: string;
    // (undocumented)
    moduleKind: Exclude<keyof typeof TTypescript.ModuleKind, 'None'>;
    // (undocumented)
    outFolderName: string;
    // (undocumented)
    target?: keyof typeof TTypescript.ScriptTarget;
}

// @beta (undocumented)
export interface IPartialTsconfig {
    // (undocumented)
    compilerOptions?: IPartialTsconfigCompilerOptions;
}

// @beta (undocumented)
export interface IPartialTsconfigCompilerOptions {
    // (undocumented)
    outDir?: string;
}

// @beta (undocumented)
export interface IStaticAssetsCopyConfiguration {
    // (undocumented)
    excludeGlobs: string[];
    // (undocumented)
    fileExtensions: string[];
    // (undocumented)
    includeGlobs: string[];
}

// @beta (undocumented)
export interface ITypeScriptConfigurationJson {
    additionalModuleKindsToEmit?: IEmitModuleKind[] | undefined;
    buildProjectReferences?: boolean;
    emitCjsExtensionForCommonJS?: boolean | undefined;
    emitMjsExtensionForESModule?: boolean | undefined;
    project?: string;
    staticAssetsToCopy?: IStaticAssetsCopyConfiguration;
    useTranspilerWorker?: boolean;
    useTsconfigAsBase?: boolean;
}

// @beta (undocumented)
export interface ITypeScriptPluginAccessor {
    // (undocumented)
    readonly onChangedFilesHook: SyncHook<IChangedFilesHookOptions>;
}

// @beta (undocumented)
export function loadPartialTsconfigFileAsync(heftConfiguration: HeftConfiguration, terminal: ITerminal, typeScriptConfigurationJson: ITypeScriptConfigurationJson | undefined): Promise<IPartialTsconfig | undefined>;

// @beta (undocumented)
export function loadTypeScriptConfigurationFileAsync(heftConfiguration: HeftConfiguration, terminal: ITerminal): Promise<ITypeScriptConfigurationJson | undefined>;

// @public
export const TypeScriptPluginName: 'typescript-plugin';

```