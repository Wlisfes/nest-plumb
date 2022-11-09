<script>
import { Better, Container, observer } from '@/bower'
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
            // observer.emit('reload', { column, line })
        }, 2000)
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
        }
    },
    render() {
        return (
            <div class="n-naive" style={{ height: '100%', overflow: 'hidden' }}>
                <Container
                    observer={observer}
                    current-props={this.current}
                    column-props={data.column}
                    line-props={data.line}
                    axis-props={{ x: true, y: true }}
                    core-props={{
                        x: 297.25,
                        y: 125.75,
                        offsetX: -396.3333333333333,
                        offsetY: -167.66666666666666,
                        width: '133.33333333333331%',
                        height: '133.33333333333331%',
                        scale: 0.75
                    }}
                    scopedSlots={{
                        better: ({ column }) => {
                            return (
                                <Better
                                    dataSource={this.dataSource}
                                    onSelecter={this.onSelecter}
                                    isDisable={node => this.isDisable(column, node)}
                                ></Better>
                            )
                        }
                    }}
                ></Container>
            </div>
        )
    }
}
</script>
