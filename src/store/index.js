import Vue from 'vue'
import Vuex from 'vuex'
import createStorage from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        multiple: [],
        line: [],
        column: [],
        axis: { x: true, y: true },
        core: { width: '100%', height: '100%', scale: 1, offsetX: 0, offsetY: 0, x: 0, y: 0 }
    },
    mutations: {
        SET_AXIS: (state, axis) => {
            state.axis = axis
        },
        SET_CORE: (state, core) => {
            state.core = core
        },
        SET_LINE: (state, props) => {
            const n = state.line.findIndex(x => x.id === props.node.id)
            if (props.command === 'CREATE') {
                state.line.push(props.node)
            } else if (props.command === 'DELETE' && n !== -1) {
                state.line.splice(n, 1)
            }
        },
        SET_COLUMN: (state, props) => {
            const n = state.column.findIndex(x => x.id === props.node.id)
            if (props.command === 'CREATE') {
                state.column.push(props.node)
            } else if (props.command === 'UPDATE' && n !== -1) {
                state.column.splice(n, 1, props.node)
            } else if (props.command === 'DELETE' && n !== -1) {
                state.column.splice(n, 1)
            }
        }
    },
    actions: {
        setAxis: async ({ commit }, props) => {
            return commit('SET_AXIS', props)
        },
        setCore: async ({ commit }, props) => {
            return commit('SET_CORE', props)
        },
        setLine: async ({ commit }, props) => {
            return commit('SET_LINE', props)
        },
        setColumn: async ({ commit }, props) => {
            commit('SET_COLUMN', props)
        }
    },
    plugins: [createStorage({ storage: window.localStorage })]
})
