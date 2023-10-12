import { keys, makeObject } from '../../object';
import { buildStyle, DefinedStringTransforms, recreateString, Styles, StyleTransform, styles as s } from '../../template-string';

export class Colors<T = any> {
    none: T = undefined as any;
    reset: T = undefined as any;
    bold: T = undefined as any;
    dim: T = undefined as any;
    italic: T = undefined as any;
    underline: T = undefined as any;
    inverse: T = undefined as any;
    hidden: T = undefined as any;
    strikethrough: T = undefined as any;
    black: T = undefined as any;
    red: T = undefined as any;
    green: T = undefined as any;
    yellow: T = undefined as any;
    blue: T = undefined as any;
    magenta: T = undefined as any;
    cyan: T = undefined as any;
    white: T = undefined as any;
    gray: T = undefined as any;
    grey: T = undefined as any;
    bgBlack: T = undefined as any;
    bgRed: T = undefined as any;
    bgGreen: T = undefined as any;
    bgYellow: T = undefined as any;
    bgBlue: T = undefined as any;
    bgMagenta: T = undefined as any;
    bgCyan: T = undefined as any;
    bgWhite: T = undefined as any;
    blackBG: T = undefined as any;
    redBG: T = undefined as any;
    greenBG: T = undefined as any;
    yellowBG: T = undefined as any;
    blueBG: T = undefined as any;
    magentaBG: T = undefined as any;
    cyanBG: T = undefined as any;
    whiteBG: T = undefined as any;
}


export const colorsTransforms = makeObject(Colors, k => (s: string) => `<${k}>${s}</${k}>`);

const props = keys(new Colors());
buildStyle(props, makeObject(props, k => ({ transforms: [ colorsTransforms[ k ], recreateString ] })));


export const styles = s as Styles<DefinedStringTransforms & Colors<StyleTransform>>;
export const colors = makeObject(Colors, k => styles[ k ].$);
