<script>
export default {
    name: 'NScence',
    props: {
        node: {
            type: Object
        }
    },
    render() {
        return (
            <div class="n-scence">
                <div class="n-scence__notice">将右边的元素拖拽至该营销编辑窗口并将其连接，以创建邮件发送工作流</div>
                <div class="n-scence__trigger">
                    <div class="s-label">触发任务：</div>
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                        <div class="s-content">双十一营销活动</div>
                    </div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-scence {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
    &__trigger {
        height: 28px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .s-label {
            font-size: 14px;
            color: #6b6c72;
        }
        .s-content {
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
