<script>
export default {
    name: 'NodeSource',
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
            instance.addEndpoint(node.id, { anchor: 'Bottom' }, { isSource: true, isTarget: false, maxConnections: 1 })
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
