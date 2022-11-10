import Vue from 'vue'
import { observer } from './utils-observer'

class Store {
    static instance
    constructor() {
        if (!Store.instance) {
            this.store = Vue.observable({
                loading: true,
                line: [],
                column: [],
                axis: { x: true, y: true },
                core: {
                    width: '100%',
                    height: '100%',
                    scale: 1,
                    offsetX: 0,
                    offsetY: 0,
                    x: 0,
                    y: 0
                }
            })
            Store.instance = this
        }
        return Store.instance
    }

    useStore() {
        return this.store
    }

    async setAxis(axis) {
        return (this.store.axis = axis)
    }

    async setCore(core) {
        return (this.store.core = core)
    }

    async setDone(loading) {
        return (this.store.loading = loading)
    }

    async setLine(props) {
        if (props.command === 'RELOAD') {
            this.store.line = props.line
        } else {
            const n = this.store.line.findIndex(x => x.id === props.node.id)
            if (props.command === 'CREATE') {
                this.store.line.push(props.node)
            } else if (props.command === 'DELETE' && n !== -1) {
                this.store.line.splice(n, 1)
            }
        }
        return { props, line: this.store.line }
    }

    async setColumn(props) {
        if (props.command === 'RELOAD') {
            this.store.column = props.column
        } else {
            // console.log(this.store.column)
            // const n = this.store.column.findIndex(x => x.id === props.node.id)
            // if (props.command === 'CREATE') {
            //     this.store.column.push(props.node)
            // } else if (props.command === 'UPDATE' && n !== -1) {
            //     this.store.column.splice(n, 1, props.node)
            // } else if (props.command === 'DELETE' && n !== -1) {
            //     this.store.column.splice(n, 1)
            // }
        }
        return { props, column: this.store.column }
    }
}

export const store = new Store()
