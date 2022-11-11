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
