<script>
import { v4 as only } from 'uuid'
import { NodeColumn } from '@/views/core/common'
import { Option } from '@/core/option'
import { useState } from '@/core/state'
import { createSuper, initCoreZoom, useScale } from '@/core/super'
const { state, setState } = useState()

export default {
    name: 'Core',
    components: { NodeColumn },
    data() {
        return {
            loading: true,
            instance: null,
            current: null
        }
    },
    mounted() {
        createSuper(Option).then(async instance => {
            this.instance = instance
            await initCoreZoom(instance, {
                x: state.location.x,
                y: state.location.y,
                onZoom: e => {
                    const { x, y, scale } = e.getTransform()
                    instance.setZoom(scale)
                    setState(e => {
                        e.location.x = x
                        e.location.y = y
                        e.location.offsetX = -(x / scale)
                        e.location.offsetY = -(y / scale)
                        e.location.width = (1 / scale) * 100 + '%'
                        e.location.height = (1 / scale) * 100 + '%'
                    })
                },
                onTransform: e => {
                    const { x, y, scale } = e.getTransform()
                    setState(e => {
                        e.location.x = x
                        e.location.y = y
                        e.location.offsetX = -(x / scale)
                        e.location.offsetY = -(y / scale)
                        e.location.width = (1 / scale) * 100 + '%'
                        e.location.height = (1 / scale) * 100 + '%'
                    })
                }
            })

            await this.fetchNode(instance)
            instance.ready(async () => {
                //完成连线前的校验
                instance.bind('beforeDrop', e => {
                    let res = () => {} //此处可以添加是否创建连接的校验， 返回 false 则不添加；
                    return res
                })

                //连线完毕、维护本地数据
                instance.bind('connection', e => {
                    console.log(e)
                    const node = {
                        id: only(),
                        source: e.sourceId,
                        target: e.targetId,
                        label: '猪头'
                    }
                    setState(s => {
                        s.line.push(node)
                    }).then(() => {
                        console.log(state)
                    })
                })

                instance.setSuspendDrawing(false, true)
            })
        })
    },
    methods: {
        async fetchNode(instance) {
            // await new Promise(resolve => {
            //     setTimeout(() => resolve(), 1000)
            // })
            state.line.map(x => instance.connect(x))
            return (this.loading = false)
        },
        //拖动左侧菜单节点 start
        onDragstart(row) {
            this.current = row
        },
        //拖动左侧菜单节点end、添加新的节点
        onDrop(e) {
            const rect = this.instance.getContainer().getBoundingClientRect()
            const scale = useScale(this.instance)
            const left = (e.pageX - rect.left - 60) / scale
            const top = (e.pageY - rect.top - 20) / scale
            const node = {
                ...this.current,
                id: only(),
                top: Math.round(top / 20) * 20 + 'px',
                left: Math.round(left / 20) * 20 + 'px'
            }

            setState(e => e.column.push(node))
        },
        /**节点拖动结束**/
        nodeStop(e) {
            setState(s => {
                const node = s.column.find(x => x.id === e.el.id)
                node.left = e.pos[0] + 'px'
                node.top = e.pos[1] + 'px'
            })
        },
        /**删除节点**/
        nodeDelete(e) {
            this.instance.remove(e.id)
            setState(s => {
                s.column = s.column.filter(x => x.id !== e.id)
            })
        },
        /**节点设置**/
        nodeSubmit(e) {
            setState(s => {
                const node = s.column.find(x => x.id === e.node.id)
                node.content = e.form.content
                node.line = e.form.line
            })
        }
    },
    render() {
        const { column, multiple, axis, location } = state
        const styleX = { width: location.width, left: location.offsetX + 'px' }
        const styleY = { height: location.height, top: location.offsetY + 'px' }

        return (
            <div class="app-core">
                <div class="app-core__aside">
                    <el-scrollbar>
                        <div class="node-multiple">
                            {multiple.map(x => (
                                <div class="node-matter" key={x.id} draggable onDragstart={e => this.onDragstart(x)}>
                                    {`${x.primary}：${x.name}`}
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
                    <div ref="context" id="context" style={{ transformOrigin: '100px 100px 0' }}>
                        <div class="axis-x" v-show={axis.x} style={styleX}></div>
                        <div class="axis-y" v-show={axis.y} style={styleY}></div>
                        {this.instance && (
                            <div>
                                {column.map(x => (
                                    <node-column
                                        id={x.id}
                                        key={x.id}
                                        node={x}
                                        instance={this.instance}
                                        onNode-stop={this.nodeStop}
                                        onNode-delete={this.nodeDelete}
                                        onNode-submit={this.nodeSubmit}
                                    ></node-column>
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
    .axis-x,
    .axis-y {
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

.form-column {
    background-color: red;
}
</style>
