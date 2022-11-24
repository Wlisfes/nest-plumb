<script>
import { httpColumnChart } from '@/api/service'

export default {
    name: 'Home',
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
                    label: '工作流封面',
                    prop: 'cover',
                    width: '100px',
                    scopedSlots: {
                        default: scope => (
                            <n-scale max-width={80} style={{ margin: '0 auto' }}>
                                <el-image src={scope.row.cover} fit="cover"></el-image>
                            </n-scale>
                        )
                    }
                },
                { label: '工作流ID', prop: 'uid', minWidth: '150px', showOverflowTooltip: true },
                { label: '工作流标题', prop: 'title', minWidth: '150px' },
                { label: '工作流类型', prop: 'type', minWidth: '120px', align: 'center' },
                {
                    label: '节点状态',
                    width: '120px',
                    align: 'center',
                    scopedSlots: { default: scope => <n-auto value={scope.row.status}></n-auto> }
                },
                {
                    label: '操作',
                    scopedSlots: {
                        default: scope => {
                            return (
                                <el-button onClick={() => this.$router.push(`/chunk?uid=${scope.row.uid}`)}>
                                    详情
                                </el-button>
                            )
                        }
                    }
                }
            ]
        }
    },
    created() {
        this.fetchColumnChart()
    },
    methods: {
        /**工作流列表**/
        async fetchColumnChart() {
            try {
                this.loading = true
                const { data } = await httpColumnChart({
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
            this.fetchColumnChart()
        }
    },
    render() {
        const { form } = this

        return (
            <el-container direction="vertical">
                <el-form class="el-customize" inline>
                    <el-form-item>
                        <el-button icon="el-icon-plus" type="success">
                            创建工作流
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model={form.type} placeholder="工作流类型"></el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model={form.name} placeholder="工作流名称" clearable>
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
