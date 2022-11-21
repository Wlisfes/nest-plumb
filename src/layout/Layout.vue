<script>
export default {
    name: 'Layout',
    data() {
        return {
            collapse: false
        }
    },
    methods: {
        setCollapse(collapse) {
            this.collapse = collapse
        }
    },
    render() {
        return (
            <el-container class="n-layout" direction="horizontal">
                <el-aside width={this.collapse ? '64px' : '200px'}>
                    <div class="n-trigger" onClick={e => this.setCollapse(!this.collapse)}></div>
                    <el-menu router default-active={this.$route.path}>
                        <el-menu-item index="/">
                            <i class="el-icon-picture-outline"></i>
                            <span slot="title">流程图</span>
                        </el-menu-item>
                        <el-menu-item index="/source">
                            <i class="el-icon-monitor"></i>
                            <span slot="title">节点配置</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container direction="vertical">
                    <router-view key={this.$route.path} />
                </el-container>
            </el-container>
        )
    }
}
</script>

<style lang="less" scoped>
.n-layout {
    height: 100%;
    overflow: hidden;
    .el-aside {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: initial;
        border-right: 1px solid rgb(239, 239, 245);
        box-sizing: border-box;
        .n-trigger {
            position: absolute;
            top: 50%;
            right: -13px;
            transform: translateY(-50%);
            width: 26px;
            height: 26px;
            box-shadow: 0 2px 4px 0px rgb(0 0 0 / 6%);
            border: 1px solid rgb(239, 239, 245);
            border-radius: 50%;
            cursor: pointer;
            box-sizing: border-box;
            background-color: #ffffff;
        }
        .el-menu {
            border-right: none;
        }
    }
}
</style>
