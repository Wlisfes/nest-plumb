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
                <el-button type="primary" loading={this.loading} onClick={e => this.$emit('conserve', e)}>
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
    padding: 20px;
    .el-button + .el-button {
        margin-left: 20px;
    }
}
</style>
