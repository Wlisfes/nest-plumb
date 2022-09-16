<script>
import ClickOutside from 'vue-click-outside'
import { v4 as only } from 'uuid'
import { stop } from '@/core/tools'
import { fetchColumn } from '@/core/hook'

export default {
    name: 'NodeColumn',
    props: {
        node: Object,
        instance: Object
    },
    directives: { ClickOutside },
    data() {
        return {
            active: false,
            column: [],
            line: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initOneBefore()
            this.initOneAfter()
            this.draggableNode()
        })
    },
    methods: {
        onOutside() {
            this.active = false
        },
        onSelecter(e) {
            const { node } = this
            const line = this.instance.getAllConnections()
            this.active = true

            // line.forEach(el => {
            // if ([el.targetId, el.sourceId].includes(this.node.id)) {
            //     el.canvas.classList.add('is-active')
            // }
            // if (el.targetId === node.id || el.sourceId === node.id) {
            //     if (active) {
            // el.canvas.classList.add('is-active')
            //     } else {
            //         el.canvas.classList.remove('is-active')
            //     }
            // }

            // console.log(el.canvas)
            // })
        },
        /**设置入口**/
        initOneBefore() {
            const { node, instance } = this
            instance.addEndpoint(
                node.id,
                { anchors: 'Top', cssClass: node.id, uuid: node.id },
                { isSource: false, isTarget: true, maxConnections: -1 }
            )
        },
        /**设置出口**/
        initOneAfter() {
            const { node, instance } = this
            ;(node.line ?? []).forEach(e => {
                instance.addEndpoint(
                    e.id,
                    {
                        anchors: 'Bottom',
                        paintStyle: {
                            fill: 'rgba(0,0,0,0)'
                        }
                    },
                    { isSource: true, isTarget: false, maxConnections: 1 }
                )
            })
        },
        /**绑定节点移动事件**/
        draggableNode() {
            this.instance.draggable(this.node.id, {
                grid: [5, 5], //节点移动最小距离
                drag: e => this.$emit('node-drag', e),
                start: e => this.$emit('node-start', e),
                stop: e => this.$emit('node-stop', e)
            })
        },
        /**删除节点**/
        async fetchRowDelete() {
            try {
                await this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                })
                this.$emit('node-delete', this.node)
            } catch (e) {}
        },
        /**节点配置**/
        fetchRowColumn() {
            fetchColumn({ ...this.node, container: document.querySelector('.app-core') }).then(({ instance }) => {
                instance.$once('close', ({ done }) => done())
                instance.$once('submit', ({ done, form }) => {
                    this.$emit('node-submit', { node: this.node, form })
                    done()
                })
            })
        }
    },
    render() {
        const { node } = this

        return (
            <div
                ref="node"
                class={{ 'node-container': true, 'is-active': this.active }}
                style={{ top: node.top, left: node.left }}
                onClick={this.onSelecter}
                v-click-outside={this.onOutside}
            >
                <div class="node-column">
                    <div class="row-matter">
                        <div class="row-matter__name">{`${node.primary}：${node.name}`}</div>
                        <i class="el-icon-setting" title="编辑" onClick={e => stop(e, this.fetchRowColumn)}></i>
                        <i class="el-icon-delete" title="删除" onClick={e => stop(e, this.fetchRowDelete)}></i>
                    </div>
                    <div class="row-content">{node.content ?? '空占位符'}</div>
                    {node.line?.length > 0 && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            {node.line.map(x => (
                                <el-tag key={x.id} id={x.id} type={x.type} size="medium" style={{ margin: '0 5px' }}>
                                    {x.content}
                                </el-tag>
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
.node-container {
    position: absolute;
    min-height: 120px;
    width: 350px;
    border-radius: 6px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    cursor: move;
    display: flex;
    flex-direction: column;
    padding: 16px 18px;
    box-sizing: border-box;
    &.is-active {
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
    }
}
.node-column {
    width: 100%;
    height: 100%;
    position: relative;
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
</style>
