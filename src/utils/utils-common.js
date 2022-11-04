export function stop(e, handler) {
    e.preventDefault()
    e.stopPropagation()
    handler?.()
}

export async function initMounte(handler) {
    return handler?.()
}

export function done(el, delay) {
    const timeout = setTimeout(() => {
        el.parentNode?.removeChild?.(el)
        clearTimeout(timeout)
    }, delay)
}

/**
 * 获取dom位置
 * @param { Element } el
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
 * @returns Function
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
