<script>
export default {
    name: 'NEmail',
    render() {
        return (
            <div class="n-common__content">
                <div class="n-email">
                    <div class="n-email__notice">请设置邮件内容</div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-email {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
}
</style>
