<script>
import { v4 } from 'uuid'
import { NAside, NChart, NContainer } from '@/views/common'

const STYLE = {
    MESSAGE: { backgroundColor: '#e1f1ff', color: '#75BAF9' },
    CPU: { backgroundColor: '#ffe1e1', color: '#F78C88' },
    CLOCK: { backgroundColor: '#fbf1bd', color: '#EDB342' },
    PRESENT: { backgroundColor: '#e6e0ff', color: '#8E72F7' }
}

export default {
    name: 'Home',
    components: { NAside, NChart, NContainer },
    data() {
        return {
            current: null,
            multiple: [
                {
                    id: v4(),
                    name: '电子邮件',
                    icon: 'el-icon-message',
                    type: 'MESSAGE',
                    style: STYLE.MESSAGE,
                    rules: [{ id: v4(), type: 'info', content: '' }]
                },
                {
                    id: v4(),
                    name: '触发器',
                    icon: 'el-icon-cpu',
                    type: 'CPU',
                    style: STYLE.CPU,
                    rules: [
                        { id: v4(), type: 'danger', content: 'NO' },
                        { id: v4(), type: 'success', content: 'YES' }
                    ]
                },
                {
                    id: v4(),
                    name: '延时',
                    icon: 'el-icon-alarm-clock',
                    type: 'CLOCK',
                    style: STYLE.CLOCK,
                    rules: [{ id: v4(), type: 'info', content: '' }]
                },
                {
                    id: v4(),
                    name: '目标',
                    icon: 'el-icon-present',
                    type: 'PRESENT',
                    style: STYLE.PRESENT
                }
            ]
        }
    },
    methods: {
        onSelecter(e) {
            this.current = e
        }
    },
    render() {
        return (
            <div class="n-naive">
                <n-aside data-column={this.multiple} onSelecter={this.onSelecter}></n-aside>
                <n-container current={this.current}></n-container>
                {/**<n-chart data-column={this.multiple}></n-chart>**/}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-naive {
    height: 100%;
    display: flex;
    overflow: hidden;
}
</style>
