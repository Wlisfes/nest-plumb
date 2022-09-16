import Vue from 'vue'

async function setStore(key, data) {
    return window.localStorage.setItem(key, JSON.stringify(data))
}

function useStore(key) {
    const data = window.localStorage.getItem(key)
    if (data) {
        return JSON.parse(data)
    }
    return {
        line: [],
        column: [],
        multiple: [
            { primary: 'M-1', name: '身份核实' },
            { primary: 'M-2', name: '证件号码确认' }
        ],
        axis: { x: true, y: true },
        location: { width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 0, y: 0 }
    }
}

export function useState() {
    const state = Vue.observable(useStore('__state__'))

    const setState = async fn => {
        fn(state)
        return await setStore('__state__', state)
    }

    return { state, setState }
}
