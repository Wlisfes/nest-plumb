export const CustomizeUI = {
    install(app) {
        const common = require.context('@/components', true, /\.vue$/)
        common.keys().forEach(node => {
            const component = common(node).default
            app.component(component.name, component)
        })
    }
}

export default CustomizeUI
