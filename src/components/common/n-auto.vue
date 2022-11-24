<script>
export default {
    name: 'NAuto',
    props: {
        value: {
            type: String,
            default: 'ENABLE'
        }
    },
    methods: {
        JsxComponent() {
            switch (this.value) {
                case 'ENABLE':
                    return <el-tag type="success">启用</el-tag>
                case 'DISABLE':
                    return <el-tag type="success">禁用</el-tag>
                default:
                    return null
            }
        }
    },
    render() {
        return this.JsxComponent()
    }
}
</script>
