<script>
import { Better, Zoom, Discrete, Container, createNode, setReload, setDone, setValidator } from '@/core'
import { httpOneChart, httpColumnNode } from '@/api/service'

export default {
    name: 'Chunk',
    data() {
        return {
            current: null,
            dataSource: []
        }
    },
    methods: {
        onSelecter(e) {
            this.current = e
        } /**节点列表**/,
        fetchColumnNode() {
            return new Promise(async resolve => {
                const { data } = await httpColumnNode({ page: 1, size: 10 }).catch(e => resolve(e))
                resolve((this.dataSource = data.list))
            })
        },
        async onReady(instance) {
            try {
                await this.fetchColumnNode()
                const { data } = await httpOneChart({ uid: this.$route.query.uid })
                setReload({
                    core: data.core,
                    axis: data.axis,
                    line: data.line ?? [],
                    column: data.column ?? []
                }).then(() => {
                    setDone(false)
                })
            } catch (e) {}
            // setReload({
            //     column: createNode({
            //         data: this.dataSource,
            //         type: 'BIND_TASK',
            //         locale: 'cn',
            //         el: instance.mainContainerWrap
            //     })
            // }).then(() => {
            //     setTimeout(() => {
            //         setDone(false).then(() => {
            //             console.log('加载完成')
            //         })
            //     }, 500)
            // })
        },
        /**菜单节点状态判断**/
        isDisable(column, node) {
            switch (node.type) {
                case 'MESSAGE':
                    return column.filter(x => x.current.type === 'MESSAGE').length >= 6
                case 'CPU':
                    return column.filter(x => x.current.type === 'CPU').length >= 6
                case 'CLOCK':
                    return column.filter(x => x.current.type === 'CLOCK').length >= 6
                case 'PRESENT':
                    return column.filter(x => x.current.type === 'PRESENT').length >= 6
                default:
                    return false
            }
        },
        /**保存草稿**/
        onConserve() {
            setDone(true).then(() => {
                setTimeout(() => setDone(false), 500)
            })
        },
        /**提交工作流**/
        onSubmit({ column }) {
            column.forEach(node => {
                switch (node.current.type) {
                    case 'MESSAGE':
                        setValidator({ ...node, message: '请完善电子邮件' })
                        break
                    case 'CPU':
                        setValidator({ ...node, message: '请设置触发器' })
                        break
                    case 'CLOCK':
                        setValidator({ ...node, message: '请设置延时' })
                        break
                }
            })
        }
    },
    render() {
        return (
            <div class="n-naive" style={{ height: '100%', overflow: 'hidden' }}>
                <Container
                    current={this.current}
                    onReady={this.onReady}
                    scopedSlots={{
                        zoom: scope => (
                            <Zoom core={scope.core} instance={scope.instance} observer={scope.observer}></Zoom>
                        ),
                        better: scope => (
                            <Better
                                dataSource={this.dataSource}
                                onSelecter={this.onSelecter}
                                setSuspended={scope.setSuspended}
                                isDisable={node => this.isDisable(scope.column, node)}
                            ></Better>
                        ),
                        discrete: scope => (
                            <Discrete
                                loading={scope.loading}
                                onConserve={event => this.onConserve({ event, ...scope })}
                                onSubmit={event => this.onSubmit({ event, ...scope })}
                                style={{
                                    backgroundColor: 'transparent',
                                    transform: 'translateX(-50%)',
                                    left: '50%',
                                    right: 'inherit',
                                    padding: '0 20px'
                                }}
                            ></Discrete>
                        )
                    }}
                ></Container>
            </div>
        )
    }
}
</script>
