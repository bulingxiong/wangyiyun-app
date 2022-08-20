import service from "..";
//获取首页轮播图的数据
export function getBanner() {
    return service({
        // `method` 是创建请求时使用的方法
        method: 'GET',
        // `url` 是用于请求的服务器 URL
        url: '/banner?type=2',
    })
}
export function getMusicList() {
    return service({
        method: 'GET',
        url: '/personalized?limit=10'
    })
}