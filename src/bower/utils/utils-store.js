import { observer } from './utils-observer'

export function setReload(props) {
    return new Promise(resolve => {
        observer.emit('reload', {
            props,
            done: () => resolve(props)
        })
    })
}
