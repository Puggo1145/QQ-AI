import { test, expect } from "@jest/globals";

import { mergeConfig } from "@/utils/common/merge-config";

test.skip('merge simple config', () => {
    const defaultConfig = {
        a: 1,
        b: 2
    }
    const userConfig = {
        a: 1,
        b: 3
    }

    const config = mergeConfig(defaultConfig, userConfig);
    expect(config).toEqual({ a: 1, b: 3 });
});

test.skip('merge partial config', () => {
    const defaultConfig = {
        a: 1,
        b: 2
    }

    const userConfig = {
        b: 3
    }

    const config = mergeConfig(defaultConfig, userConfig);
    expect(config).toEqual({ a: 1, b: 3 });
});

test.skip('merge config with undefined', () => {
    const defaultConfig = {
        a: 1,
        b: 2
    }
    const userConfig = {
        b: undefined
    }

    const config = mergeConfig(defaultConfig, userConfig);
    expect(config).toEqual({ a: 1, b: 2 });
});

test.skip('merge nested config', () => {
    const defaultConfig = {
        a: 1,
        b: {
            c: 2
        }
    }
    const userConfig = {
        b: {
            c: 3
        }
    }

    const config = mergeConfig(defaultConfig, userConfig);
    expect(config).toEqual({ a: 1, b: { c: 3 } });
});
