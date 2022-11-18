<script>
import { stop } from '../utils/utils-common'

export default {
    name: 'NZoom',
    props: {
        core: { type: Object },
        instance: { type: Object },
        observer: { type: Object }
    },
    computed: {
        scale() {
            return Math.floor((this.core.scale ?? 1) * 100) + '%'
        }
    },
    methods: {
        /**主动缩放**/
        onCoreZoom(command) {
            const { instance } = this
            if (command === 'large') {
                instance.pan.smoothZoom(0, 0, 2)
            } else {
                instance.pan.smoothZoom(0, 0, 0.5)
            }
        }
    },
    render() {
        return (
            <div class="n-zoom">
                <div class="n-zoom__back" onClick={e => stop(e, () => this.$router.back())}>
                    <el-image width={24} src={require('@/assets/images/flowchart-back.png')}></el-image>
                    <div>返回</div>
                </div>
                <div class="n-zoom__scope">
                    <div class="scope-column" onClick={e => stop(e, () => this.onCoreZoom('large'))}>
                        <el-image width={24} src={require('@/assets/images/flowchart-large.png')}></el-image>
                    </div>
                    <el-divider direction="horizontal"></el-divider>
                    <div class="scope-column" onClick={e => stop(e, () => this.onCoreZoom('small'))}>
                        <el-image width={24} src={require('@/assets/images/flowchart-small.png')}></el-image>
                    </div>
                    <el-divider direction="horizontal"></el-divider>
                    <div class="scope-column" style={{ height: '24px' }}>
                        {this.scale}
                    </div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-zoom {
    .el-image {
        width: 24px;
        height: 24px;
        display: block;
    }
    .el-divider {
        margin: 0;
        background-color: #efefef;
    }
    &__back {
        height: 40px;
        display: flex;
        align-items: center;
        background-color: #ffffff;
        font-size: 14px;
        color: #6b6c72;
        padding: 0 12px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        position: absolute;
        top: 16px;
        left: 16px;
        z-index: 29;
    }
    &__scope {
        width: 40px;
        border-radius: 4px;
        user-select: none;
        position: absolute;
        top: 76px;
        left: 16px;
        z-index: 29;
        background-color: #ffffff;
        .scope-column {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            color: #6b6c72;
        }
    }
}
</style>
