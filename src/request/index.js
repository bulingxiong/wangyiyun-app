import axios from 'axios'
// 自定义配置新建一个 axios 实例
let service = axios.create({
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
    baseURL: "http://localhost:3000/",
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    timeout: 3000
})
export default service