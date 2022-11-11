<script>
import { Better, Discrete, Container, setReload, setDone, setValidator } from '@/bower'
import * as data from './common/data'

export default {
    name: 'Home',
    data() {
        return {
            current: null,
            dataSource: data.source
        }
    },
    methods: {
        onSelecter(e) {
            this.current = e
        },
        onReady() {
            setReload({
                // column: data.column,
                // line: data.line,
                // axis: { x: false, y: false },
                // core: {
                //     x: 358.1875,
                //     y: 38.5625,
                //     offsetX: -477.5833333333333,
                //     offsetY: -51.416666666666664,
                //     width: '133.33333333333331%',
                //     height: '133.33333333333331%',
                //     scale: 0.75
                // }
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
                        better: scope => (
                            <Better
                                dataSource={this.dataSource}
                                onSelecter={this.onSelecter}
                                isDisable={node => this.isDisable(scope.column, node)}
                                style={{ height: '320px', position: 'absolute', top: 0, zIndex: 29 }}
                            ></Better>
                        ),
                        discrete: scope => (
                            <Discrete
                                loading={scope.loading}
                                onConserve={event => this.onConserve({ event, ...scope })}
                                onSubmit={event => this.onSubmit({ event, ...scope })}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    zIndex: 29,
                                    transform: 'translateX(-50%)'
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
