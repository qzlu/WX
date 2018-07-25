// pages/selectVehicle/selectVehicel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vehicleList:[],
    filterVehicleList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadVehicleList()
  },
  //获取车辆列表
  loadVehicleList: function () {
    var _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: "POST",
      url: app.url + '/Wx/WxTrip',
      data: {
        FTokenID: app.tokenId,
        FAction: "QueryVehicleList",
        FKey:"",
        FVersion: "1.0.0"
      },
      success(res) {
        wx.hideLoading()
        if(res.data.Result===200){
            _this.setData({
              vehicleList:res.data.FObject,
              filterVehicleList: res.data.FObject
            })
        }else{
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(error) {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  filter:function(e){
      var str=e.detail.value;
      var arr=[];
      for (var i = 0; i < this.data.vehicleList.length ; i++){
        let obj = this.data.vehicleList[i];
        if (obj.FVehicleName.indexOf(str)!==-1){
          arr.push(obj)
        }
      }
      this.setData({
        filterVehicleList:arr
      })
  },
  //选择车辆
  selectVehicle:function(e){
    var item =e.currentTarget.dataset.obj;
      app.goodsInfo.vehicleName = item.FVehicleName;
      app.goodsInfo.driverName = item.FDriverName ? item.FDriverName : "";
      app.goodsInfo.driverTel = item.FPhoneNumber ? item.FPhoneNumber : "";
    wx.navigateBack({
      delta: 1
    })
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