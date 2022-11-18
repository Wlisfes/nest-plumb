<script>
export default {
    name: 'NBetter',
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        isDisable: {
            type: Function,
            required: true
        },
        setSuspended: {
            type: Function,
            required: true
        }
    },
    methods: {
        onSelecter(e) {
            this.$emit('selecter', e)
        }
    },
    render() {
        return (
            <div class="n-better" onDragend={e => this.setSuspended(null)}>
                <div class="n-better__scrollbar" onDragend={e => this.setSuspended(null)}>
                    <el-scrollbar>
                        <div>
                            {this.dataSource.map(x => {
                                const isDisable = this.isDisable(x)
                                return (
                                    <div
                                        class={{ 'n-source': true }}
                                        key={x.id}
                                        draggable={!isDisable}
                                        onDragstart={event => this.onSelecter(x, event)}
                                    >
                                        <div class="n-source__icon">
                                            <el-image width={40} src={x.icon} style={{ display: 'block' }}></el-image>
                                        </div>
                                        <div class="n-source__content">{x.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-better {
    position: absolute;
    top: 10%;
    right: 16px;
    width: 120px;
    max-height: 65%;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
    border-radius: 8px;
    background-color: #ffffff;
    z-index: 29;
    display: flex;
    flex-direction: column;
    &__scrollbar {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        ::v-deep .el-scrollbar {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
    }
    .n-source {
        width: 96px;
        height: 96px;
        margin: 12px;
        border-radius: 8px;
        background-color: #f7f7f7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &__icon {
            width: 40px;
            height: 40px;
            margin-bottom: 3px;
        }
        &__content {
            font-size: 14px;
            color: #3f3f44;
            line-height: 20px;
        }
    }
}
</style>
