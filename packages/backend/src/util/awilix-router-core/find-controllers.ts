/**
 * Copyright (c) Jeff Hansen 2017 to present.
 *
 * https://github.com/jeffijoe/awilix-router-core/blob/master/LICENSE.md
 */
import { IStateAndTarget, getStateAndTarget } from 'awilix-router-core'
import { IOptions } from 'glob'
import { glob } from '../../util.mjs'

/**
 * Find Controllers result.
 */
export type FindControllersResult = Array<IStateAndTarget>

/**
 * Finds classes using the specified pattern and options.
 *
 * @param pattern Glob pattern
 * @param opts Glob options
 */
export async function findControllers(
    pattern: string,
    opts?: IOptions
): Promise<FindControllersResult> {
    const result = await glob(pattern, opts)

    const mapped = await Promise.all(result.map(async (path) => {
        const items: Array<IStateAndTarget | null> = []

        const required = await import(path)

        if (required) {
            const stateAndTarget = getStateAndTarget(required)
            if (stateAndTarget) {
                items.push(stateAndTarget)
                return items
            }

            // loop through exports - this will cover named as well as a default export
            for (const key of Object.keys(required)) {
                items.push(getStateAndTarget(required[key]))
            }
        }

        return items
    }))

    return mapped
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter(x => x !== null) as FindControllersResult
}
