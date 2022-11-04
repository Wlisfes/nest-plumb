import panzoom from 'panzoom'
import { jsPlumb } from 'jsplumb'

/**
 * 创建实例
 * @param { Object } option
 * @returns Super
 */
export async function createSuper(option) {
    const instance = jsPlumb.getInstance()
    instance.importDefaults(option)
    return instance
}

/**
 * 创建画布实例
 * @param { Super } instance
 * @param { Object } option
 * @returns Super
 */
export async function createCoreZoom(instance, option) {
    const mainContainer = instance.getContainer()
    const mainContainerWrap = mainContainer.parentNode
    const pan = panzoom(mainContainer, {
        smoothScroll: false,
        bounds: false,
        zoomDoubleClickSpeed: 1,
        minZoom: 0.1,
        maxZoom: 10,
        initialZoom: option.core?.scale ?? 1,
        beforeWheel: e => {
            return true
        },
        beforeMouseDown: e => e.ctrlKey
    })
    pan.moveTo(option.core?.x ?? 0, option.core?.y ?? 0)

    instance.mainContainerWrap = mainContainerWrap
    instance.pan = pan

    const useTransform = e => {
        const { x, y, scale } = e.getTransform()
        return {
            e,
            scale,
            x,
            y,
            offsetX: -(x / scale),
            offsetY: -(y / scale),
            width: (1 / scale) * 100 + '%',
            height: (1 / scale) * 100 + '%'
        }
    }

    //拖动开始
    pan.on('panstart', e => {
        const response = useTransform(e)
        option?.onPanstart?.(response)
    })

    //拖动结束
    pan.on('panend', function (e) {
        const response = useTransform(e)
        option?.onPanend?.(response)
    })

    //缩放事件
    pan.on('zoom', e => {
        const response = useTransform(e)
        instance.setZoom(response.scale)
        option?.onZoom?.(response)
    })

    //拖动事件
    pan.on('transform', e => {
        const response = useTransform(e)
        instance.setZoom(response.scale)
        option?.onTransform?.(response)
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

export function fetchConnect() {}
