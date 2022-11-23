<script>
export default {
    name: 'NMatic',
    props: {
        node: { type: Object },
        draggable: { type: Boolean }
    },
    render() {
        return (
            <div class="n-common__content">
                <div class="n-matic">
                    <div class="n-matic__notice">将右边的元素拖拽至该营销编辑窗口并将其连接，以创建邮件发送工作流</div>
                    <div class="n-matic__content">
                        <div class="n-label">邮件主题：</div>
                        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                            <div class="n-content">{this.content}</div>
                        </div>
                    </div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-matic {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
    &__content {
        height: 28px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .n-label {
            font-size: 14px;
            color: #6b6c72;
        }
        .n-content {
            font-size: 14px;
            color: #6aa2d5;
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #f7f7f7;
            border-radius: 14px;
            padding: 0 10px;
        }
    }
}
</style>
