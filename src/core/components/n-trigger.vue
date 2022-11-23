<script>
export default {
    name: 'NTrigger',
    render() {
        return (
            <div class="n-common__content">
                <div class="n-trigger">
                    <div class="n-trigger__notice">请设置触发器</div>
                </div>
                {this.$slots.default}
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-trigger {
    padding: 0 20px;
    &__notice {
        font-size: 12px;
        color: #6b6c72;
        line-height: 20px;
    }
}
</style>
