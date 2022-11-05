<script>
export default {
    name: 'NSource',
    props: {
        node: Object,
        instance: Object,
        observer: Object,
        recent: {
            type: Object,
            default: () => null
        }
    },

    computed: {
        stroke() {
            const colors = { success: '#67c23a', danger: '#f56c6c', info: '#909399' }
            return colors[this.node.type]
        },
        isActive() {
            const { node, recent } = this
            return recent?.id === node.id
        }
    },
    mounted() {
        // this.$nextTick(() => this.initOneAfter())
    },
    methods: {
        /**设置出口**/
        initOneAfter() {
            const { node, instance } = this
            instance.makeSource(node.id, {
                maxConnections: 1,
                anchor: 'BottomCenter',
                endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' },
                connectorStyle: { stroke: this.stroke, strokeWidth: 5 }
            })
        }
    },
    render() {
        const { node } = this

        return <div class={{ 'n-source': true, 'is-active': this.isActive }}>{node.content}</div>
    }
}
</script>

<style lang="less" scoped>
.n-source {
    height: 28px;
    line-height: 26px;
    background-color: #ecf5ff;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    box-sizing: border-box;
    white-space: nowrap;
    margin: 0 10px;
    &.is-active {
        background-color: red;
    }
}
</style>
