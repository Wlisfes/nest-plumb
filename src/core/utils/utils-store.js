import { v4 } from 'uuid'
import { observer } from './utils-observer'

export const command = {
    reload: 'RELOAD',
    loading: 'LOADING',
    validator: 'VALIDATOR',
    delete: 'DELETE'
}

export function setReload(props) {
    return new Promise(resolve => {
        observer.emit(command.reload, {
            props,
            done: () => resolve(props)
        })
    })
}

export function setDone(loading) {
    return new Promise(resolve => {
        observer.emit(command.loading, {
            loading,
            done: () => resolve(loading)
        })
    })
}

export function setValidator(node) {
    return new Promise(resolve => {
        observer.emit(command.validator, {
            node,
            done: () => resolve(node)
        })
    })
}

export function setDelete(props) {
    return new Promise(resolve => {
        observer.emit(command.delete, {
            props,
            done: () => resolve(props)
        })
    })
}

/**
 * 创建初始化节点
 * @param { Array } data
 * @param { String } type
 */
export function createNode(props) {
    const { data = [], type, el, locale = 'cn' } = props
    const MARK = {
        BIND_TASK: { cn: '绑定发送任务', en: '绑定发送任务' },
        AUTO_MATIC: { cn: '自动营销', en: '自动营销' },
        CREATE_TRIGGER: { cn: '创建触发器', en: '创建触发器' }
    }
    //prettier-ignore
    return data.filter(x => x.type === type).map(x => {
        return {
            current: x,
            rules: (x.rules ?? []).map(x => ({ ...x, id: v4() })),
            name: MARK[x.type][locale],
            root: 1,
            delete: 0,
            id: v4(),
            top: '100px',
            left: el.clientWidth / 2 - 165 +'px'
        }
    })
}
