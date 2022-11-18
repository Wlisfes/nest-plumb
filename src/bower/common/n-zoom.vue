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
                    <i class="el-icon-back" style={{ fontSize: '20px', marginRight: '3px' }}></i>
                    <div>Back</div>
                </div>
                <div class="n-zoom__scope">
                    <div class="scope-column" onClick={e => stop(e, () => this.onCoreZoom('large'))}>
                        <i class="el-icon-plus" style={{ fontSize: '16px' }}></i>
                    </div>
                    <el-divider direction="horizontal"></el-divider>
                    <div class="scope-column" onClick={e => stop(e, () => this.onCoreZoom('small'))}>
                        <i class="el-icon-minus" style={{ fontSize: '16px' }}></i>
                    </div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-zoom {
    .el-divider {
        margin: 0;
        background-color: #efefef;
    }
    &__back {
        height: 32px;
        display: flex;
        align-items: center;
        background-color: #ffffff;
        font-size: 14px;
        color: #6b6c72;
        padding: 0 8px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        position: absolute;
        top: 16px;
        left: 16px;
        z-index: 29;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
    }
    &__scope {
        width: 32px;
        border-radius: 4px;
        user-select: none;
        position: absolute;
        top: 76px;
        left: 16px;
        z-index: 29;
        background-color: #ffffff;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
        .scope-column {
            width: 32px;
            height: 32px;
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
