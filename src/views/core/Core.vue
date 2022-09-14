<script>
import panzoom from 'panzoom'
import { jsPlumb } from 'jsplumb'
import { NodeColumn } from '@/views/core/common'
import * as scope from '@/views/core/common/option'

export default {
    name: 'Core',
    components: { NodeColumn },
    data() {
        return {
            multiple: [1, 2, 3, 4, 5, 6, 7, 8],
            node: {
                line: [
                    { form: 1663165831374, to: 1663165844079, id: 1663165891658 },
                    { form: 1663165844079, to: 1663165854107, id: 1663165928024 }
                ],
                column: [
                    { left: '-195px', top: '655px', id: 1663165831374 },
                    { left: '-125px', top: '310px', id: 1663165844079 },
                    { left: '370px', top: '530px', id: 1663165854107 }
                ]
            },
            scale: {
                line: { isX: false, isY: false },
                location: { width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20 }
            },

            /******************************************************************/
            instance: null,
            current: null
        }
    },
    mounted() {
        this.instance = jsPlumb.getInstance()
        this.$nextTick(() => {
            this.initCore()
        })
    },
    methods: {
        initCore() {
            this.instance.ready(() => {
                // 导入默认配置
                this.instance.importDefaults(scope.jsplumbSetting)

                // 会使整个jsPlumb立即重绘。
                this.instance.setSuspendDrawing(false, true)
            })
            this.initCoreZoom()
        },
        initCoreZoom() {
            const mainContainer = this.instance.getContainer()
            const mainContainerWrap = mainContainer.parentNode
            const pan = panzoom(mainContainer, {
                smoothScroll: false,
                bounds: true,
                autocenter: true,
                zoomDoubleClickSpeed: 1,
                minZoom: 0.5,
                maxZoom: 2,
                beforeWheel: e => {
                    console.log(e)
                },
                beforeMouseDown: e => e.ctrlKey
            })

            this.instance.mainContainerWrap = mainContainerWrap
            this.instance.pan = pan

            // 缩放时设置jsPlumb的缩放比率
            pan.on('zoom', e => {
                const { x, y, scale } = e.getTransform()
                this.instance.setZoom(scale)
                //根据缩放比例，缩放对齐辅助线长度和位置
                this.scale.location = Object.assign(this.scale.location, {
                    width: (1 / scale) * 100 + '%',
                    height: (1 / scale) * 100 + '%',
                    offsetX: -(x / scale),
                    offsetY: -(y / scale)
                })
            })
            pan.on('panend', e => {
                const { x, y, scale } = e.getTransform()
                this.scale.location = Object.assign(this.scale.location, {
                    width: (1 / scale) * 100 + '%',
                    height: (1 / scale) * 100 + '%',
                    offsetX: -(x / scale),
                    offsetY: -(y / scale)
                })
            })

            // 平移时设置鼠标样式
            mainContainerWrap.style.cursor = 'grab'
            mainContainerWrap.addEventListener('mousedown', function wrapMousedown() {
                this.style.cursor = 'grabbing'
                mainContainerWrap.addEventListener('mouseout', function wrapMouseout() {
                    this.style.cursor = 'grab'
                })
            })
            mainContainerWrap.addEventListener('mouseup', function wrapMouseup() {
                this.style.cursor = 'grab'
            })
        },
        useScale() {
            if (this.instance.pan) {
                const { scale } = this.instance.pan.getTransform()
                this.instance.setZoom(scale)
                return scale
            } else {
                const matrix = window.getComputedStyle(this.instance.getContainer()).transform
                const scale = matrix.split(', ')[3] * 1
                this.instance.setZoom(scale)
                return scale
            }
        },
        onDragstart(e, item) {
            this.current = item
        },
        onDrop(e) {
            const rect = this.instance.getContainer().getBoundingClientRect()
            const scale = this.useScale()
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale

            const node = {
                id: Date.now().toString(),
                top: Math.round(top / 20) * 20 + 'px',
                left: Math.round(left / 20) * 20 + 'px'
            }
            //添加新的节点
            this.node.column.push(node)
            this.$nextTick(() => {
                this.instance.makeSource(node.id, scope.jsplumbSourceOptions)
                this.instance.makeTarget(node.id, scope.jsplumbTargetOptions)
                this.draggableNode(node.id)
            })
        },
        draggableNode(nodeId) {
            this.instance.draggable(nodeId, {
                grid: [5, 5],
                drag: params => {
                    //移动节点时，动态显示对齐线
                    let showXLine = false
                    let showYLine = false
                    this.node.column.some(el => {
                        if (el.id !== nodeId && el.left == position[0] + 'px') {
                            this.scale.location.x = position[0] + 60
                            showYLine = true
                        }
                        if (el.id !== nodeId && el.top == position[1] + 'px') {
                            this.scale.location.y = position[1] + 20
                            showXLine = true
                        }
                    })
                    this.scale.line.isX = showXLine
                    this.scale.line.isY = showYLine
                },
                start: () => {},
                stop: params => {
                    this.scale.line.isX = false
                    this.scale.line.isY = false

                    // this.changeNodePosition(nodeId, params.pos)
                }
            })
        },
        //移动节点时，动态显示对齐线
        alignForLine(nodeId, position) {
            let showXLine = false,
                showYLine = false
            this.data.nodeList.some(el => {
                if (el.id !== nodeId && el.left == position[0] + 'px') {
                    this.auxiliaryLinePos.x = position[0] + 60
                    showYLine = true
                }
                if (el.id !== nodeId && el.top == position[1] + 'px') {
                    this.auxiliaryLinePos.y = position[1] + 20
                    showXLine = true
                }
            })
            this.auxiliaryLine.isShowYLine = showYLine
            this.auxiliaryLine.isShowXLine = showXLine
        }
    },
    render() {
        const { node, multiple, scale } = this
        const { line, location } = scale

        return (
            <div class="app-core">
                <div class="app-core__aside">
                    <el-scrollbar>
                        <div class="node-multiple">
                            {multiple.map(x => (
                                <div class="node-matter" key={x} draggable onDragstart={e => this.onDragstart(e, x)}>
                                    {x}
                                </div>
                            ))}
                        </div>
                    </el-scrollbar>
                </div>
                <div class="app-core__container">
                    <div ref="context" id="context" onDragover={e => e.preventDefault()} onDrop={this.onDrop}>
                        <div
                            class="scale-line-x"
                            v-show={line.isX}
                            style={{ width: location.width, top: location.y + 'px', left: location.offsetX + 'px' }}
                        ></div>
                        <div
                            class="scale-line-y"
                            v-show={line.isY}
                            style={{ height: location.height, left: location.x + 'px', top: location.offsetY + 'px' }}
                        ></div>

                        {node.column.map(x => (
                            <node-column id={x.id} key={x.id} node={x}></node-column>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.app-core {
    height: 100%;
    display: flex;
    overflow: hidden;
    &:hover {
        cursor: grab;
    }
    &:active {
        cursor: grabbing;
    }
    &__aside {
        width: 220px;
        ::v-deep .el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            .el-scrollbar__view {
                min-height: 100%;
            }
        }
    }
    &__container {
        flex: 1;
        position: relative;
        overflow: hidden;
        outline: none !important;
        background-image: url('~@/assets/point.png');
    }
}

#context {
    position: relative;
    width: 100%;
    height: 100%;
    .scale-line-x,
    .scale-line-y {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
    }
}

.node-multiple {
    position: relative;
    overflow: hidden;
    .node-matter {
        margin: 20px;
        padding: 10px;
        height: 80px;
        border-radius: 6px;
        box-sizing: border-box;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
    }
}
</style>
