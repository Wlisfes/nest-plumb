<script>
export default {
    name: 'NodeColumn',
    props: {
        node: { type: Object, default: () => {} }
    },
    render() {
        const { node } = this
        const style = { top: node.top, left: node.left }

        return <div ref="node" class="node-column" style={style}></div>
    }
}
</script>

<style lang="less" scoped>
.node-column {
    position: absolute;
    display: flex;
    height: 120px;
    width: 350px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    cursor: move;
    box-sizing: content-box;
    z-index: 9995;
}
</style>
