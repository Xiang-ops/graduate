/* eslint-disable*/
import { get, post, deletes } from './http'

// =======================> 管理员 API
// 是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params)


// =======================> 用户 API
// 返回所有用户
export const getAllUser = () => get(`user`)
// 返回指定ID的用户
export const getUserOfId = (id) => get(`user/detail?id=${id}`)
// 添加用户
export const setUser = (params) => post(`user/add`, params)
// 更新用户信息
export const updateUserMsg = (params) => post(`user/update`, params)
// 删除用户
export const deleteUser = (id) => get(`user/delete?id=${id}`)

// ========================>菜单API
// 返回所有菜单
export const getAllMenu = () => get(`menu`)
// 添加菜单
export const setMenu = (params) => post(`menu/add`, params)
// 更新菜单信息
export const updateMenuMsg = (params) => post(`menu/update`, params)
// 删除菜单
export const deleteMenu = (id) => get(`menu/delete?id=${id}`)
// 更新菜品规格
export const updateSize = (params) => get(`update/menu/size`, params)
//添加菜品规格
export const addConditionFunct = (params) => get(`add/menu/condition`, params)
//获取所有的菜品规格
export const getAllCondition = (params) => get(`goods/conditions`, params)
//删除某个菜品规格
export const deleteConditionFunct = (params) => get(`delete/conditions`, params)

//==========================>菜单类型API
//返回所有菜单类型
export const getAllMenuType = () => get(`menutype`)
//添加菜单类型
export const setMenuType = (params) => post(`menutype/add`, params)
//删除菜单类型
export const deleteMenuType = (id) => get(`menutype/delete?id=${id}`)

//=========================>订单API
//返回所有订单
export const getAllOrder = () => get(`order`)
//更新订单状态
export const updateOrderCash = (params) => post(`order/update/status`, params)

// =======================> 评论列表 API
// 获得指定歌曲ID的评论列表
export const getAllComment = () => get(`comment`)
// 删除评论
export const deleteComment = (id) => get(`comment/delete?id=${id}`)


// ========================>商家信息API
//获取商家信息
export const getShopInfo = () => get(`shop/info`)
export const submitShopInfo = (params) => post(`submit/shop/info`, params)


//=========================>优惠券信息API
//获取优惠券信息
export const getCouponInfo = () => get(`get/all/coupon`)
export const setCoupon = (params) => post(`add/coupon`,params)
export const deleteCoupon = (id) => get(`delete/coupon?id=${id}`)

// =======================> 收藏列表 API
// 返回的指定用户ID收藏列表
export const getCollectionOfUser = (userId) => get(`collection/detail?userId=${userId}`)
// 删除收藏的歌曲
export const deleteCollection = (userId, songId) => get(`/collection/delete?userId=${userId}&&songId=${songId}`)




// =======================> 歌手 API
// 返回所有歌手
export const getAllSinger = () => get(`singer`)
// 添加歌手
export const setSinger = (params) => post(`singer/add`, params)
// 更新歌手信息
export const updateSingerMsg = (params) => post(`singer/update`, params)
// 删除歌手
export const deleteSinger = (id) => get(`singer/delete?id=${id}`)


// =======================> 歌曲 API
// 返回所有歌曲
export const getAllSong = () => get(`song`)
// 返回指定歌手ID的歌曲
export const getSongOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`)
// 返回的指定用户ID收藏列表
export const getSongOfId = (id) => get(`song/detail?id=${id}`)
// 返回指定歌手名的歌曲
export const getSongOfSingerName = (id) => get(`song/singerName/detail?name=${id}`)
// 更新歌曲信息
export const updateSongMsg = (params) => post(`song/update`, params)
// 删除歌曲
export const deleteSong = (id) => get(`song/delete?id=${id}`)


// =======================> 歌单 API
// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)
// 获取全部歌单
export const getSongList = () => get(`songList`)
// 更新歌单信息
export const updateSongListMsg = (params) => post(`songList/update`, params)
// 删除歌单
export const deleteSongList = (id) => get(`songList/delete?id=${id}`)


// =======================> 歌单歌曲 API
// 给歌单添加歌曲
export const setListSong = (params) => post(`ListSong/add`, params)
// 返回歌单里指定歌单ID的歌曲
export const getListSongOfSongId = (songListId) => get(`listSong/detail?songListId=${songListId}`)
// 删除歌单里的歌曲
export const deleteListSong = (songId) => get(`ListSong/delete?songId=${songId}`)
