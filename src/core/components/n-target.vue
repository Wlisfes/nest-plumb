<script>
export default {
    name: 'NTarget',
    render() {
        return (
            <div class="n-common__content">
                <div class="n-target">
                    <div class="n-target__notice">请设置邮件内容</div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-target {
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
