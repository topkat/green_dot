
import { isset } from 'topkat-utils'

const event = {
    /**
     * @param priority the higher the prior
     */
    on(eventName: string, callback: Function, priority = 50) {
        if (!isset(event.registeredEvents[eventName])) event.registeredEvents[eventName] = []
        event.registeredEvents[eventName].push([priority, callback])
        event.registeredEvents[eventName].sort(([priorityA], [priorityB]) => priorityB - priorityA)
    },
    /** unregister a callback from an event */
    off(eventName: string, callback: Function) {
        if (!isset(event.registeredEvents[eventName])) return
        const eventIndex = event.registeredEvents[eventName].findIndex(([, callback2]) => callback === callback2)
        if (eventIndex !== -1) {
            event.registeredEvents[eventName].splice(eventIndex, 1)
            return true
        } else return false
    },
    /** asynchronous error catchable event
     * will run all callbacks according to their priority
     * @param {array} paramsValidationArray
     * @returns {Object} metadata (will be passed as final argument of each event function to be modified by the different modules)
    */
    async emit(eventName: string, ctx: Ctx, ...params) {
        const metadata = {}
        if (!isset(event.registeredEvents[eventName])) event.registeredEvents[eventName] = []
        if (event.registeredEvents[eventName]) {
            for (const [, callback] of event.registeredEvents[eventName]) await callback(ctx, ...params, metadata)
        }
        return metadata
    },
    /** SYNCHRONOUS
    */
    emitSync(eventName: string, ctx: Ctx, ...params) {
        const metadata = {}
        if (!isset(event.registeredEvents[eventName])) event.registeredEvents[eventName] = []
        if (event.registeredEvents[eventName]) {
            for (const [, callback] of event.registeredEvents[eventName]) callback(ctx, ...params, metadata)
        }
        return metadata
    },
    registeredEvents: {} as { [EventName: string]: Array<[priority: number, callback: Function]> },
}

export default event