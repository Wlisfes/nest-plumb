<script>
import { v4 as only } from 'uuid'
import ClickOutside from 'vue-click-outside'

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
            column: Array.from({ length: 3 }, x => only())
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
        onSelecter(e) {
            this.active = e.target.id === this.node.id
        },

        /**设置入口**/
        initOneBefore() {
            const { node, instance } = this
            instance.addEndpoint(
                node.id,
                { anchors: 'Top', cssClass: node.id, uuid: node.id },
                { isSource: true, isTarget: true, maxConnections: -1 }
            )
        },
        /**设置出口**/
        initOneAfter() {
            const { column, instance } = this
            column.forEach(id => {
                instance.addEndpoint(
                    id,
                    { anchors: 'Bottom', cssClass: id, uuid: id },
                    { isSource: true, isTarget: true, maxConnections: 1 }
                )
            })
        },
        /**绑定节点移动事件**/
        draggableNode() {
            this.instance.draggable(this.node.id, {
                grid: [5, 5], //节点移动最小距离
                drag: e => {
                    //拖动中
                    // console.log(e)
                    // this.$emit('node-drag')
                },
                start: e => {
                    //拖动开始
                    console.log('拖动开始', e)
                },
                stop: e => {
                    //拖动结束
                    console.log(e)
                }
            })
        }
    },
    render() {
        const { node, column } = this

        return (
            <div
                ref="node"
                class={{ 'node-column': true, 'is-active': this.active }}
                style={{ top: node.top, left: node.left }}
                onClick={this.onSelecter}
                v-click-outside={this.onSelecter}
            >
                {column.map((x, i) => (
                    <el-button key={x} id={x}>
                        {i}
                    </el-button>
                ))}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.node-column {
    position: absolute;
    height: 120px;
    width: 350px;
    border-radius: 6px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: center;
    &.is-active {
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
    }
}
</style>
