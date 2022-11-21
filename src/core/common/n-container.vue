<script>
import { v4 } from 'uuid'
import { Option } from '../option'
import { createSuper, createCoreZoom, createBatchConnect, createConnect, useScale } from '../super'
import { command } from '../utils/utils-store'
import { observer } from '../utils/utils-observer'
import { throttle, isConnect, startConnect, endConnect } from '../utils/utils-common'
import { fetchTooltip } from '../hook/fetch-tooltip'
import { Common, Scence, Email, Trigger } from '../components'

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
                        await this.setAxis(props.axis ?? this.axis)
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
                        return startConnect({ e, column: this.column, line: this.line, instance: this.instance })
                    })

                    /**结束连线**/
                    instance.bind('connectionDragStop', e => {
                        return endConnect({ column: this.column, instance: this.instance })
                    })

                    /**两个端点完成连线前的校验**/
                    instance.bind('beforeDrop', e => {
                        const message = isConnect({
                            e,
                            column: this.column,
                            line: this.line,
                            instance: this.instance,
                            observer: this.observer
                        })
                        if (message) {
                            this.$message.error(message)
                            return false
                        }
                        return true
                    })

                    /**连线完毕、维护本地数据**/
                    instance.bind('connection', e => {
                        // const node = this.column.find(x => x.id === e.sourceId)
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
                            e.connection.canvas?.setAttribute('id', props.node.id)
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
                            message: (
                                <div style={{ whiteSpace: 'nowrap' }}>
                                    确定要删除<a style="color: red;margin: 0 3px">连接</a>吗？
                                </div>
                            ),
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
                onPanstart: e => this.setAxis({ x: true, y: true }),
                onPanend: e => this.setAxis({ x: false, y: false }),
                onZoom: ({ x, y, offsetX, offsetY, width, height, scale }) => {
                    this.setCore({ x, y, offsetX, offsetY, width, height, scale })
                },
                onTransform: ({ x, y, offsetX, offsetY, width, height, scale }) => {
                    this.setCore({ x, y, offsetX, offsetY, width, height, scale })
                }
            })
        },
        /**拖拽结束添加节点**/
        onMounte(e) {
            const { instance, current } = this
            const rect = instance.getContainer().getBoundingClientRect()
            const scale = useScale(instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top) / scale
            const node = {
                current,
                rules: (current.rules ?? []).map(x => ({ ...x, id: v4() })),
                id: v4(),
                top: top + 'px',
                left: left + 'px'
            }
            this.setColumn({ command: 'CREATE', node }).then(async () => {
                if (this.recent) {
                    const { done } = await createConnect(instance, {
                        id: v4(),
                        source: this.recent.id,
                        target: node.id
                    })
                    await done()
                    this.setSuspended(null)
                }
            })
        },
        /**节流持续拖拽捕获可连接点位置**/
        onCapture: throttle(function (e) {
            const { instance, current, column, line } = this
            const rect = instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const pageX = (e.pageX - rect.left - 60) / scale
            const pageY = (e.pageY - rect.top - 20) / scale

            /**根据条件筛选出可连接node节点的rules规则**/
            const rules = column
                .filter(x => {
                    if (current.max === 0 || !current.connect.includes(x.current.type)) {
                        /**
                         * 1:当前node节点禁止连接
                         * 3:上层节点禁止与当前node节点建立连接
                         */
                        return false
                    } else {
                        if (x.rules?.length === 0) {
                            /**上层节点没有起点规则**/
                            return false
                        }
                    }
                    return true
                })
                .reduce((c, n) => c.concat(n.rules.map(x => ({ ...x, parent: n }))), [])

            if (rules?.length > 0) {
                /**筛选可连接的Endpoint**/
                const connect = rules
                    .filter(x => {
                        if (x.max === 0) {
                            /**当前Endpoint禁止连接**/
                            return false
                        } else if (x.max === -1) {
                            /**1:当前Endpoint可以无限连接**/
                            return true
                        } else {
                            /**获取以当前Endpoint为起点的连接线**/
                            const total = line.filter(n => n.source === x.id)?.length ?? 0
                            if (total >= x.max) {
                                /**当前Endpoint连接数量不足**/
                                return false
                            } else {
                                return true
                            }
                        }
                    })
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

                const recent = connect[0] ?? null
                if (recent?.distance < 250) {
                    this.setSuspended(recent)
                } else {
                    this.setSuspended(null)
                }
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
        async setCore(core, reload) {
            this.core = core
            if (reload) {
                this.instance.pan.moveTo(core.x ?? 0, core.y ?? 0)
                this.instance.pan.zoomTo(0, 0, core.scale ?? 1)
            }
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
                    switch (node.current.type) {
                        case 'BINDTASK':
                            return (
                                <Common key={node.id} {...{ props }}>
                                    <Scence {...{ props }}></Scence>
                                </Common>
                            )
                        case 'MESSAGE':
                            return (
                                <Common key={node.id} {...{ props }}>
                                    <Email {...{ props }}></Email>
                                </Common>
                            )
                        case 'CPU':
                            return (
                                <Common key={node.id} {...{ props }}>
                                    <Trigger {...{ props }}></Trigger>
                                </Common>
                            )
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
        const { instance, observer, axis, core, column, line, loading, setSuspended } = this

        return (
            <div class="flowchart" v-loading={this.loading}>
                {this.$scopedSlots.zoom?.({ instance, observer, axis, core, column, line, loading })}
                {this.$scopedSlots.better?.({ instance, observer, axis, core, column, line, loading, setSuspended })}
                {this.$scopedSlots.discrete?.({ instance, observer, axis, core, column, line, loading })}

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
