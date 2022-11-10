<script>
import { Better, Discrete, Container, observer } from '@/bower'
import * as data from './common/data'

export default {
    name: 'Home',
    data() {
        return {
            current: null,
            dataSource: data.source
        }
    },
    mounted() {
        setTimeout(() => {
            observer.emit('reload', {
                column: data.column,
                line: data.line,
                core: {
                    x: 297.25,
                    y: 125.75,
                    offsetX: -396.3333333333333,
                    offsetY: -167.66666666666666,
                    width: '133.33333333333331%',
                    height: '133.33333333333331%',
                    scale: 0.75
                }
            })
        })
    },
    methods: {
        onSelecter(e) {
            this.current = e
        },
        /**菜单节点状态判断**/
        isDisable(column, node) {
            switch (node.type) {
                case 'MESSAGE':
                    return column.filter(x => x.props.type === 'MESSAGE').length >= 6
                case 'CPU':
                    return column.filter(x => x.props.type === 'CPU').length >= 6
                case 'CLOCK':
                    return column.filter(x => x.props.type === 'CLOCK').length >= 6
                case 'PRESENT':
                    return column.filter(x => x.props.type === 'PRESENT').length >= 6
                default:
                    return false
            }
        },
        /**保存草稿**/
        onConserve() {},
        /**提交工作流**/
        onSubmit({ observer, column }) {
            column.forEach(node => {
                switch (node.props.type) {
                    case 'MESSAGE':
                        observer.emit('validator', node)
                        break
                }
            })
        }
    },
    render() {
        return (
            <div class="n-naive" style={{ height: '100%', overflow: 'hidden' }}>
                <Container
                    observer={observer}
                    current-props={this.current}
                    axis-props={{ x: true, y: true }}
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
