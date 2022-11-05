<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { v4 } from 'uuid'
import { NColumn } from '@/core/common'
import { createSuper, createCoreZoom, useScale } from '@/core/super'
import { Option } from '@/core/option'
import { Observer } from '@/utils/utils-observer'
import { useAwait, throttle } from '@/utils/utils-common'
import { fetchTooltip } from '@/core/hook/fetch-tooltip'
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
            instance: null,
            recent: null,
            observer: new Observer()
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

                //开始连线
                instance.bind('connectionDrag', e => {
                    this.column.forEach(x => {
                        if (e.sourceId !== x.id) {
                            instance.getEndpoint(x.id).canvas.classList.add('is-suspended')
                        }
                    })
                })

                //结束连线
                instance.bind('connectionDragStop', e => {
                    this.column.forEach(x => {
                        instance.getEndpoint(x.id).canvas.classList.remove('is-suspended')
                    })
                })

                //两个端点完成连线前的校验
                instance.bind('beforeDrop', e => {
                    return e.sourceId !== e.targetId
                })

                //连线完毕、维护本地数据
                instance.bind('connection', e => {
                    this.$store.dispatch('setLine', {
                        command: 'CREATE',
                        node: {
                            id: v4(),
                            parent: e.sourceId,
                            source: e.sourceEndpoint.getUuid(),
                            target: e.targetId,
                            label: '猪头'
                        }
                    })
                })

                //删除线完毕、维护本地数据
                instance.bind('connectionDetached', e => {
                    const node = this.line.find(x => x.source === e.sourceEndpoint.getUuid())
                    this.$store.commit('SET_LINE', {
                        command: 'DELETE',
                        node
                    })
                })

                //单击连线
                instance.bind('click', (e, evt) => {
                    const rect = instance.getContainer().getBoundingClientRect()
                    const scale = useScale(instance)
                    const left = (evt.pageX - rect.left) / scale
                    const top = (evt.pageY - rect.top) / scale
                    fetchTooltip({
                        left,
                        top,
                        container: document.getElementById('context')
                    }).then(response => {
                        response.instance.$once('close', ({ done }) => done())
                        response.instance.$once('submit', ({ done, setState }) => {
                            setState(true)
                            setTimeout(() => {
                                instance.deleteConnection(e)
                                done()
                            }, 500)
                        })
                    })
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
            await useAwait(1000)
            line.forEach(x => {
                instance.connect({
                    id: x.id,
                    source: x.source,
                    target: x.target,
                    uuids: [x.source, x.target],
                    anchor: ['TopCenter', 'BottomCenter'],
                    endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                })
            })
            return await useAwait(100)
        },
        /**拖拽添加节点**/
        onMounte(e) {
            const { instance, recent } = this
            const rect = instance.getContainer().getBoundingClientRect()
            const scale = useScale(instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale

            const node = {
                props: this.current,
                rules: [
                    { content: '猪头', id: v4(), type: 'success' },
                    { content: '笨蛋', id: v4(), type: 'danger' },
                    { content: '蠢货', id: v4(), type: 'info' }
                ],
                id: v4(),
                top: Math.round(top / 100) * 100 + 'px',
                left: Math.round(left / 100) * 100 + 'px'
            }
            //prettier-ignore
            this.$store.dispatch('setColumn', { command: 'CREATE', node }).then(() => {
                //此处添加连接线
                setTimeout(() => {
                    if (recent) {
                        instance.connect({
                            id: v4(),
                            source: recent.id,
                            target: node.id,
                            uuids: [recent.id, node.id],
                            anchor: ['TopCenter', 'BottomCenter'],
                            endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                        })
                    }
                    this.$nextTick(() => {
                        this.recent = null
                    })
                }, 16)
            })
        },
        //捕获位置
        onCapture: throttle(function (e) {
            const { instance, column, line } = this
            const rect = instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const pageX = (e.pageX - rect.left - 60) / scale
            const pageY = (e.pageY - rect.top - 20) / scale

            const rules = column
                .filter(x => !!x.rules.length)
                .reduce((c, n) => {
                    return c.concat(n.rules.map(x => ({ ...x, parent: n })))
                }, [])
                .filter(x => !line.some(n => n.source === x.id))
                .map(x => {
                    const { left, top } = x.parent
                    const source = document.getElementById(x.id)
                    const a = parseFloat(left) + source.offsetLeft + 22 - pageX
                    const b = parseFloat(top) + source.offsetTop + 28 - pageY
                    return {
                        ...x,
                        el: source,
                        distance: Math.sqrt(a * a + b * b) / scale
                    }
                })
                .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))

            const recent = rules?.shift()
            if (recent && recent.distance < 250) {
                this.recent = recent
            } else {
                this.recent = null
            }
        }, 100),
        onDragover(e) {
            e.preventDefault()
            this.onCapture(e)
        },
        /**拖拽捕获连接点**/
        onSuspended(response) {
            this.recent = response
            // if (response) {
            //     if (this.suspended) {
            //     }
            // } else if (this.suspended) {
            //     this.instance.getEndpoint(suspended.id).canvas.classList.add('is-suspended')
            // }
            // if (response) {
            //     this.instance.getEndpoint(response.id).canvas.classList.add('is-suspended')
            // }
        }
    },
    render() {
        const { axis, core, column } = this

        return (
            <div v-loading={this.loading} class="n-container" onDragover={this.onDragover} onDrop={this.onMounte}>
                <div ref="context" id="context">
                    <div class="axis-x" v-show={axis.x} style={{ width: core.width, left: core.offsetX + 'px' }}></div>
                    <div class="axis-y" v-show={axis.y} style={{ height: core.height, top: core.offsetY + 'px' }}></div>

                    {this.instance &&
                        column.map(x => (
                            <n-column
                                id={x.id}
                                key={x.id}
                                node={x}
                                instance={this.instance}
                                observer={this.observer}
                                recent={this.recent}
                                onDrag-column={this.onSuspended}
                            ></n-column>
                        ))}
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
            cursor: crosshair;
            transition: transform 300ms;
            &.is-suspended {
                transform: scale(2);
            }
            &.is-source {
                &::after {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 100%;
                    background-image: url('~@/assets/icon/caret-down.png');
                    background-repeat: no-repeat;
                    background-size: 20px 20px;
                }
            }
            &.is-target {
                &::after {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 100%;
                    background-image: url('~@/assets/icon/caret-up.png');
                    background-repeat: no-repeat;
                    background-size: 20px 20px;
                    background-position-y: -2px;
                }
            }
        }
        .jtk-overlay {
            z-index: 6;
        }
    }
}
</style>
