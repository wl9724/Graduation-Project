// pages/usercenter/usercenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    username: "",
    islogin:"",
    isoffline: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    this.setData({
      id: getApp().globalData.id,
      username: getApp().globalData.username
    });
    if (this.data.id == "") {
      that.setData({
        islogin:false,
        isoffline: true
      })
    } else {
      that.setData({
        islogin: true,
        isoffline: false
      })
    }
  },

  //跳转到修改页面
  update: function() {
    var that = this;
    if (that.data.id == "") {
      wx.showToast({
        title: '还没有登录',
      })
    } else {
      wx.reLaunch({
        url: '../../pages/update/update?id=' + that.data.id
      })
    }
  },

  //用户下线操作
  offline: function() {
    var that = this;
    wx.request({
      url: 'https://www.neuos.xyz:8443/graduation-dev-SNAPSHOT/offline',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: {
        id: that.data.id
      },
      success: function(res) {
        if (res.data.status) {
          getApp().globalData.id = "";
          getApp().globalData.username = "";
          that.setData({
            id:"",
            username:"",
            isoffline: true
          })
        } else {
          wx.showToast({
            title: '退出失败',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '请求失败',
        })
      }
    })
  },

  //跳转到登录页面
  gotologin:function(){
    wx.reLaunch({
      url: '../../pages/login/login',
    })
  }
})