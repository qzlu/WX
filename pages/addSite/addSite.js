// pages/addSite/addSite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteName:"",
    name:"",
    telNumber:"",
    address:"",
    lng:"",
    lat:"",
    telNumberIsTrue:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  getSiteName(e){
      this.setData({
        siteName:e.detail.value
      })
  },
  getName(e){
    this.setData({
      name: e.detail.value
    })
  },
  getTelphone(e){
    this.setData({
      telNumber: e.detail.value,
      telNumberIsTrue: true
    })
  },
  getAddress(){
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        _this.setData({
          address: res.address,
          lng:res.longitude,
          lat:res.latitude
        })
      },
    })
  },
  addSite(){
    if (!this.data.siteName || !this.data.name || !this.data.telNumber || !this.data.address){
        return
    } else if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.data.telNumber))){
      this.setData({
        telNumberIsTrue:false
      })
    }else{
      wx.request({
        method:"POST",
        url: app.url + '/Wx/WxTrip',
        data:{
          FTokenID: app.tokenId,
          FAction:"AddCustomerInfo",
          FMT_Wx_Customer:{
            FUserName: this.data.name,
            FAgentCode: this.data.siteName,
            FTelephone: this.data.telNumber,
            FAddress: this.data.address,
            FLongitude: this.data.lng,
            FLatitude: this.data.lat,
            FFenceGUID:"",
            FFenceGUID:""
          },
          FVersion: "1.0.0"
        },
        success:function(res){
          if(res.data.Result===200);
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})