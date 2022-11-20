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
    const { e, column, line, instance } = option
    const current = column.find(x => x.id === e.sourceId)
    for (const node of column) {
        if (
            node.current.max === 0 ||
            node.id === current.id ||
            !node.current.connect.includes(current.current.type) ||
            line.some(x => x.parent === current.id && x.target === node.id)
        ) {
            /**
             * 1:当前node节点禁止连接
             * 2:排除当前node节点
             * 3:上层节点禁止与当前node节点建立连接
             * 4:上层节点与当前节点已建立连接关系
             */
            continue
        } else if (node.current.max === -1) {
            /**当前node可以无限连接**/
            instance.getEndpoint(node.id)?.canvas?.classList.add('is-suspended')
        } else {
            /**获取以当前node节点为起点的连接线**/
            const total = line.filter(n => n.target === node.id).length ?? 0
            if (total >= node.current.max) {
                /**当前node节点连接数量不足**/
                continue
            } else {
                instance.getEndpoint(node.id)?.canvas?.classList.add('is-suspended')
            }
        }
    }
}

/**
 * 结束连接
 * @param { Object } option
 */
export function endConnect(option) {
    const { column, instance } = option
    column.forEach(x => {
        instance.getEndpoint(x.id)?.canvas?.classList.remove('is-suspended')
    })
}

/**
 * 判断是否可以连接
 * @param { Object } option
 */
export function isConnect(option) {
    const { e, column, line, instance, observer } = option
    if (e.sourceId === e.targetId) {
        /**起点==终点**/
        return '起点不能与终点连接'
    } else {
        const sourceNode = column.find(x => x.id === e.sourceId)
        const targetNode = column.find(x => x.id === e.targetId)
        if (!targetNode.current.connect.includes(sourceNode.current.type)) {
            /**上层节点禁止与当前node节点建立连接**/
            return '上层节点禁止与当前node节点建立连接'
        } else if (line.some(x => x.parent === e.sourceId && x.target === e.targetId)) {
            /**上层节点与当前节点已建立连接关系**/
            return '上层节点与当前节点已建立连接关系'
        }
    }
    return undefined
}
