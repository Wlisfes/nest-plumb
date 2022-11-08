<script>
export default {
    name: 'NBetter',
    props: {
        width: {
            type: String,
            default: '200px'
        },
        dataSource: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        onSelecter(e) {
            this.$emit('selecter', e)
        }
    },
    render() {
        return (
            <div class="n-better" style={{ width: this.width }}>
                <el-scrollbar>
                    <div class="n-scrollbar">
                        {this.dataSource.map(x => {
                            return (
                                <div class="n-source" key={x.id} draggable onDragstart={e => this.onSelecter(x, e)}>
                                    <div class="n-source__icon" style={x.style}>
                                        {x.icon && <i class={x.icon}></i>}
                                    </div>
                                    <div class="n-source__content">{x.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </el-scrollbar>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-better {
    position: relative;
    ::v-deep .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
        .el-scrollbar__view {
            min-height: 100%;
        }
    }
    .n-scrollbar {
        position: relative;
        overflow: hidden;
    }
    .n-source {
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
        &__icon {
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
        &__content {
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
</style>
