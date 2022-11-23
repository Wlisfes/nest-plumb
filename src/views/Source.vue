<script>
import { fetchSource } from '@/fetch/fetch-source'

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
    methods: {
        fetchOneSource() {
            fetchSource().then(response => {
                response.instance.$once('close', ({ done }) => done())
                response.instance.$once('submit', ({ done }) => {
                    done()
                })
            })
        }
    },
    render() {
        const { form } = this

        return (
            <el-container direction="vertical">
                <el-form class="el-customize" inline>
                    <el-form-item>
                        <el-button icon="el-icon-plus" type="success" onClick={this.fetchOneSource}>
                            创建节点
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model={form.type} placeholder="节点类型"></el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model={form.name} placeholder="节点名称" clearable>
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
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
