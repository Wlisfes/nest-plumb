<script>
import { v4 as only } from 'uuid'
import { NAside, NChart, NContainer } from '@/views/common'

const fileURL = path => require('@/assets/image/' + path)

export default {
    name: 'Home',
    components: { NAside, NChart, NContainer },
    data() {
        return {
            current: null,
            multiple: [
                { cover: fileURL('1663727660730.png'), name: '古奥林匹克的赫拉神庙', id: only() },
                { cover: fileURL('1663729982819.png'), empty: true, name: '述说', id: only() },
                { cover: fileURL('1663728520978.png'), name: '奥林匹克-篮球', id: only() },
                { cover: fileURL('1663728531396.png'), name: '奥林匹克-游泳', id: only() },
                { cover: fileURL('1663728536494.png'), name: '奥林匹克-击剑', id: only() },
                { cover: fileURL('1663728542321.png'), name: '奥林匹克-足球', id: only() },
                { cover: fileURL('1663728547283.png'), name: '奥林匹克-体操', id: only() },
                { cover: fileURL('1663728552914.png'), name: '奥林匹克-举重', id: only() },
                { cover: fileURL('1663728557915.png'), name: '奥林匹克-乒乓球', id: only() },
                { cover: fileURL('1663728563798.png'), name: '奥林匹克-射箭', id: only() },
                { cover: fileURL('1663728569332.png'), name: '奥林匹克-排球', id: only() },
                { cover: fileURL('1663728991519.png'), name: '奥林匹克-跳水', id: only() },
                { cover: fileURL('1663728999455.png'), name: '奥林匹克-高尔夫', id: only() },
                { cover: fileURL('1663729006251.png'), name: '奥林匹克-曲棍球', id: only() },
                { cover: fileURL('1663729012847.png'), name: '奥林匹克-网球', id: only() }
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
