<script>
export default {
    name: 'NDivine',
    props: {
        value: {
            type: [String, Number, Boolean]
        }
    },
    methods: {
        JsxComponent() {
            if (![undefined, null, ''].includes(this.value)) {
                return <span>{this.value}</span>
            }
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <n-icon size={20}>
                        <svg viewBox="0 0 1024 1024">
                            <path
                                d="M112 476h160v72H112zm320 0h160v72H432zm320 0h160v72H752z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </n-icon>
                </div>
            )
        }
    },
    render() {
        return this.JsxComponent()
    }
}
</script>
