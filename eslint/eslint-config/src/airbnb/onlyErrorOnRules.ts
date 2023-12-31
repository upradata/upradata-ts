#!/usr/bin/env node

const severities = [ 'off', 'warn', 'error' ];

function getSeverity(ruleConfig) {
    if (Array.isArray(ruleConfig)) {
        return getSeverity(ruleConfig[ 0 ]);
    }
    if (typeof ruleConfig === 'number') {
        return severities[ ruleConfig ];
    }
    return ruleConfig;
}

export async function onlyErrorOnRules(rulesToError, config, options) {
    const errorsOnly = { ...config };


    Object.entries(options.baseRules).forEach((rule) => {
        const ruleName = rule[ 0 ];
        const ruleConfig = rule[ 1 ];
        const severity = getSeverity(ruleConfig);

        if (rulesToError.indexOf(ruleName) === -1 && severity === 'error') {
            if (Array.isArray(ruleConfig)) {
                errorsOnly.rules[ ruleName ] = [ 'warn' ].concat(ruleConfig.slice(1));
            } else if (typeof ruleConfig === 'number') {
                errorsOnly.rules[ ruleName ] = 1;
            } else {
                errorsOnly.rules[ ruleName ] = 'warn';
            }
        }
    });

    return errorsOnly;
}
