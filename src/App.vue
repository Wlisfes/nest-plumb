<script>
export default {
    name: 'App',
    render() {
        return (
            <div id="app">
                <router-view />
            </div>
        )
    }
}
</script>

<style lang="less" scoped>
#app {
    width: 100%;
    height: 100%;
}
</style>
