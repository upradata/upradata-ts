import {
    buildStyle,
    DefinedStringTransforms,
    recreateString,
    Style,
    StyleOptions,
    styles as s,
    Styles,
    StyleTransform
} from '@upradata/template-string';
import { ensureArray } from '@upradata/useful';
import { makeObject } from '@upradata/object';
import colorsStyles from 'colors/lib/styles';
import { supportsColor } from 'colors/lib/system/supports-colors';
import * as colorsSafe from 'colors/safe';

import type { ToString } from '@upradata/types';
import type { TerminalStyleNames } from './helpers/terminal-styles.type';


export * from '@upradata/template-string/lib-esnext/export';
type AllTerminalStyleNames = (keyof typeof colorsSafe) | TerminalStyleNames;
type TerminalStyleStringTranforms = Record<AllTerminalStyleNames, StyleTransform> & { none: (s: string) => string; };


export const COLORS_SAFE = colorsSafe as unknown as TerminalStyleStringTranforms;
COLORS_SAFE.none = (s: string) => s;

const props = Object.keys(colorsStyles).concat('none', 'stripColors', 'strip') as AllTerminalStyleNames[];

export const colorsTransforms = makeObject(props, (k): StyleOptions => ({
    transforms: [
        (strings: TemplateStringsArray | ToString, ...keys: ToString[]) => recreateString(ensureArray(strings) as any, ...keys),
        COLORS_SAFE[ k ]
    ],
    flattenIfNoTransforms: recreateString
}));


buildStyle(props, colorsTransforms);

export type TerminalStyles = Styles<DefinedStringTransforms & TerminalStyleStringTranforms>;
export const styles = s as TerminalStyles;


// backward compatible

export const colors = styles;

export type ColorType = ColorsSafe & Style;

export type ColorsSafe = {
    [ k in keyof AllTerminalStyleNames ]: ColorType;
};




export const disableTTYStylesIfNotSupported = (stream: NodeJS.WriteStream = process.stdout) => {

    const supports = supportsColor(stream);

    if (!supports)
        colorsSafe.disable();
};


type Std = 'stdout' | 'stderr';
export const disableStdTTYStyles = (stds: readonly [ Std ] | readonly [ Std, Std ] = [ 'stdout', 'stderr' ]) => {
    stds.forEach(k => disableTTYStylesIfNotSupported(process[ k ]));
};


export const enableTTYStyles = () => {
    colorsSafe.enable();
};
