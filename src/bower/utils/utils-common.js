/**
 * 阻止冒泡、默认
 * @param { Event } e
 * @param { Function } handler
 */
export function stop(e, handler) {
    e.preventDefault()
    e.stopPropagation()
    handler?.()
}

/**
 * 即时函数
 * @param { Function } handler
 * @returns { Promise<Function> }
 */
export async function initMounte(handler) {
    return handler?.()
}

/**
 * 组件销毁
 * @param { Element } el
 * @param { Number } delay
 */
export function done(el, delay = 500) {
    const timeout = setTimeout(() => {
        el.parentNode?.removeChild?.(el)
        clearTimeout(timeout)
    }, delay)
}

/**
 * 延时函数
 * @param { Number } delay
 * @returns { Promise<Function> }
 */
export function useAwait(delay = 500) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), delay)
    })
}

/**
 * DOM位置
 * @param { Element } el
 * @param { Number } scale
 * @returns { DOMRect }
 */
export function useClientRect(el, scale = 1) {
    const client = el?.getBoundingClientRect()
    return {
        top: (client?.top ?? 0) / scale,
        bottom: (client?.bottom ?? 0) / scale,
        left: (client?.left ?? 0) / scale,
        right: (client?.right ?? 0) / scale,
        height: (client?.height ?? 0) / scale,
        width: (client?.width ?? 0) / scale,
        x: (client?.x ?? 0) / scale,
        y: (client?.y ?? 0) / scale
    }
}

/**
 * 节流函数
 * @param { Function } fn
 * @param { Number } delay
 * @returns { Function }
 */
export function throttle(fn, delay = 300) {
    var prev = Date.now()
    return function () {
        var context = this
        var args = arguments
        var now = Date.now()
        if (now - prev >= delay) {
            fn.apply(context, args)
            prev = Date.now()
        }
    }
}

/**
 * 开始连接
 * @param { Object } option
 */
export function startConnect(option) {
    const { e, column, line, instance, observer } = option
}

/**
 * 结束连接
 * @param { Object } option
 */
export function endConnect(option) {
    const { e, column, line, instance, observer } = option
}

/**
 * 判断是否可以连接
 * @param { Object } option
 */
export function isConnect(option) {
    const { e, column, line, instance, observer } = option
}
