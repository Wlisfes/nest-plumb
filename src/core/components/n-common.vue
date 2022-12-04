<script>
import { v4 } from 'uuid'
import { createConnect } from '../super'
import { ClickOutside } from '../utils/utils-click-outside'
import { throttle } from '../utils/utils-common'
import { command, setDelete } from '../utils/utils-store'
import { fetchTooltip } from '../hook/fetch-tooltip'
import { httpUpdateColumn } from '@/api/service'

export default {
    name: 'NCommon',
    directives: { ClickOutside },
    props: {
        node: { type: Object },
        instance: { type: Object },
        observer: { type: Object },
        recent: { type: Object },
        delTree: { type: Boolean, default: false },
        column: { type: Array, default: () => [] },
        line: { type: Array, default: () => [] },
        setColumn: { type: Function, required: true },
        setSuspended: { type: Function, required: true }
    },
    computed: {
        isStence() {
            return (this.node.rules ?? []).some(x => !!x.visible)
        }
    },
    data() {
        return {
            active: false,
            draggable: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initOneAfter()
            this.initOneBefore()
            this.draggableNode()

            const uninstall = [
                /**订阅删除事件**/
                this.observer.on(command.delete, ({ props, done }) => {
                    this.fetchSubscribe(props)
                    done()
                }),
                /**销毁节点**/
                () => {
                    this.instance.removeAllEndpoints(this.node.uid)
                }
            ]
            this.$once('hook:beforeDestroy', () => {
                uninstall.map(fn => fn())
            })
        })
    },
    methods: {
        onSelecter(active) {
            this.active = active
            this.inConnect(active)
        },
        onChnage(active) {
            this.active = active
        },
        /**切换连接线状态**/
        inConnect(active) {
            const { node, instance } = this
            const rules = node.rules.map(x => x.uid)
            const bezier = instance.getAllConnections()
            bezier.forEach(x => {
                if (x.targetId === node.uid || rules.includes(x.sourceId)) {
                    if (active) {
                        x.canvas.classList.add('is-active')
                    } else {
                        x.canvas.classList.remove('is-active')
                    }
                }
            })
        },
        /**设置起点**/
        initOneAfter() {
            const { node, instance } = this
            if (node.rules?.length === 0) {
                /**当前节点禁止添加起点标志**/
                return false
            } else {
                node.rules.forEach(x => {
                    const el = document.getElementById(x.uid)
                    const offsetLeft = el.offsetLeft + el.clientWidth / 2
                    const offsetTop = el.offsetTop + el.clientHeight
                    instance.addEndpoint(node.uid, {
                        uuid: x.uid,
                        anchor: [0, 0, 0, 1, offsetLeft, offsetTop],
                        isSource: true,
                        maxConnections: x.max ?? 1,
                        cssClass: 'is-source',
                        endpoint: ['Dot', { radius: 6 }],
                        endpointStyle: { fill: '#FFFFFF', strokeWidth: 2, stroke: '#DBDBDB' },
                        connectorStyle: { stroke: '#DBDBDB', strokeWidth: 2 }
                    })
                })
            }
        },
        /**设置终点**/
        initOneBefore() {
            const { node, instance } = this
            if (node.current?.max === 0) {
                /**当前节点禁止添加终点标志**/
                return false
            } else {
                const el = document.getElementById(node.uid)
                instance.addEndpoint(node.uid, {
                    uuid: node.uid,
                    anchor: [0, 0, 0, -1, el.clientWidth / 2, -22],
                    isTarget: true,
                    maxConnections: node.current.max ?? -1,
                    cssClass: 'is-target',
                    endpoint: ['Dot', { radius: 6 }],
                    endpointStyle: { fill: '#FFFFFF', strokeWidth: 2, stroke: '#DBDBDB' }
                })
            }
        },
        /**绑定节点移动事件**/
        draggableNode() {
            const { instance, node, column, line } = this
            if (node.root) {
                /**顶层节点禁止拖拽**/
                return false
            } else {
                instance.draggable(node.uid, {
                    grid: [5, 5], //节点移动最小距离
                    start: e => {},
                    drag: throttle(e => {
                        /**根据条件筛选出可连接node节点的rules规则**/
                        const rules = column
                            .filter(x => {
                                if (
                                    node.current.max === 0 ||
                                    x.uid === node.uid ||
                                    !node.current.connect.includes(x.current.type)
                                ) {
                                    /**
                                     * 1:当前node节点禁止连接
                                     * 2:当前排除当前node节点
                                     * 3:上层节点禁止与当前node节点建立连接
                                     */
                                    return false
                                } else {
                                    if (x.rules?.length === 0) {
                                        /**上层节点没有起点规则**/
                                        return false
                                    } else if (line.some(n => n.target === node.uid)) {
                                        /**当前node节点已经与某一个节点建立连接**/
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
                                        const total = line.filter(n => n.source === x.uid)?.length ?? 0
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
                                    const el = document.getElementById(x.uid)
                                    //prettier-ignore
                                    const a = parseFloat(left) + el.offsetLeft + el.clientWidth / 2 - (e.pos[0] + e.el.clientWidth / 2)
                                    const b = parseFloat(top) + el.offsetTop + el.clientHeight - e.pos[1]
                                    return {
                                        ...x,
                                        el,
                                        distance: Math.sqrt(a * a + b * b)
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
                    stop: e => {
                        /**拖动结束维护当前节点数据**/
                        this.setColumn({
                            command: 'UPDATE',
                            node: { ...node, left: e.pos[0] + 'px', top: e.pos[1] + 'px' }
                        }).then(async () => {
                            await httpUpdateColumn({
                                uid: node.uid,
                                left: e.pos[0] + 'px',
                                top: e.pos[1] + 'px'
                            }).catch(e => {})

                            if (this.recent) {
                                const { done } = await createConnect(instance, {
                                    uid: v4(),
                                    source: this.recent.uid,
                                    target: node.uid
                                })
                                await done()
                                this.setSuspended(null)
                            }
                        })
                    }
                })
            }
        },
        /**删除节点**/
        fetchOneDelete(e) {
            const { node, instance, line, delTree } = this
            fetchTooltip({
                left: e.target.offsetLeft + e.target.clientWidth / 2,
                top: e.target.offsetTop + 10,
                message: (
                    <div style={{ whiteSpace: 'nowrap' }}>
                        确定要删除<a style="color: red;margin: 0 3px">{node.form.name}</a>吗？
                    </div>
                ),
                close: true,
                container: this.$refs.node
            }).then(response => {
                response.instance.$once('close', ({ done }) => done())
                response.instance.$once('submit', ({ done, setState }) => {
                    setState(true)
                    setTimeout(() => {
                        if (delTree) {
                            /**开启删除树**/
                            setDelete({
                                target: node.uid,
                                column: line.filter(x => x.parent === node.uid).map(x => x.target)
                            }).then(() => {
                                instance.remove(node.uid)
                                this.setColumn({ command: 'DELETE', node }).then(() => {
                                    this.$message.success({ message: '删除成功', duration: 1500 })
                                    done()
                                })
                            })
                        } else {
                            instance.remove(node.uid)
                            this.setColumn({ command: 'DELETE', node }).then(() => {
                                this.$message.success({ message: '删除成功', duration: 1500 })
                                done()
                            })
                        }
                    }, 300)
                })
            })
        },
        /**监听来自父级的订阅事件**/
        fetchSubscribe(response) {
            const { node, instance, line } = this
            if (response.target === node.uid) {
                /**来至当前节点的订阅事件**/
                return false
            } else if (response.column.includes(node.uid)) {
                /**来自父级的订阅事件**/
                const connect = line.some(x => x.target === node.uid && x.parent !== response.target)
                if (!connect) {
                    /**不存在多个父级，可以删除当前节点**/
                    setDelete({
                        target: node.uid,
                        column: line.filter(x => x.parent === node.uid).map(x => x.target)
                    })
                    setTimeout(() => {
                        instance.remove(node.uid)
                        this.setColumn({ command: 'DELETE', node })
                    }, 16)
                }
            }
        }
    },
    render() {
        const { node, draggable } = this

        const __SOURCE__VNode__ = (
            <div class={{ 'n-rules': true }} style={{ paddingTop: this.isStence ? '12px' : '0px' }}>
                {node.rules?.map(x => (
                    <div
                        class={{ 'n-rules__source': true }}
                        style={{ opacity: x.visible ? 1 : 0, paddingBottom: this.isStence ? '16px' : '0px' }}
                        key={x.uid}
                        id={x.uid}
                    >
                        <div class="n-rules__content">{x.content}</div>
                    </div>
                ))}
            </div>
        )

        return (
            <div ref="node" id={node.uid} class={{ 'n-common': true }} style={{ top: node.top, left: node.left }}>
                <div class="n-context">
                    <div class="n-bower">
                        <div class="n-bower__icon">
                            <el-image width={33} src={node.current.icon} style={{ display: 'block' }}></el-image>
                        </div>
                        <div class="n-bower__title">{node.current.name}</div>
                    </div>
                    {this.$scopedSlots.content?.({ __SOURCE__VNode__, draggable })}
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-common {
    position: absolute;
    .n-context {
        width: 330px;
        position: relative;
        background-color: #ffffff;
        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
        transition: filter 300ms;
        border-radius: 8px;
        box-sizing: border-box;
        transform: translate3d(0, 0, 0);
        z-index: 5;
        &:hover {
            filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
        }
        &.is-active {
            filter: drop-shadow(0 0 5px rgba(13, 76, 237, 0.5));
        }
    }
    &__content {
        padding-top: 32px;
    }
    .n-bower {
        position: absolute;
        top: -22px;
        left: 50%;
        transform: translateX(-50%);
        height: 44px;
        background-color: #ffffff;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 6px;
        padding-right: 10px;
        &__icon {
            width: 32px;
            height: 32px;
        }
        &__title {
            font-size: 14px;
            color: #3f3f44;
            line-height: 20px;
            margin-left: 10px;
        }
    }
    .n-rules {
        min-height: 20px;
        padding: 0 12px;
        display: flex;
        justify-content: space-around;
        &__source {
            min-width: 24px;
            max-width: 50%;
            padding: 0 10px;
            user-select: none;
            overflow: hidden;
        }
        &__content {
            font-size: 14px;
            color: #3f3f44;
            height: 20px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
