// index.ts
import { IAppOption } from "../../../typings"

// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  // 事件处理函数
  bindSequence: function () {
    wx.navigateTo({
      url: '../question/question?type=sequence'
    })
  },
  bindRandom: function () {
    wx.navigateTo({
      url: '../question/question?type=random'
    })
  },
  bindFavorite: function () {
    const favorite_list = wx.getStorageSync('favorite_list') as unknown
    if (!favorite_list) {
      wx.showModal({
        title: 'Oops!',
        content: '你没有收藏的问题'
      })
      return
    }
    wx.navigateTo({
      url: '../question/question?type=favorite'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res: WechatMiniprogram.GetUserInfoSuccessCallbackResult) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        },
      })
    }
  },
  getUserInfo(e: { detail: { userInfo: WechatMiniprogram.UserInfo } }) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
