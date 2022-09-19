<script>
import { mapState } from 'vuex'
import { NColumn } from '@/core/common'
import { createSuper, initCoreZoom, useScale } from '@/core/super'
import { Option } from '@/core/option'
import { v4 as only } from 'uuid'

export default {
    name: 'NContainer',
    components: { NColumn },
    props: {
        current: { type: Object, default: () => null }
    },
    computed: {
        ...mapState({
            axis: state => state.axis,
            core: state => state.core,
            line: state => state.line,
            column: state => state.column
        })
    },
    data() {
        return {
            loading: true,
            instance: null
        }
    },
    mounted() {
        createSuper(Option).then(async instance => {
            this.instance = instance
            await initCoreZoom(instance, {
                x: this.core.x,
                y: this.core.y,
                scale: this.core.scale,
                onZoom: response => {
                    const { x, y, offsetX, offsetY, width, height, scale } = response
                    this.$store.commit('SET_CORE', { x, y, offsetX, offsetY, width, height, scale })
                },
                onTransform: response => {
                    const { x, y, offsetX, offsetY, width, height, scale } = response
                    this.$store.commit('SET_CORE', { x, y, offsetX, offsetY, width, height, scale })
                }
            })
            instance.ready(async () => {
                await this.fetchConnect().then(() => (this.loading = false))

                //完成连线前的校验
                instance.bind('beforeDrop', e => {
                    const parent = document.getElementById(e.sourceId)?.getAttribute('data-parent')
                    return e.sourceId !== e.targetId && e.targetId !== parent
                })

                //连线完毕、维护本地数据
                instance.bind('connection', e => {
                    const node = {
                        id: only(),
                        source: e.sourceId,
                        target: e.targetId,
                        label: '猪头'
                    }
                    this.$store.dispatch('setLine', { command: 'CREATE', node })
                })

                //删除线完毕、维护本地数据
                instance.bind('connectionDetached', e => {
                    const node = this.line.find(x => x.source === e.sourceId && x.target === e.targetId)
                    this.$store.commit('SET_LINE', {
                        command: 'DELETE',
                        node
                    })
                })

                //双击连线
                instance.bind('dblclick', e => {
                    instance.deleteConnection(e)
                })

                instance.setSuspendDrawing(false, true)
            })
        })
    },
    methods: {
        async fetchConnect() {
            const { instance, line } = this
            await new Promise(resolve => {
                setTimeout(() => resolve(), 1500)
            })
            return line.map(x =>
                instance.connect({
                    id: x.id,
                    source: x.source,
                    target: x.target,
                    uuids: [x.source, x.target],
                    anchor: ['TopCenter', 'BottomCenter'],
                    endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                })
            )
        },

        onMounte(e) {
            const rect = this.instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale

            const node = {
                ...this.current,
                line: [],
                id: only(),
                top: Math.round(top / 100) * 100 + 'px',
                left: Math.round(left / 100) * 100 + 'px'
            }
            this.$store.commit('SET_COLUMN', { command: 'CREATE', node })
        }
    },
    render() {
        const { axis, core, column } = this

        return (
            <div
                v-loading={this.loading}
                class="n-container"
                onDragover={e => e.preventDefault()}
                onDrop={this.onMounte}
            >
                <div ref="context" id="context">
                    <div class="axis-x" v-show={axis.x} style={{ width: core.width, left: core.offsetX + 'px' }}></div>
                    <div class="axis-y" v-show={axis.y} style={{ height: core.height, top: core.offsetY + 'px' }}></div>

                    {this.instance && (
                        <div>
                            {column.map(x => (
                                <n-column id={x.id} key={x.id} node={x} instance={this.instance}></n-column>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    outline: none !important;
    background-image: url('~@/assets/point.png');
    &:hover {
        cursor: grab;
    }
    &:active {
        cursor: grabbing;
    }
}
#context {
    position: relative;
    width: 100%;
    height: 100%;
    .axis-x,
    .axis-y {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
    }
    ::v-deep {
        .window {
            z-index: 20;
        }
        .jtk-connector {
            z-index: 4;
        }
        .jtk-endpoint {
            z-index: 5;
        }
        .jtk-overlay {
            z-index: 6;
        }
    }
}
</style>
