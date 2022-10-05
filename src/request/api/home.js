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
//获取发现好歌单
export function getMusicList() {
    return service({
        method: 'GET',
        url: '/personalized?limit=10'
    })
}
//搜索/search?keywords=海阔天空
export function getSearchMusic(data) {
    return service({
        method: 'GET',
        url: `/search?keywords=${data}`
    })
}
//登录 /login/cellphone?phone=xxx&password=yyy
export function getPhoneLogin(data) {
    return service({
        method: 'GET',
        url: `/login/cellphone?phone=${data.phone}&password=${data.password}`
    })
}
//获取用户详情
export function getLoginUser(data) {
    return service({
        method: 'GET',
        url: `/user/detail?uid=${data}`
    })
}