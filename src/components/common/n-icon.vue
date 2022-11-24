<script>
export default {
    name: 'NIcon',
    props: {
        name: {
            type: String
        },
        component: {
            type: Object
        },
        size: {
            type: Number,
            default: 16
        }
    },
    render() {
        if (this.$slots.default || this.component) {
            return (
                <i class="n-icon" style={{ fontSize: this.size + 'px' }}>
                    {this.$slots.default ?? this.component}
                </i>
            )
        }
        return <i class={`n-icon ${this.name}`} style={{ fontSize: this.size + 'px' }}></i>
    }
}
</script>

<style lang="less" scoped>
.n-icon {
    height: 1em;
    width: 1em;
    line-height: 1em;
    text-align: center;
    display: inline-block;
    position: relative;
    fill: currentColor;
    transform: translateZ(0);
    svg {
        height: 1em;
        width: 1em;
    }
}
</style>
