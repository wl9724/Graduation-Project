// pages/update/update.js
import WxValidate from '../../utils/WxValidate';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    username:"",
    password:"",
    phone:"",
    email:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    var that = this;
    that.setData({
      id:options.id
    });
    wx.request({
      url: 'https://www.neuos.xyz:8443/graduation-dev-SNAPSHOT/getInformation',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: {
        id:that.data.id
      },
      success: function (res) {
        that.setData({
          username:res.data.username,
          password:res.data.password,
          phone:res.data.phone,
          email:res.data.email
        });
        console.log(that.data.username)
      },
      fail: function () {
        wx.showToast({
          title: '获取信息失败',
        });
        wx.reLaunch({
          url: '../../pages/usercenter/usercenter?id=' + that.data.id,
        })
      }
    })
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
      phone: {
        required: true,
        tel: true
      },
      email: {
        required: true,
        email: true
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
      phone: {
        requried: '请输入电话',
        tel: '请输入正确的电话号码'
      },
      email: {
        required: '请输入电子邮箱',
        email: '请输入正确的电子邮箱'
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
    //修改请求
    wx.request({
      url: 'https://www.neuos.xyz:8443/graduation-dev-SNAPSHOT/update',
      data: {
        id:that.data.id,
        params},
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status) {
          wx.showToast({
            title: '修改成功',
          });
          wx.reLaunch({
            url: '../../pages/usercenter/usercenter?id=' + params.id + '&username=' + params.username,
          })
        } else {
          wx.showToast({
            title: '修改失败',
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

  reset: function(){
    var that=this;
    wx.reLaunch({
      url: '../../pages/usercenter/usercenter?id=' + that.data.id + '&username=' + that.data.username,
    })
  }

  
})