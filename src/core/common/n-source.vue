<script>
export default {
    name: 'NSource',
    props: {
        node: Object,
        instance: Object,
        observer: Object
    },
    data() {
        return {
            active: false
        }
    },
    computed: {
        stroke() {
            const colors = { success: '#67c23a', danger: '#f56c6c', info: '#909399' }
            return colors[this.node.type]
        }
    },
    mounted() {
        this.$nextTick(() => this.initOneAfter())
        const done = this.observer.on('drag', response => {
            if (response && response.id === this.node.id) {
                this.active = true
            } else {
                this.active = false
            }
        })
        this.$once('hook:beforeDestroy', () => {
            done()
        })
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

        return <div class={{ 'n-source': true, 'is-active': this.active }}>{node.content}</div>
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
    margin: 0 5px;
    cursor: crosshair;
    &.is-active {
        background-color: red;
    }
}
</style>
