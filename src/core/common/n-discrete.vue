<script>
export default {
    name: 'NDiscrete',
    props: {
        loading: {
            type: Boolean,
            default: true
        }
    },
    render() {
        return (
            <div class="n-discrete">
                <el-button type="primary" loading={this.loading} onClick={e => this.$emit('save', e)}>
                    保存草稿
                </el-button>
                <el-button type="success" loading={this.loading} onClick={e => this.$emit('submit', e)}>
                    提交工作流
                </el-button>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-discrete {
    height: 72px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f0f0f0;
    z-index: 29;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
        min-width: 175px;
    }
    .el-button + .el-button {
        margin-left: 20px;
    }
}
</style>
