<script>
export default {
    name: 'Source',
    data() {
        return {
            form: {
                type: undefined,
                name: undefined
            },
            page: 1,
            size: 10,
            total: 0,
            loading: true,
            dataSource: []
        }
    },
    render() {
        const { form } = this

        return (
            <el-container direction="vertical">
                <el-form class="el-customize" inline>
                    <el-form-item>
                        <el-select v-model={form.type} placeholder="节点类型"></el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model={form.name} placeholder="节点名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                        <el-button>重置</el-button>
                    </el-form-item>
                </el-form>
                <el-container direction="vertical" style={{ padding: '15px' }}>
                    <el-table stripe data={this.dataSource}>
                        <el-table-column label="节点名称"></el-table-column>
                        <el-table-column label="节点图标"></el-table-column>
                        <el-table-column label="节点类型"></el-table-column>
                        <el-table-column label="节点MAX连接数"></el-table-column>
                        <el-table-column label="节点可连接类型"></el-table-column>
                        <el-table-column label="节点状态"></el-table-column>
                        <el-table-column label="操作"></el-table-column>
                    </el-table>
                </el-container>
            </el-container>
        )
    }
}
</script>
