<script>
import { Better, Zoom, Discrete, Container, createNode, setReload, setDone, setValidator } from '@/bower'
import * as common from './common/data'

export default {
    name: 'Home',
    data() {
        return {
            current: null,
            dataSource: common.better
        }
    },
    methods: {
        onSelecter(e) {
            this.current = e
        },
        onReady(instance) {
            console.log(
                createNode({
                    data: common.better,
                    type: 'BINDTASK',
                    el: instance.mainContainerWrap
                })
            )
            setReload({
                column: createNode({
                    data: common.better,
                    type: 'BINDTASK',
                    el: instance.mainContainerWrap
                })
            }).then(() => {
                setTimeout(() => {
                    setDone(false).then(() => {
                        console.log('加载完成')
                    })
                }, 500)
            })
        },
        /**菜单节点状态判断**/
        isDisable(column, node) {
            switch (node.form) {
                case 'MESSAGE':
                    return column.filter(x => x.props.form === 'MESSAGE').length >= 6
                case 'CPU':
                    return column.filter(x => x.props.form === 'CPU').length >= 6
                case 'CLOCK':
                    return column.filter(x => x.props.form === 'CLOCK').length >= 6
                case 'PRESENT':
                    return column.filter(x => x.props.form === 'PRESENT').length >= 6
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
                switch (node.form.type) {
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
                            ></Discrete>
                        )
                    }}
                ></Container>
            </div>
        )
    }
}
</script>
