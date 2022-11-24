<script>
export default {
    name: 'NScale',
    props: {
        maxWidth: {
            type: Number,
            default: () => 540
        },
        scale: {
            type: Number,
            default: () => 16 / 9
        }
    },
    render() {
        return (
            <div class="n-scale" style={{ maxWidth: this.maxWidth + 'px' }}>
                <div class="n-scale__compute" style={{ paddingBottom: 100 / this.scale + '%' }}>
                    <div class="n-scale__column">{this.$slots.default}</div>
                </div>
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
.n-scale {
    width: 100%;
    &__compute {
        width: 100%;
        position: relative;
        overflow: hidden;
    }
    &__column {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        ::v-deep {
            .n-image,
            .n-image img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }
    }
}
</style>
