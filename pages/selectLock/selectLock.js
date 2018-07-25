// pages/selectLock/selectLock.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lockList:[],
    filterLockList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadLockList();
  },
  //获取车辆列表
  loadLockList: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: "POST",
      url: app.url + '/Wx/WxTrip',
      data: {
        FTokenID: app.tokenId,
        FAction: "QueryAssetList",
        FKey: "",
        FVersion: "1.0.0"
      },
      success(res) {
        wx.hideLoading()
        if (res.data.Result === 200) {
          _this.setData({
            lockList: res.data.FObject,
            filterLockList: res.data.FObject
          })
        } else {
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
  filter: function (e) {
    var str = e.detail.value;
    var arr = [];
    for (var i = 0; i < this.data.lockList.length; i++) {
      let obj = this.data.lockList[i];
      if (obj.FAssetID.indexOf(str) !== -1) {
        arr.push(obj)
      }
    }
    this.setData({
      filterLockList: arr
    })
  },
  selectLock:function(e){
    var item = e.currentTarget.dataset.lockid;
    app.goodsInfo.lockId = item;
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