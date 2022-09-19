import request from '@/utils/utils-request'

export function httpCreateChart(params) {
    return request({ method: 'POST', url: `/api/chart/create`, data: params })
}

export function httpUpdateChart(params) {
    return request({ method: 'PUT', url: `/api/chart/update`, data: params })
}

export function httpOneChart(params) {
    return request({ method: 'GET', url: `/api/chart/one`, params })
}

export function httpCreateColumn(params) {
    return request({ method: 'POST', url: `/api/chart/create/column`, data: params })
}

export function httpCreateBezier(params) {
    return request({ method: 'POST', url: `/api/chart/create/bezier`, data: params })
}
