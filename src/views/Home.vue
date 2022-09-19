<script>
import { v4 as only } from 'uuid'
import { NAside, NChart, NContainer } from '@/views/common'

export default {
    name: 'Home',
    components: { NAside, NChart, NContainer },
    data() {
        return {
            current: null,
            multiple: [
                { primary: 'M-1', name: '身份核实', id: only() },
                { primary: 'M-2', name: '证件号码确认', id: only() }
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
