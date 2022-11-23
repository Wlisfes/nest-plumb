import request from '@/utils/utils-request'

/**创建节点**/
export function httpCreateNode(params) {
    return request({ method: 'POST', url: `/api/flow-chart/create-node`, data: params })
}

/**节点列表**/
export function httpColumnNode(params) {
    return request({ method: 'GET', url: `/api/flow-chart/column-node`, params })
}
