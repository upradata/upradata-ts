import { styles as s, StyleTransformString } from '@upradata/template-string-style';
import { assignRecursive } from '@upradata/useful';
/* eslint-disable prefer-template */
import { Argument, Command, Help } from 'commander';
import { CliOption } from './cli.option';

import type { PartialRecursive } from '@upradata/types';


export type CliHelperStyles = {
    commandUsage: StyleTransformString<string>;
    commandDescription: StyleTransformString<string>;
    arguments: StyleTransformString<string>;
    options: StyleTransformString<string>;
    subCommand: StyleTransformString<string>;
};



export class CliHelperOptions {
    helpWidth: number = 80;
    sortSubcommands: boolean = false;
    sortOptions: boolean = false;
    styles: CliHelperStyles = {
        arguments: str => s.magenta.bold.$$(str),
        options: str => s.blue.italic.bold.$$(str),
        subCommand: str => str.replace(/(.*?)([[<].*)/, s.green.bold.$`ᐅ $1` + '$2'),
        commandUsage: str => str.replace(/(.*?)([[<].*)/, s.green.bold.$`$1` + '$2'),
        commandDescription: str => `Description: ` + s.cyan.bold.$$(str)
    };

    constructor(options?: CliHelperOpts) {
        assignRecursive(this, options);
    }
}


export type CliHelperOpts = PartialRecursive<CliHelperOptions>;

export class CliHelper extends Help {
    styles: CliHelperStyles;

    constructor(options?: CliHelperOpts) {
        super();
        Object.assign(this, new CliHelperOptions(options));
    }

    optionTerm(option: CliOption) {
        return this.styles.options(super.optionTerm(option));
    }

    argumentTerm(argument: Argument) {
        return this.styles.arguments(super.argumentTerm(argument));
    }

    subcommandTerm(command: Command) {
        return this.styles.subCommand(super.subcommandTerm(command));
    }

    commandUsage(command: Command) {
        return this.styles.commandUsage(super.commandUsage(command));
    }

    commandDescription(command: Command) {
        return this.styles.commandDescription(super.commandDescription(command));
    }

    formatHelp(command: Command, helper: CliHelper) {
        const output = super.formatHelp(command, helper);

        // eslint-disable-next-line prefer-template
        return output.replaceAll(/^(\S*?):(.*)/gm, s.underline.$`$1` + ':$2');
    }
}
