<script>
export default {
    name: 'NColumn',
    props: {
        dataColumn: {
            type: Array,
            default: () => []
        },
        value: {
            type: [String, Number, Boolean]
        }
    },
    methods: {
        JsxComponent() {
            const node = this.dataColumn.find(x => x?.value == this.value)
            return <n-divine value={node?.label ?? this.value}></n-divine>
        }
    },
    render() {
        return this.JsxComponent()
    }
}
</script>
