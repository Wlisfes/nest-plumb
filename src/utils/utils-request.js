import axios from 'axios'

const service = axios.create({
    baseURL: `/api`,
    timeout: 60000
})

//请求拦截
service.interceptors.request.use(
    config => {
        return config
    },
    error => Promise.reject(error.response?.data || error.response || error)
)

//响应拦截
service.interceptors.response.use(
    response => {
        return response.data
    },
    error => Promise.reject(error.response?.data || error.response || error)
)

export default service
