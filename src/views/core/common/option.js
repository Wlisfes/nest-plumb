export const Option = {
    grid: [10, 10],
    //动态锚点、位置自适应
    Anchors: ['TopCenter', 'BottomCenter'],
    Container: 'context',
    //连线的样式 Bezier(贝塞尔曲线)、Straight(直线)、Flowchart(流程图)、StateMachine(状态机)
    Connector: ['Flowchart', { gap: 10, cornerRadius: 5, alwaysRespectStubs: true, stub: 50 }],
    //删除线的时候节点不删除
    DeleteEndpointsOnDetach: false,
    //鼠标不能拖动删除线
    ConnectionsDetachable: false,
    //连线的叠加组件，如箭头、标签
    ConnectionOverlays: [['Arrow', { width: 12, length: 12, location: 1 }]],

    //端点的默认样式
    Endpoint: ['Dot', { radius: 8 }],
    EndpointStyle: { fill: 'rgb(30, 129, 81)' },
    //连接线样式
    PaintStyle: { stroke: '#2080F0', radius: 10, strokeWidth: 2 },
    HoverPaintStyle: { stroke: 'red' }
}
