/**
 * Copyright (c) Talysson de Oliveira Cassiano 2018 to present.
 *
 * See https://github.com/jeffijoe/awilix-express/blob/master/LICENSE.md
 */
import { IOptions } from 'glob'
import {
    rollUpState,
    HttpVerbs,
    getStateAndTarget,
    IStateAndTarget,
    IAwilixControllerBuilder,
    ClassOrFunctionReturning,
} from 'awilix-router-core'
import { makeInvoker } from './invokers.mjs'
import { Router } from 'express'
import { findControllers } from '../awilix-router-core/find-controllers.js'

/**
 * Constructor type.
 */
export type ConstructorOrControllerBuilder =
    | (new (...args: any[]) => any)
    | IAwilixControllerBuilder

/**
 * Registers one or multiple decorated controller classes.
 *
 * @param ControllerClass One or multiple "controller" classes
 *        with decorators to register
 */
export function controller(
    ControllerClass:
        | ConstructorOrControllerBuilder
        | ConstructorOrControllerBuilder[]
): Router {
    const router = Router()
    if (Array.isArray(ControllerClass)) {
        ControllerClass.forEach((c) =>
            _registerController(router, getStateAndTarget(c))
        )
    } else {
        _registerController(router, getStateAndTarget(ControllerClass))
    }

    return router
}

/**
 * Loads controllers for the given pattern.
 *
 * @param pattern
 * @param opts
 */
export async function loadControllers(pattern: string, opts?: IOptions): Promise<Router> {
    const router = Router()

    const controllers = await findControllers(pattern, {
        ...opts,
        absolute: true,
    })
    controllers.forEach(_registerController.bind(null, router))

    return router
}

/**
 * Reads the config state and registers the routes in the router.
 *
 * @param router
 * @param ControllerClass
 */
function _registerController(
    router: Router,
    stateAndTarget: IStateAndTarget | null
): void {
    if (!stateAndTarget) {
        return
    }

    const { state, target } = stateAndTarget
    const rolledUp = rollUpState(state)
    rolledUp.forEach((methodCfg, methodName) => {
        methodCfg.verbs.forEach((httpVerb) => {
            let method = httpVerb.toLowerCase()
            if (httpVerb === HttpVerbs['ALL']) {
                method = 'all'
            }

            (router as any)[method](
                methodCfg.paths,
                ...methodCfg.beforeMiddleware,
                /*tslint:disable-next-line*/
                makeInvoker(target as ClassOrFunctionReturning<any>)(methodName as any),
                ...methodCfg.afterMiddleware
            )
        })
    })
}
