export const Option = {
    grid: [5, 5],
    //动态锚点、位置自适应
    Anchor: 'TopCenter',
    Container: 'context',
    //连线的样式 Bezier(贝塞尔曲线)、Straight(直线)、Flowchart(流程图)、StateMachine(状态机)
    Connector: ['Bezier', { gap: 5, cornerRadius: 5, alwaysRespectStubs: true }],
    //删除线的时候节点不删除
    DeleteEndpointsOnDetach: false,
    //鼠标不能拖动删除线
    ConnectionsDetachable: false,
    //连线的叠加组件，如箭头、标签
    ConnectionOverlays: [['Arrow', { width: 20, length: 20, location: 1 }]],

    //端点的默认样式
    Endpoint: ['Dot', { radius: 8 }],
    EndpointStyle: { fill: 'rgb(30, 129, 81)' },
    //连接线样式
    PaintStyle: { stroke: '#2080F0', radius: 10, strokeWidth: 5 },
    HoverPaintStyle: { stroke: 'red' }
}
