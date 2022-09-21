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