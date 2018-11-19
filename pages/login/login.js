import WxValidate from '../../utils/WxValidate';
Page({
  data: {},

  onLoad: function(options) {

    this.initValidate()
  },

  //数据检验失败显示错误信息
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  /**
   * 表单-验证字段
   */
  initValidate() {
    const rules = {
      username: {
        required: true,
        rangelength: [1, 6]
      },
      password: {
        required: true,
        rangelength: [6, 10]
      },
    }
    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      username: {
        required: '请输入用户名',
        rangelength: '请输入1~6个字'
      },
      password: {
        required: '请输入密码',
        rangelength: '密码长度不符合'
      },
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  },

  //表单数据检验并进行登陆操作
  submitForm(e) {
    const params = e.detail.value
    //表单数据检验
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    var that = this;
    wx.showToast({
      title: '登录请求中',
      icon: 'loading',
      duration: 10000
    });
    //登录网络请求开始
    wx.request({
      url: 'https://www.neuos.xyz:8443/graduation-dev-SNAPSHOT/login',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: params,
      success: function(res) {
        wx.hideToast();
        if (res.data.loginstatus) {
          getApp().globalData.id = res.data.id;
          getApp().globalData.username = params.username;
          wx.reLaunch({
            url: '../../pages/usercenter/usercenter',
          });
        } else {
          wx.showModal({
            title: '登录失败',
            content: '用户已经登录',
            showCancel: false,
            success: function(res) {
              //回调函数
            }
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '登录失败',
          content: '请检查用户名或密码',
        })
      }
    });
  },

  //跳转到注册画面
  gotoregister: function() {
    wx.hideToast();
    wx.reLaunch({
      url: '../../pages/register/register',
    })
  }
})