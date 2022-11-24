<script>
import { fetchSource } from '@/fetch/fetch-source'
import { httpColumnNode } from '@/api/service'

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
            dataSource: [],
            dataColumn: [
                {
                    label: '节点图标',
                    width: '100px',
                    align: 'center',
                    scopedSlots: {
                        default: scope => (
                            <n-scale scale={1} max-width={40} style={{ margin: '0 auto' }}>
                                <el-image src={scope.row.icon} fit="cover"></el-image>
                            </n-scale>
                        )
                    }
                },
                { label: '节点名称', prop: 'name', minWidth: '150px' },
                { label: '节点类型', prop: 'type', minWidth: '120px', align: 'center' },
                {
                    label: '节点层级',
                    prop: 'root',
                    minWidth: '120px',
                    align: 'center',
                    scopedSlots: {
                        default: scope => (
                            <n-column
                                data-column={[
                                    { label: '顶层节点', value: 1 },
                                    { label: '普通节点', value: 0 }
                                ]}
                                value={scope.row.root}
                            ></n-column>
                        )
                    }
                },
                { label: '节点可连接类型', prop: 'connect', minWidth: '130px', align: 'center' },
                { label: '节点MAX连接数', prop: 'max', minWidth: '130px', align: 'center' },
                {
                    label: '节点状态',
                    width: '120px',
                    align: 'center',
                    scopedSlots: { default: scope => <n-auto value={scope.row.status}></n-auto> }
                },
                { label: '操作' }
            ]
        }
    },
    created() {
        this.fetchColumnNode()
    },
    methods: {
        /**节点列表**/
        async fetchColumnNode() {
            try {
                this.loading = true
                const { data } = await httpColumnNode({
                    page: this.page,
                    size: this.size
                })
                this.dataSource = data.list ?? []
                this.total = data.total
                this.loading = false
            } catch (e) {
                this.loading = false
            }
        },
        fetchUpdate() {
            this.fetchColumnNode()
        },
        fetchOneSource() {
            fetchSource().then(response => {
                response.instance.$once('close', ({ done }) => done())
                response.instance.$once('submit', ({ done }) => {
                    this.fetchUpdate()
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
                            <el-button slot="append" icon="el-icon-search" onClick={this.fetchUpdate}></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-container direction="vertical" style={{ padding: '15px' }}>
                    <el-table stripe data={this.dataSource} v-loading={this.loading}>
                        {this.dataColumn.map(props => (
                            <el-table-column
                                key={props.id}
                                {...{ props, scopedSlots: props.scopedSlots }}
                            ></el-table-column>
                        ))}
                    </el-table>
                </el-container>
            </el-container>
        )
    }
}
</script>
