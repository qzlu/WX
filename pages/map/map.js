const app = getApp()
Page({
  data: {
    //货物信息
    goodsInfo:{
      goodsName:"",//货物简称
      vehicleName:"",//车牌号
      lockId:"",//电子锁ID 
      code:"",//订单号
      address:"",//始发地
      driverName:"",//司机姓名
      driverTel:"",//司机电话号码
      carrier :"",//承运商
      imgArr:[]//图片url
    },
    lockId:"",
    address:"",
    src:"",
    imgArr: []
  },
  onLoad: function (option) {
  },
  onShow:function(){
    this.setData({
      goodsInfo: app.goodsInfo
    });
  },
  //电子锁ID扫码
  scanCode:function(){
    var _this=this;
    wx.scanCode({
      success:function(res){
        _this.setData({
          ["goodsInfo.lockId"]: res.result
        })
      }
    })
  },
  scanGetCode:function(){
      var _this=this;
      wx.scanCode({
        success: function (res) {
          _this.setData({
            ["goodsInfo.code"]: res.result
          })
        }
      })
  },
  //选择始发地
  chosePosition(){
    var _this=this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        _this.setData({
          ["goodsInfo.address"]:res.address
        })
      },
    })
  },
  //选择照片
  takePhoto() {
      var _this=this;
      wx.chooseImage({
        count:3,
        success: function(res) {
          if (_this.data.imgArr.length >= 3){
            return
          }
          _this.setData({
            ["goodsInfo.imgArr"]: _this.data.goodsInfo.imgArr ? _this.data.goodsInfo.imgArr.concat(res.tempFilePaths) : res.tempFilePaths,
            // imgArr: _this.data.imgArr.concat(res.tempFilePaths)
          })
        },
      })
  },
  error(e) {
    console.log(e.detail)
  },
  //获取手机联系人
  getPhone(){
    wx.addPhoneContact({
      
    })
  },
  //删除照片
  delImg(e){
    var url= e.currentTarget.dataset.url
    var i = this.data.goodsInfo.imgArr.indexOf(url)
    this.data.goodsInfo.imgArr.splice(i,1);
    this.setData({
      ["goodsInfo.imgArr"]: this.data.goodsInfo.imgArr
    })
  },
  //点击查看相片
  imgDedail(e){
    var arr = this.data.goodsInfo.imgArr;
    wx.navigateTo({
      url: '/pages/detail/img?id=' + arr
    })
  },
  //确定
  submit(){
    if (!this.data.goodsInfo.lockId){
      wx.showToast({
        title: '请输入电子锁ID',
        icon: 'none',
        duration: 2000
      });
      return
    }
    app.goodsInfo = this.data.goodsInfo;
    wx.reLaunch({
      url: "/pages/logs/logs"
    })
  },
  getGoodsName(e){
    this.setData({
      ["goodsInfo.goodsName"]: e.detail.value
    })
  },
  getVehicleName(e){
    this.setData({
      ["goodsInfo.vehicleName"]:e.detail.value
    })
  },
  getLockId(e){
    this.setData({
      ["goodsInfo.lockId"]: e.detail.value
    })
  },
  getCode(e){
    this.setData({
      ["goodsInfo.code"]: e.detail.value
    })
  },
  getDriverName(e){
    this.setData({
      ["goodsInfo.driverName"]: e.detail.value
    })
  },
  getDriverTel(e){
    this.setData({
      ["goodsInfo.driverTel"]: e.detail.value
    })
  },
  getCarrier(e){
    this.setData({
      ["goodsInfo.carrier"]: e.detail.value
    })
  },
  onHide: function () {
    app.goodsInfo = this.data.goodsInfo
  },
  onUnload:function(){
  }
})