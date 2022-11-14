<script>
import { v4 } from 'uuid'
import { ClickOutside } from '../utils/utils-click-outside'
import { stop, throttle } from '../utils/utils-common'
import { command, setDelete } from '../utils/utils-store'
import { fetchTooltip } from '../hook/fetch-tooltip'
import { fetchNotice } from '../hook/fetch-notice'

export default {
    name: 'NCommon',
    directives: { ClickOutside },
    props: {
        node: {
            type: Object
        },
        instance: {
            type: Object
        },
        observer: {
            type: Object
        },
        recent: {
            type: Object
        },
        delTree: {
            type: Boolean,
            default: false
        },
        column: {
            type: Array,
            default: () => []
        },
        line: {
            type: Array,
            default: () => []
        },
        setColumn: {
            type: Function,
            required: true
        },
        setSuspended: {
            type: Function,
            required: true
        }
    },
    computed: {
        isDubbo() {
            return this.node?.rules?.length > 1
        }
    },
    data() {
        return {
            active: false
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
                /**参数验证**/
                this.observer.on(command.validator, ({ node, done }) => {
                    this.fetchValidator(node)
                    done()
                }),
                /**销毁节点**/
                () => {
                    this.instance.removeAllEndpoints(this.node.id)
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
        /**切换连接线状态**/
        inConnect(active) {
            const { node, instance } = this
            const rules = node.rules.map(x => x.id)
            const bezier = instance.getAllConnections()
            bezier.forEach(x => {
                if (x.targetId === node.id || rules.includes(x.sourceId)) {
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
            node.rules?.forEach(x => {
                const el = document.getElementById(x.id)
                const offsetLeft = el.offsetLeft + el.clientWidth / 2
                const offsetTop = el.offsetTop + el.clientHeight
                instance.addEndpoint(node.id, {
                    uuid: x.id,
                    anchor: [0, 0, 0, 1, offsetLeft, offsetTop],
                    isSource: true,
                    maxConnections: x.max ?? 1,
                    cssClass: 'is-source',
                    endpoint: ['Dot', { radius: 12 }],
                    endpointStyle: { fill: '#dbdbdb' },
                    connectorStyle: { stroke: '#dbdbdb', strokeWidth: 4 }
                })
            })
        },
        /**设置终点**/
        initOneBefore() {
            const { node, instance } = this
            if (node.form.max != 0) {
                //max不等于0才添加终点标志
                const el = document.getElementById(node.id)
                instance.addEndpoint(node.id, {
                    uuid: node.id,
                    anchor: [0, 0, 0, -1, el.clientWidth / 2, 0],
                    isTarget: true,
                    maxConnections: node.form.max ?? -1,
                    cssClass: 'is-target',
                    endpoint: ['Dot', { radius: 12 }],
                    endpointStyle: { fill: node.form.style.backgroundColor }
                })
            }
        },
        /**绑定节点移动事件**/
        draggableNode() {
            const { instance, node, column, line } = this
            instance.draggable(node.id, {
                grid: [5, 5], //节点移动最小距离
                start: e => {},
                drag: throttle(e => {
                    /**根据条件筛选出可连接node节点的rules规则**/
                    const rules = column
                        .filter(x => {
                            if (node.form.max === 0 || x.id === node.id || !node.form.connect.includes(x.form.type)) {
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
                                } else if (line.some(n => n.target === node.id)) {
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
                        node: Object.assign(node, { left: e.pos[0] + 'px', top: e.pos[1] + 'px' })
                    }).then(() => {
                        /**此处添加连接线**/
                        setTimeout(() => {
                            const { recent } = this
                            if (recent) {
                                instance.connect({
                                    id: v4(),
                                    source: recent.id,
                                    target: node.id,
                                    uuids: [recent.id, node.id],
                                    anchor: ['TopCenter', 'BottomCenter'],
                                    endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                                })
                                this.$nextTick(() => this.setSuspended(null))
                            }
                        }, 16)
                    })
                }
            })
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
                                target: node.id,
                                column: line.filter(x => x.parent === node.id).map(x => x.target)
                            }).then(() => {
                                instance.remove(node.id)
                                this.setColumn({ command: 'DELETE', node }).then(() => {
                                    this.$message.success({ message: '删除成功', duration: 1500 })
                                    done()
                                })
                            })
                        } else {
                            instance.remove(node.id)
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
            if (response.target === node.id) {
                /**来至当前节点的订阅事件**/
                return false
            } else if (response.column.includes(node.id)) {
                /**来自父级的订阅事件**/
                const connect = line.some(x => x.target === node.id && x.parent !== response.target)
                if (!connect) {
                    /**不存在多个父级，可以删除当前节点**/
                    setDelete({
                        target: node.id,
                        column: line.filter(x => x.parent === node.id).map(x => x.target)
                    })
                    setTimeout(() => {
                        instance.remove(node.id)
                        this.setColumn({ command: 'DELETE', node })
                    }, 16)
                }
            }
        },
        /**监听参数验证订阅事件**/
        fetchValidator(response) {
            if (response.id === this.node.id) {
                if (this.notice) {
                    /**存在notice表示当前提示组件已经存在**/
                    this.notice.fetchUpdate('猪头').then(() => {
                        setTimeout(() => this.notice.onClose(), 1000)
                    })
                } else {
                    fetchNotice({
                        top: 0,
                        left: this.$refs.node.clientWidth / 2,
                        container: this.$refs.node,
                        message: <div style={{ whiteSpace: 'nowrap', color: '#ff0000' }}>{response.message}</div>
                    }).then(response => {
                        this.notice = response.instance
                        response.instance.$once('close', ({ done }) => {
                            this.notice = undefined
                            done()
                        })
                        response.instance.$once('submit', ({ done }) => {
                            this.notice = undefined
                            done()
                        })
                    })
                }
            }
        }
    },
    render() {
        const { node } = this

        return (
            <div
                ref="node"
                id={node.id}
                class={{ 'fetch-common': true, 'is-active': this.active }}
                style={{ top: node.top, left: node.left }}
                onClick={e => this.onSelecter(true)}
                v-click-outside={e => this.onSelecter(false)}
            >
                <div class="node-common">
                    <div class="node-common__content">
                        <div class="n-icon" style={node.form.style}>
                            {node.form.icon && <i class={node.form.icon}></i>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div class="n-header">
                                <div class="n-header__name">{node.form.name}</div>
                                <i
                                    class="el-icon-delete"
                                    title="删除"
                                    onClick={e => stop(e, () => this.fetchOneDelete(e))}
                                ></i>
                            </div>
                        </div>
                    </div>
                    {this.isDubbo ? (
                        <div class="node-common__dubbo">
                            {node.rules.map(x => (
                                <div class="dubbo-source" key={x.id} id={x.id}>
                                    <div class="dubbo-source__content">{x.content}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div class="node-common__one">
                            {node.rules.map(x => (
                                <div class="one-source" key={x.id} id={x.id}></div>
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
@import url('../less/fetch-common.less');
</style>
