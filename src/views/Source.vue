<script>
export default {
    name: 'Source',
    data() {
        return {
            form: {
                type: undefined,
                name: undefined
            }
        }
    },
    render() {
        const { form } = this

        return (
            <el-container direction="vertical" style={{ padding: '15px' }}>
                <el-form inline>
                    <el-form-item>
                        <el-select v-model={form.type} placeholder="节点类型"></el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model={form.name} placeholder="节点名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item style={{ flex: 1 }}></el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                        <el-button>重置</el-button>
                    </el-form-item>
                </el-form>
                <el-container direction="vertical" style={{ backgroundColor: '#e0e0e0' }}></el-container>
            </el-container>
        )
    }
}
</script>

<style lang="less" scoped>
.el-form.el-form--inline {
    .el-form-item {
        margin-bottom: 15px;
    }
}
</style>
