<script>
export default {
    name: 'NSource',
    props: {
        node: Object,
        instance: Object
    },
    mounted() {
        this.$nextTick(() => this.initOneAfter())
    },
    methods: {
        /**设置出口**/
        initOneAfter() {
            const { node, instance } = this
            instance.makeSource(node.id, {
                maxConnections: 1,
                anchor: 'BottomCenter',
                endpointStyle: { fill: 'transparent', outlineStroke: 'transparent' }
            })
        }
    },
    render() {
        const { node } = this

        return (
            <el-tag type={node.type} size="medium" style={{ margin: '0 5px' }}>
                {node.content}
            </el-tag>
        )
    }
}
</script>
