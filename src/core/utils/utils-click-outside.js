function validate(binding) {
    if (typeof binding.value.handler !== 'function') {
        console.warn('[Vue-click-outside:] provided expression', binding.expression, 'is not a function.')
        return false
    }

    return true
}

function isPopup(popupItem, elements) {
    if (!popupItem || !elements) return false

    for (var i = 0, len = elements.length; i < len; i++) {
        try {
            if (popupItem.contains(elements[i])) {
                return true
            }
            if (elements[i].contains(popupItem)) {
                return false
            }
        } catch (e) {
            return false
        }
    }

    return false
}

function isServer(vNode) {
    return typeof vNode.componentInstance !== 'undefined' && vNode.componentInstance.$isServer
}

function isNodeWhite(e, className) {
    return (e.path ?? []).some(el => {
        return Array.from(el.classList).some(name => className.includes(name))
    })
}

export const ClickOutside = {
    bind: function (el, binding, vNode) {
        if (!validate(binding)) return

        // Define Handler and cache it on the element
        function handler(e) {
            if (!vNode.context) return

            // some components may have related popup item, on which we shall prevent the click outside event handler.
            var elements = e.path || (e.composedPath && e.composedPath())
            elements && elements.length > 0 && elements.unshift(e.target)

            if (el.contains(e.target) || isPopup(vNode.context.popupItem, elements)) {
                return false
            }

            if (binding.value.option?.white && isNodeWhite(e, binding.value.option)) {
                return false
            }

            el?.__vueClickOutside__?.callback?.(e)
        }

        // add Event Listeners
        el.__vueClickOutside__ = {
            handler: handler,
            callback: binding.value.handler
        }
        const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
        !isServer(vNode) && document.addEventListener(clickHandler, handler, binding.value.option?.catch ?? true)
    },
    update: function (el, binding) {
        if (validate(binding)) el.__vueClickOutside__.callback = binding.value.handler
    },
    unbind: function (el, binding, vNode) {
        // Remove Event Listeners
        const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
        !isServer(vNode) &&
            el.__vueClickOutside__ &&
            document.removeEventListener(clickHandler, el.__vueClickOutside__.handler)
        delete el.__vueClickOutside__
    }
}
