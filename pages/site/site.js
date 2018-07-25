// pages/site/site.js
const app = getApp()
var x, y, x1, y1, x2, y2, currindex, n, oldValue;
var list
Page({
  /**
   * 页面的初始数据
   */
  data: {
    siteArr:[],
    checkSite:[],
    top:"100rpx",
    animationData:{},
    // timer:null,
    mainx: null,
    start: { x: 0, y: 0 },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var _this = this;
     var top;
     if (app.checkSite.length <= 4 && app.checkSite.length>0) {
       top = "254rpx"
     } else if (4 < app.checkSite.length && app.checkSite.length <= 8) {
       top = "408rpx"
     } else if (app.checkSite.length > 8){
       top = "562rpx"
     }else{
       top = "100rpx"
     }
     _this.setData({
       checkSite: app.checkSite,
        top:top
     });
     wx.showLoading({
       title: '加载中',
     })
      wx.request({
        url: app.url +'/Wx/WxTrip',
        method: "POST",
        data: {
          FTokenID: app.tokenId,
          FAction: "QueryCustomerList",
          FVersion: "1.0.0"
        },
        success:function(res){
            console.log(res);
            if (res.data.Result === 200){
              var arr = res.data.FObject;
              var arr1 = _this.data.checkSite
              for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr1.length; j++) {
                  if (arr[i].FGUID === arr1[j].FGUID) {
                    arr.splice(i, 1);
                    if (i > 0) {
                      i--
                    }
                  }
                }
              }
              _this.setData({
                siteArr: arr
              });
              wx.hideLoading()
            }else{
              wx.hideLoading();
              wx.showToast({
                title: '加载失败',
                icon: 'none',
                duration: 2000
              });
            } 
        },
        fail:function(e){
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          });
        }
      })
  },
  movestart:function(e){
    currindex = e.currentTarget.dataset.index;
     x = e.touches[0].clientX;
     y = e.touches[0].clientY;
      x1 = e.currentTarget.offsetLeft;
      y1 = e.currentTarget.offsetTop;
      oldValue = null;
  },
  move: function (e) {
    var arr=[];
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    this.setData({
      mainx: currindex,
      start: { x: x2, y: y2 },
    });
    var width = app.windowWidth * 0.2 + 2;//站点方块的宽
    var height = app.windowWidth / 750 * 120 + 2;//站点方块的高
    var xn = Math.round(x2/ width);
    var yn = Math.round(y2 / height) - 1;
    if (xn > 3) {
      xn = 3
    }
    if (xn < 0) {
      xn = 0
    }
    if (yn > Math.ceil(this.data.checkSite.length / 4)) {
      yn = Math.ceil(this.data.checkSite.length / 4) - 1
    }
    if (yn < 0) {
      yn = 0
    }
    n = xn + yn * 4;
    if (n > this.data.checkSite.length - 1) {
      n = this.data.checkSite.length - 1
    }
    if (n !== currindex && oldValue != n){
      var temp = this.data.checkSite[currindex];
      arr = this.data.checkSite;
      arr[currindex] = arr[n];
      arr[n] = temp;
      oldValue = n
      this.setData({
        checkSite: arr,
        mainx:n
      });
      currindex =n
    }
  },
  moveend: function () {
      this.setData({
         mainx: "",
      })
  },
  select:function(e){
      // console.log(e)
      var _this=this,selectObj;
      var obj=e.currentTarget.dataset.obj;
      for(var i=0;i<this.data.siteArr.length;i++){
        var item = this.data.siteArr[i];
        if (obj.FGUID === item.FGUID){
          selectObj=_this.data.siteArr.splice(i,1)
        }
      }
      if (_this.data.checkSite.length===10){
        return
      }
      var top;
      if (_this.data.checkSite.concat(selectObj).length<=4){
         top="254rpx"
      } else if (4 < _this.data.checkSite.concat(selectObj).length && _this.data.checkSite.concat(selectObj).length <=8){
        top="408rpx"
      } else {
        top="562rpx"
      }
      this.setData({
        siteArr: _this.data.siteArr,
        checkSite: _this.data.checkSite.concat(selectObj),
        top:top
      });
      list=JSON.parse(JSON.stringify(_this.data.checkSite))
  },
  submit(){
    app.checkSite = this.data.checkSite;
    if (!this.data.checkSite.length){
      wx.showToast({
        title: '请选择站点',
        icon: 'none',
        duration: 2000
      });
      return
    }
    wx.reLaunch({
      url: "/pages/logs/logs"
    })
  },
  addSite(){
    wx.navigateTo({
      url: '/pages/addSite/addSite',
    })
  },
  //长按动画
  // showDelSite(){
  //   if (this.data.timer) {
  //     return
  //   }
  //   var animation = wx.createAnimation({
  //     timingFunction: 'ease',
  //     duration:100
  //   })
  //   this.animation = animation;
  //  var timer= setInterval(()=>{
  //                     animation.rotate(3).step()
  //                     animation.rotate(-3).step()
  //                     this.setData({
  //                       animationData: animation.export()
  //                     });
  //                     },100);
  //   this.setData({
  //     timer: timer
  //   })
  // },
  //取消动画
  // cancle(){
  //   if (this.data.timer==null){
  //     return
  //   }
  //   clearInterval(this.data.timer);
  //   setTimeout(()=>{
  //     var animation = wx.createAnimation({
  //       timingFunction: 'ease',
  //       duration: 0
  //     })
  //     this.animation = animation;
  //     animation.rotate(0).step();
  //     this.setData({
  //       animationData: animation.export(),
  //       timer: null
  //     });
  //   },150)
  // },
  delSite(e){
    var item = e.currentTarget.dataset.site;
    for (var i = 0; i < this.data.checkSite.length; i++) {
      var obj = this.data.checkSite[i];
      if (item.FGUID === obj.FGUID) {
        this.data.checkSite.splice(i, 1)
      }
    }
    var top;
    if (this.data.checkSite.length <= 4 && this.data.checkSite.length > 0) {
      top = "254rpx"
    } else if (4 < this.data.checkSite.length && this.data.checkSite.length <= 8) {
      top = "408rpx"
    } else if (this.data.checkSite.length > 8) {
      top = "562rpx"
    } else {
      top = "100rpx"
    }
    this.data.siteArr.push(item);
    this.setData({
      checkSite: this.data.checkSite,
      siteArr: this.data.siteArr,
      top:top
    })
    list = JSON.parse(JSON.stringify(this.data.checkSite))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.checkSite = this.data.checkSite;
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