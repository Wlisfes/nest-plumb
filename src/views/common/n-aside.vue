<script>
export default {
    name: 'NAside',
    props: {
        dataColumn: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        onDragstart(e) {
            this.$emit('selecter', e)
        }
    },
    render() {
        return (
            <aside class="n-aside">
                <el-scrollbar>
                    <div class="n-multiple">
                        {this.dataColumn.map(x => {
                            return (
                                <div
                                    class="n-multiple__row"
                                    key={x.id}
                                    draggable
                                    onDragstart={e => this.onDragstart(x)}
                                >
                                    <div class="el-icon" style={x.style}>
                                        {x.icon && <i class={x.icon}></i>}
                                    </div>
                                    <div class="el-content">{x.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </el-scrollbar>
            </aside>
        )
    }
}
</script>

<style lang="less" scoped>
.n-aside {
    position: relative;
    width: 200px;
    ::v-deep .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
        .el-scrollbar__view {
            min-height: 100%;
        }
    }

    .n-multiple {
        position: relative;
        overflow: hidden;
        &__row {
            margin: 15px;
            padding: 10px;
            border-radius: 6px;
            box-sizing: border-box;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            &:hover {
                cursor: grab;
            }
            &:active {
                cursor: grabbing;
            }
            .el-icon {
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                margin-right: 10px;
                i {
                    font-size: 20px;
                }
            }
            .el-content {
                flex: 1;
                font-size: 14px;
                color: #686868;
                line-height: 20px;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
    }
}
</style>
