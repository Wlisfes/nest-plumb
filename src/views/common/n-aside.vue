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
                        {this.dataColumn.map(x => (
                            <div class="n-multiple__row" key={x.id} draggable onDragstart={e => this.onDragstart(x)}>
                                {`${x.primary}：${x.name}`}
                            </div>
                        ))}
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
            height: 80px;
            border-radius: 6px;
            box-sizing: border-box;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
            &:hover {
                cursor: grab;
            }
            &:active {
                cursor: grabbing;
            }
        }
    }
}
</style>
