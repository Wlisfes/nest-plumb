<script>
import { mapState } from 'vuex'
import { v4 } from 'uuid'
import { useScale } from '@/core/super'
import { stop, useClientRect } from '@/utils/utils-common'
import { ClickOutside } from '@/utils/utils-click-outside'
import { fetchColumn } from '@/core/hook/fetch-column'
import NSource from '@/core/common/n-source'

export default {
    name: 'NColumn',
    components: { NSource },
    directives: { ClickOutside },
    props: {
        node: Object,
        instance: Object,
        observer: Object
    },
    data() {
        return {
            active: false
        }
    },
    computed: {
        ...mapState({
            axis: state => state.axis,
            core: state => state.core,
            line: state => state.line,
            column: state => state.column
        })
    },
    mounted() {
        this.$nextTick(() => {
            this.initOneBefore()
            this.draggableNode()

            const done = this.observer.on('delete', response => {
                this.fetchSubscribe(response, () => done())
            })
            const fetchDelete = e => e.key === 'Delete' && this.active && this.fetchOneDelete()
            window.addEventListener('keydown', fetchDelete, true)
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('keydown', fetchDelete)
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
        /**设置入口**/
        initOneBefore() {
            const { node, instance } = this
            // //起点
            // instance.makeSource(node.id, {
            //     filter: '.node-column',
            //     maxConnections: 1,
            //     anchor: 'BottomCenter',
            //     endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
            // })
            //终点
            instance.makeTarget(node.id, {
                filter: '.node-column',
                maxConnections: -1,
                anchor: 'TopCenter',
                endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
            })
        },
        /**获取最近的出口点**/
        onRules(element) {
            const { instance, node, column, line } = this
            const scale = useScale(instance)
            const current = useClientRect(element, scale)
            const rules = column
                .filter(x => x.id !== node.id && x.rules.length > 0)
                .reduce((curr, next) => {
                    curr = curr.concat(next.rules)
                    return curr
                }, [])
                .filter(x => {
                    return !line.some(n => n.source === x.id)
                })
                .map(x => {
                    const rect = useClientRect(document.getElementById(x.id))
                    const a = rect.left + rect.width / 2 - (current.left + current.width / 2)
                    const b = rect.top - rect.height - current.top

                    return {
                        ...x,
                        ...rect,
                        distance: Math.sqrt(a * a + b * b) / scale
                    }
                })
                .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
            const option = rules?.shift()

            if (option?.distance < 200) {
                return option
            }
            return null
        },
        /**绑定节点移动事件**/
        draggableNode() {
            const { instance, node, column } = this
            instance.draggable(node.id, {
                grid: [5, 5], //节点移动最小距离
                drag: e => {
                    this.observer.emit('drag', this.onRules(e.el))
                },
                start: e => {},
                stop: e => {
                    //prettier-ignore
                    this.$store.dispatch('setColumn', {
                        command: 'UPDATE',
                        node: Object.assign(node, {
                            left: e.pos[0] + 'px',
                            top: e.pos[1] + 'px'
                        })
                    }).then(() => {
                        //此处添加连接线
                        const rule = this.onRules(e.el)
                        if (rule) {
                            instance.connect({
                                id: v4(),
                                source: rule.id,
                                target: node.id,
                                uuids: [rule.id, node.id],
                                anchor: ['TopCenter', 'BottomCenter'],
                                endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
                            })
                        }
                    })
                }
            })
        },
        /**节点配置**/
        fetchOneColumn() {
            const { node } = this
            fetchColumn({
                ...JSON.parse(JSON.stringify(node)),
                container: document.querySelector('.n-naive')
            }).then(response => {
                response.instance.$once('close', ({ done }) => done())
                response.instance.$once('submit', ({ done, form }) => {
                    //prettier-ignore
                    this.$store.dispatch('setColumn', {
                        command: 'UPDATE',
                        node: Object.assign(node, { content: form.content, rules: form.rules })
                    }).finally(() => done())
                })
            })
        },
        /**监听来自父级的订阅事件**/
        fetchSubscribe(response, done) {
            const { node } = this
            if (response.id === node.id) {
                //来至当前节点的订阅事件
                return false
            } else if (response.target.includes(node.id)) {
                //来自父级的订阅事件
                const bezier = this.instance.getAllConnections()
                //获取当前节点为终点的线条
                const gter = bezier.filter(x => x.targetId === node.id)
                //检查当前节点是否存在多个父级
                const itnc = gter.some(x => x.targetId === node.id && !response.source.includes(x.sourceId))
                if (itnc) {
                    //存在多个父级，不可以删除当前节点，只删除连接线
                    gter.forEach(x => {
                        if (!(x.targetId === node.id && !response.source.includes(x.sourceId))) {
                            this.instance.deleteConnection(x)
                        }
                    })
                } else {
                    //不存在多个父级，可以删除当前节点、连接线
                    bezier.forEach(x => {
                        if (x.targetId === node.id) {
                            this.instance.deleteConnection(x)
                        }
                    })
                    //向子节点发送delete事件
                    this.observer.emit('delete', {
                        id: node.id,
                        source: bezier.filter(x => node.rules.some(k => k.id === x.sourceId)).map(x => x.sourceId),
                        target: bezier.filter(x => node.rules.some(k => k.id === x.sourceId)).map(x => x.targetId)
                    })
                    this.$store.dispatch('setColumn', { command: 'DELETE', node }).then(() => done())
                }
            }
        },
        /**删除节点**/
        fetchOneDelete() {
            const { node, instance, observer } = this
            this.$confirm(
                ` <div>确定要删除<a style="color: red;margin: 0 3px">${node.props.name}</a>吗？</div> `,
                '提示',
                {
                    distinguishCancelAndClose: true,
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                    beforeClose: (action, el, done) => {
                        if (['cancel', 'close'].includes(action)) {
                            return done()
                        }
                        el.confirmButtonLoading = true

                        const bezier = instance.getAllConnections()
                        //删除节点线条
                        bezier.forEach(x => {
                            if (x.targetId === node.id) {
                                instance.deleteConnection(x)
                            }
                        })
                        //向子节点发送delete事件
                        observer.emit('delete', {
                            id: node.id,
                            source: bezier.filter(x => node.rules.some(k => k.id === x.sourceId)).map(x => x.sourceId),
                            target: bezier.filter(x => node.rules.some(k => k.id === x.sourceId)).map(x => x.targetId)
                        })
                        this.$store.dispatch('setColumn', { command: 'DELETE', node }).then(() => {
                            this.$message.success({ message: '删除成功', duration: 1500 })
                            el.confirmButtonLoading = false
                            done()
                        })
                    }
                }
            ).catch(e => {})
        }
    },
    render() {
        const { node, response } = this

        return (
            <div
                ref="node"
                class={{ 'n-column': true, 'is-active': this.active }}
                style={{ top: node.top, left: node.left }}
                onClick={e => this.onSelecter(true)}
                v-click-outside={e => this.onSelecter(false)}
            >
                <div class="node-column">
                    <div class="column-content">
                        <el-image src={node.props.cover} fit="cover"></el-image>
                        <div style={{ flex: 1 }}>
                            <div class="row-matter">
                                <div class="row-matter__name">{node.props.name}</div>
                                {/**<i class="el-icon-setting" title="编辑" onClick={e => stop(e, this.fetchOneColumn)}></i>**/}
                                <i class="el-icon-delete" title="删除" onClick={e => stop(e, this.fetchOneDelete)}></i>
                            </div>
                            <div class="row-content">{node.content ?? '空占位符'}</div>
                        </div>
                    </div>
                    {node.rules.length > 0 && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            {node.rules.map(x => (
                                <n-source
                                    data-parent={node.id}
                                    key={x.id}
                                    id={x.id}
                                    node={x}
                                    observer={this.observer}
                                    instance={this.instance}
                                ></n-source>
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
.n-column {
    position: absolute;
    width: 350px;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    cursor: move;
    display: flex;
    flex-direction: column;
    padding: 16px 18px;
    box-sizing: border-box;
    &.is-active {
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
    }
}

.node-column {
    width: 100%;
    height: 100%;
    position: relative;
    .column-content {
        display: flex;
        overflow: hidden;
        .el-image {
            width: 54px;
            height: 54px;
            display: block;
            margin-right: 10px;
        }
        .row-matter {
            height: 24px;
            display: flex;
            align-items: center;
            &__name {
                flex: 1;
                line-height: 24px;
                margin-right: 20px;
                font-size: 16px;
                color: #3b3d44;
            }
            i {
                font-size: 20px;
                margin-right: 10px;
                cursor: pointer;
                transition: color 300ms;
                &:last-child {
                    margin: 0;
                }
                &.el-icon-setting:hover {
                    color: #409eff;
                }
                &.el-icon-delete:hover {
                    color: #ff0000;
                }
            }
        }
        .row-content {
            font-size: 14px;
            color: #999b9e;
            line-height: 20px;
            margin-top: 10px;
        }
    }
}
</style>
