type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 深度合并配置对象
 * @param defaultConfig 默认配置
 * @param userConfig 用户配置（可以是部分配置）
 * @returns 合并后的完整配置
 * 
 * @example
 * const defaultConfig = {
 *   foo: {
 *     bar: 1,
 *     baz: 2
 *   },
 *   qux: false
 * };
 * 
 * const userConfig = {
 *   foo: {
 *     bar: 3
 *   }
 * };
 * 
 * const result = mergeConfig(defaultConfig, userConfig);
 * // result = {
 * //   foo: {
 * //     bar: 3,
 * //     baz: 2
 * //   },
 * //   qux: false
 * // }
 */
export function mergeConfig<T extends object>(
    defaultConfig: T,
    userConfig: DeepPartial<T>
): T {
    const merged = { ...defaultConfig };

    for (const key in userConfig) {
        const defaultValue = defaultConfig[key];
        const userValue = userConfig[key];

        if (userValue === undefined) {
            continue;
        }

        // 如果两个值都是对象且不是数组，则递归合并
        if (
            defaultValue &&
            userValue &&
            typeof defaultValue === 'object' &&
            typeof userValue === 'object' &&
            !Array.isArray(defaultValue) &&
            !Array.isArray(userValue)
        ) {
            merged[key] = mergeConfig(defaultValue, userValue);
        } else {
            // 对于非对象值或数组，直接使用用户配置覆盖
            merged[key] = userValue as T[typeof key];
        }
    }

    return merged;
}
