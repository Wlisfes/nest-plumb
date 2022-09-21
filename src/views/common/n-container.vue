<script>
import { mapState } from 'vuex'
import { NColumn } from '@/core/common'
import { createSuper, createCoreZoom, useScale } from '@/core/super'
import { Option } from '@/core/option'
import { v4 as only } from 'uuid'
import * as data from './data'

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
        this.$nextTick(() => {
            // this.$store
            //     .dispatch('setInit', {
            //         column: data.column,
            //         line: data.line,
            //         core: data.core
            //     })
            //     .finally(() => this.initSuper())

            this.initSuper()
        })
    },
    methods: {
        /**初始化实例**/
        async initSuper() {
            const instance = await createSuper(Option)
            this.instance = await this.initCoreZoom(instance)

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
                    this.$confirm(`确定要删除连接线吗？`, '提示', {
                        distinguishCancelAndClose: true,
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error',
                        beforeClose: (action, instance, done) => {
                            if (['cancel', 'close'].includes(action)) {
                                return done()
                            }
                            instance.confirmButtonLoading = true
                            setTimeout(() => {
                                this.instance.deleteConnection(e)
                                instance.confirmButtonLoading = false
                                done()
                            }, 500)
                        }
                    }).catch(e => {})
                })

                instance.setSuspendDrawing(false, true)
            })
        },
        /**创建画布实例**/
        async initCoreZoom(instance) {
            return await createCoreZoom(instance, {
                core: this.core,
                onPanstart: response => {
                    this.$store.commit('SET_AXIS', { x: true, y: true })
                },
                onPanend: response => {
                    this.$store.commit('SET_AXIS', { x: false, y: false })
                },
                onZoom: response => {
                    const { x, y, offsetX, offsetY, width, height, scale } = response
                    this.$store.commit('SET_CORE', { x, y, offsetX, offsetY, width, height, scale })
                },
                onTransform: response => {
                    const { x, y, offsetX, offsetY, width, height, scale } = response
                    this.$store.commit('SET_CORE', { x, y, offsetX, offsetY, width, height, scale })
                }
            })
        },
        /**绘制连接线**/
        async fetchConnect() {
            const { instance, line } = this
            await new Promise(resolve => {
                setTimeout(() => resolve(), 1000)
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
        /**拖拽添加节点**/
        onMounte(e) {
            const rect = this.instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale

            const node = {
                props: this.current,
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
    ::v-deep {
        .el-loading-mask {
            background-color: rgba(255, 255, 255, 1);
        }
        .jtk-connector.is-active {
            z-index: 9999;
            path {
                stroke: #150042;
                stroke-width: 3;
                animation: rotate 3s linear infinite;
                stroke-dasharray: 10;
            }
        }
        @keyframes rotate {
            from {
                stroke-dashoffset: 100;
            }
            to {
                stroke-dashoffset: 0;
            }
        }
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
