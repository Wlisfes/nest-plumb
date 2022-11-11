<script>
import { v4 } from 'uuid'
import { Option } from '../option'
import { createSuper, createCoreZoom, createBatchConnect, useScale } from '../super'
import { command } from '../utils/utils-store'
import { observer } from '../utils/utils-observer'
import { throttle } from '../utils/utils-common'
import { fetchTooltip } from '../hook/fetch-tooltip'
import { Common } from '../components'

export default {
    name: 'NContainer',
    props: {
        current: { type: Object, default: null }
    },
    data() {
        return {
            observer,
            loading: true,
            instance: null,
            recent: null,
            target: null,
            /**参数配置**/
            axis: { x: true, y: true },
            core: { width: '100%', height: '100%', scale: 1, offsetX: 0, offsetY: 0, x: 0, y: 0 },
            column: [],
            line: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSuper().then(instance => {
                this.$emit('ready', instance)
            })
            const uninstall = [
                /**订阅删除事件**/
                this.observer.on(command.loading, ({ loading, done }) => {
                    done((this.loading = loading))
                }),
                /**订阅重载事件**/
                this.observer.on(command.reload, ({ props, done }) => {
                    this.setCore(props.core ?? this.core).then(async () => {
                        await this.setColumn({ command: 'RELOAD', column: props.column ?? [] })
                        await createBatchConnect(this.instance, { update: true, line: props.line ?? [] })
                        await done()
                    })
                })
            ]
            this.$once('hook:beforeDestroy', () => {
                uninstall.map(fn => fn())
                this.instance.reset()
            })
        })
    },
    methods: {
        /**初始化实例**/
        initSuper() {
            return new Promise(async resolve => {
                const instance = await createSuper(Option)
                this.instance = await this.initCoreZoom(instance)
                instance.ready(async () => {
                    /**批量绘制连接线**/
                    await createBatchConnect(instance, { line: this.line })

                    /**开始连线**/
                    instance.bind('connectionDrag', e => {
                        this.column.forEach(x => {
                            if (e.sourceId !== x.id) {
                                instance.getEndpoint(x.id).canvas.classList.add('is-suspended')
                            }
                        })
                    })

                    /**结束连线**/
                    instance.bind('connectionDragStop', e => {
                        this.column.forEach(x => {
                            instance.getEndpoint(x.id).canvas.classList.remove('is-suspended')
                        })
                    })

                    /**两个端点完成连线前的校验**/
                    instance.bind('beforeDrop', e => {
                        return e.sourceId !== e.targetId
                    })

                    /**连线完毕、维护本地数据**/
                    instance.bind('connection', e => {
                        this.setLine({
                            command: 'CREATE',
                            node: {
                                id: v4(),
                                parent: e.sourceId,
                                source: e.sourceEndpoint.getUuid(),
                                target: e.targetId,
                                label: '猪头'
                            }
                        }).then(({ props }) => {
                            e.connection.canvas.setAttribute('id', props.node.id)
                        })
                    })

                    /**删除线完毕、维护本地数据**/
                    instance.bind('connectionDetached', e => {
                        const node = this.line.find(x => x.source === e.sourceEndpoint.getUuid())
                        this.setLine({ command: 'DELETE', node })
                    })

                    /**单击连线**/
                    instance.bind('click', (e, evt) => {
                        const rect = instance.getContainer().getBoundingClientRect()
                        const scale = useScale(instance)
                        const left = (evt.pageX - rect.left) / scale
                        const top = (evt.pageY - rect.top) / scale
                        fetchTooltip({
                            left,
                            top,
                            message: '确定要删除连接吗?',
                            container: document.getElementById('context')
                        }).then(response => {
                            response.instance.$once('close', ({ done }) => done())
                            response.instance.$once('submit', ({ done, setState }) => {
                                setState(true)
                                setTimeout(() => {
                                    instance.deleteConnection(e)
                                    done()
                                }, 300)
                            })
                        })
                    })

                    instance.setSuspendDrawing(false, true)
                    resolve(instance)
                })
            })
        },
        /**创建画布拖拽实例**/
        async initCoreZoom(instance) {
            return await createCoreZoom(instance, {
                core: this.core,
                onPanstart: e => {
                    this.setAxis({ x: true, y: true })
                },
                onPanend: e => {
                    this.setAxis({ x: false, y: false })
                },
                onZoom: e => {
                    const { x, y, offsetX, offsetY, width, height, scale } = e
                    this.core = { x, y, offsetX, offsetY, width, height, scale }
                },
                onTransform: e => {
                    const { x, y, offsetX, offsetY, width, height, scale } = e
                    this.core = { x, y, offsetX, offsetY, width, height, scale }
                }
            })
        },
        /**拖拽结束添加节点**/
        onMounte(e) {
            const { instance, recent, current } = this
            const rect = instance.getContainer().getBoundingClientRect()
            const scale = useScale(instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top) / scale
            const node = {
                form: current,
                rules: (current.rules ?? []).map(x => ({ ...x, id: v4() })),
                id: v4(),
                top: top + 'px',
                left: left + 'px'
            }
            this.setColumn({ command: 'CREATE', node }).then(() => {
                /**此处添加连接线**/
                setTimeout(() => {
                    if (recent) {
                        const connect = instance.connect({
                            id: v4(),
                            source: recent.id,
                            target: node.id,
                            uuids: [recent.id, node.id],
                            anchor: ['TopCenter', 'BottomCenter'],
                            endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                        })
                        this.$nextTick(() => {
                            this.setSuspended(null)
                        })
                    }
                }, 16)
            })
        },
        /**节流持续拖拽捕获可连接点位置**/
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
                    const el = document.getElementById(x.id)
                    const a = parseFloat(left) + el.offsetLeft + el.clientWidth / 2 - pageX
                    const b = parseFloat(top) + el.offsetTop + el.clientHeight - pageY
                    return {
                        ...x,
                        el,
                        distance: Math.sqrt(a * a + b * b) // scale
                    }
                })
                .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))

            const recent = rules?.shift()
            if (recent && recent.distance < 250) {
                this.setSuspended(recent)
            } else {
                this.setSuspended(null)
            }
        }, 100),
        /**持续拖拽事件**/
        onDragover(e) {
            e.preventDefault()
            this.onCapture(e)
        },
        /**拖拽捕获连接点**/
        setSuspended(response) {
            this.target = response?.id || null
            this.recent = response
        },
        /**十字交叉线数据维护**/
        async setAxis(axis) {
            return (this.axis = axis)
        },
        /**画布坐标位置数据维护**/
        async setCore(core) {
            this.core = core
            this.instance.pan.moveTo(core.x ?? 0, core.y ?? 0)
            this.instance.pan.zoomTo(0, 0, core.scale ?? 1)
            return this.instance.setZoom(core.scale ?? 1)
        },
        /**连接线数据维护**/
        async setLine(props) {
            if (props.command === 'RELOAD') {
                this.line = props.line ?? []
            } else {
                const n = this.line.findIndex(x => x.id === props.node.id)
                if (props.command === 'CREATE') {
                    this.line.push(props.node)
                } else if (props.command === 'DELETE' && n !== -1) {
                    this.line.splice(n, 1)
                }
            }
            return { props, line: this.line }
        },
        /**节点数据维护**/
        async setColumn(props) {
            if (props.command === 'RELOAD') {
                this.column = props.column ?? []
            } else {
                const n = this.column.findIndex(x => x.id === props.node.id)
                if (props.command === 'CREATE') {
                    this.column.push(props.node)
                } else if (props.command === 'UPDATE' && n !== -1) {
                    this.column.splice(n, 1, props.node)
                } else if (props.command === 'DELETE' && n !== -1) {
                    this.column.splice(n, 1)
                }
            }
            return { props, column: this.column }
        },
        /**组件聚合**/
        initCompose() {
            const { instance, observer, column, line, recent } = this
            if (!instance) {
                return null
            } else {
                return column.map(node => {
                    const props = {
                        instance,
                        observer,
                        recent,
                        node,
                        column,
                        line,
                        delTree: true,
                        setColumn: this.setColumn,
                        setSuspended: this.setSuspended
                    }
                    switch (node.form.type) {
                        case 'MESSAGE':
                            return <Common key={node.id} {...{ props }}></Common>
                        case 'CPU':
                            return <Common key={node.id} {...{ props }}></Common>
                        case 'CLOCK':
                            return <Common key={node.id} {...{ props }}></Common>
                        case 'PRESENT':
                            return <Common key={node.id} {...{ props }}></Common>
                        default:
                            return null
                    }
                })
            }
        }
    },
    watch: {
        target: {
            handler(oldVal, newVal) {
                if (oldVal && !newVal) {
                    this.instance.getEndpoint(oldVal).canvas.classList.add('is-suspended')
                } else if (!oldVal && newVal) {
                    this.instance.getEndpoint(newVal).canvas.classList.remove('is-suspended')
                } else if (oldVal && newVal) {
                    this.instance.getEndpoint(newVal).canvas.classList.remove('is-suspended')
                    this.instance.getEndpoint(oldVal).canvas.classList.add('is-suspended')
                }
            }
        }
    },
    render() {
        const { instance, observer, axis, core, column, line, loading } = this

        return (
            <div class="flowchart" v-loading={this.loading}>
                {this.$scopedSlots.better && (
                    <div class="flowchart-better">
                        {this.$scopedSlots.better?.({ instance, observer, axis, core, column, line, loading })}
                    </div>
                )}
                {this.$scopedSlots.discrete && (
                    <div class="flowchart-discrete">
                        {this.$scopedSlots.discrete?.({ instance, observer, axis, core, column, line, loading })}
                    </div>
                )}
                <div class="flowchart-container" onDragover={this.onDragover} onDrop={this.onMounte}>
                    <div ref="context" id="context">
                        <div
                            class="axis-x"
                            v-show={axis.x}
                            style={{ width: core.width, left: core.offsetX + 'px' }}
                        ></div>
                        <div
                            class="axis-y"
                            v-show={axis.y}
                            style={{ height: core.height, top: core.offsetY + 'px' }}
                        ></div>
                        {this.initCompose()}
                    </div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.flowchart {
    height: 100%;
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
    ::v-deep .el-loading-mask {
        background-color: rgba(255, 255, 255, 1);
    }
    &-container {
        height: 100%;
        ::v-deep {
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
                transform: scale(1.5);
                > svg > * {
                    fill: #ff3d68;
                }
            }
        }
        .jtk-overlay {
            z-index: 6;
            &__label {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #ffffff;
                i {
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
