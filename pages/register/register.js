// pages/register/register.js
import WxValidate from '../../utils/WxValidate';
Page({

  data: {},

  onLoad: function (options) {

    this.initValidate()
  },

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
      phone:{
        required: true,
        tel:true
      },
      email:{
        required:true,
        email:true
      }
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
      phone:{
        requried:'请输入电话',
        tel:'请输入正确的电话号码'
      },
      email:{
        required:'请输入电子邮箱',
        email:'请输入正确的电子邮箱'
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  },

  submitForm(e) {
    /**
     * 4-3(表单提交校验)
     */
    const params = e.detail.value
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      console.log(this.WxValidate.errorList)
      this.showModal(error)
      return false
    }
    var that = this;
    //注册请求
    wx.request({
      url: 'https://www.neuos.xyz:8443/graduation-dev-SNAPSHOT/register',
      data:params,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status) {
          wx.showToast({
            title: '注册成功',
          });
          wx.reLaunch({
            url: '../../pages/login/login'
          })
        } else {
          wx.showToast({
            title: '注册失败',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求失败',
        })
      }

    })
  },
  //取消操作
  reset: function () {
    wx.reLaunch({
      url: '../../pages/login/login',
    })
  }
})