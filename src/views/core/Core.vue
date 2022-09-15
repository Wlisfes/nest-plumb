<script>
import { v4 as only } from 'uuid'
import { NodeColumn } from '@/views/core/common'
import { createSuper, initCoreZoom, useScale } from '@/views/core/common/super'
import { Option } from '@/views/core/common/option'

const line = [
    {
        form: '3be2fb6a-6c40-4435-b399-58ac6792e7e4',
        to: 'd6b0dfc3-a934-436e-b4da-3c25cf53760d',
        id: '75fc1a41-7a86-4f78-b259-8bb36bde3555',
        label: '猪头'
    }
]
const column = [
    { left: '200px', top: '130px', id: '3be2fb6a-6c40-4435-b399-58ac6792e7e4' },
    { left: '75px', top: '600px', id: 'd6b0dfc3-a934-436e-b4da-3c25cf53760d' },
    { left: '730px', top: '425px', id: '2379c0cc-6bfd-43a5-992b-12dc8d868299' }
]

export default {
    name: 'Core',
    components: { NodeColumn },
    data() {
        return {
            loading: true,
            multiple: [1, 2, 3, 4, 5, 6, 7, 8],
            node: {
                line: [],
                column: []
            },
            line: { isX: true, isY: true },
            location: { width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20 },

            /******************************************************************/
            instance: null,
            current: null
        }
    },
    mounted() {
        createSuper(Option).then(async instance => {
            this.instance = instance
            await initCoreZoom(instance, {
                onZoom: e => {
                    const { x, y, scale } = e.getTransform()
                    instance.setZoom(scale)
                    this.location.width = (1 / scale) * 100 + '%'
                    this.location.height = (1 / scale) * 100 + '%'
                    this.location.offsetX = -(x / scale)
                    this.location.offsetY = -(y / scale)
                },
                onTransform: e => {
                    const { x, y, scale } = e.getTransform()
                    this.location.width = (1 / scale) * 100 + '%'
                    this.location.height = (1 / scale) * 100 + '%'
                    this.location.offsetX = -(x / scale)
                    this.location.offsetY = -(y / scale)
                }
            })

            instance.ready(async () => {
                await this.fetchNode(instance)

                //完成连线前的校验
                instance.bind('beforeDrop', e => {
                    let res = () => {} //此处可以添加是否创建连接的校验， 返回 false 则不添加；
                    return res
                })

                //连线完毕、维护本地数据
                instance.bind('connection', e => {
                    console.log(e)
                })

                instance.setSuspendDrawing(false, true)
            })
        })
    },
    methods: {
        async fetchNode(instance) {
            await new Promise(resolve => {
                setTimeout(() => {
                    this.node = { line, column }
                    resolve()
                }, 1000)
            })
            for (const e of this.node.line) {
                instance.connect({
                    source: e.form,
                    target: e.to,
                    id: e.id,
                    label: e.label
                })
            }
            return (this.loading = false)
        },
        //拖动左侧菜单节点 start
        onDragstart(e, item) {
            this.current = item
        },
        //拖动左侧菜单节点end、添加新的节点
        onDrop(e) {
            const rect = this.instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale
            const node = {
                id: only(),
                top: Math.round(top / 20) * 20 + 'px',
                left: Math.round(left / 20) * 20 + 'px'
            }
            this.node.column.push(node)
        }
    },
    render() {
        const { node, multiple, line, location } = this

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
                <div
                    class="app-core__container"
                    v-loading={this.loading}
                    onDragover={e => e.preventDefault()}
                    onDrop={this.onDrop}
                >
                    <div ref="context" id="context">
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
                        {this.instance && (
                            <div>
                                {node.column.map(x => (
                                    <node-column id={x.id} key={x.id} node={x} instance={this.instance}></node-column>
                                ))}
                            </div>
                        )}
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
    }

    ::v-deep {
        .jtk-endpoint {
            cursor: crosshair;
        }
        .jtk-connector.is-active {
            path {
                stroke: #150042;
                stroke-width: 1.5;
                animation: stroke;
                animation-duration: 3s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                stroke-dasharray: 5;
                @keyframes stroke {
                    from {
                        stroke-dashoffset: 50;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            }
        }
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
