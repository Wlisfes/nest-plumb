import panzoom from 'panzoom'
import { jsPlumb } from 'jsplumb'
import { v4 as only } from 'uuid'

/**创建实例**/
export async function createSuper(option) {
    return jsPlumb.getInstance(option)
}

//缩放监听
export async function initCoreZoom(instance, option) {
    const mainContainer = instance.getContainer()
    const mainContainerWrap = mainContainer.parentNode

    const pan = panzoom(mainContainer, {
        smoothScroll: false,
        bounds: true,
        zoomDoubleClickSpeed: 1,
        minZoom: 0.5, //最小缩放0.5倍
        maxZoom: 5, //最大2倍
        beforeWheel: e => {},
        beforeMouseDown: e => e.ctrlKey
    })

    instance.mainContainerWrap = mainContainerWrap
    instance.pan = pan

    // 缩放时设置jsPlumb的缩放比率
    pan.on('zoom', e => {
        const { x, y, scale } = e.getTransform()
        instance.setZoom(scale)
        option?.onZoom?.(e)
    })
    pan.on('transform', e => {
        option?.onTransform?.(e)
    })

    // 平移时设置鼠标样式
    mainContainerWrap.style.cursor = 'grab'
    mainContainerWrap.addEventListener('mousedown', function wrapMousedown() {
        this.style.cursor = 'grabbing'
        mainContainerWrap.addEventListener('mouseout', function wrapMouseout() {
            this.style.cursor = 'grab'
        })
    })
    mainContainerWrap.addEventListener('mouseup', function wrapMouseup() {
        this.style.cursor = 'grab'
    })

    return instance
}

//获取比例
export function useScale(instance) {
    if (instance.pan) {
        const { scale } = instance.pan.getTransform()
        instance.setZoom(scale)
        return scale
    } else {
        const matrix = window.getComputedStyle(instance.getContainer()).transform
        const scale = matrix.split(', ')[3] * 1
        instance.setZoom(scale)
        return scale
    }
}
