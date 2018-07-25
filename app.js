//////////dsjkhaksddddddddddddddddddddddddddd//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        _this.code=res.code;
        wx.request({
          url: _this.url+'/Wx/WxLogin',
          method: "POST",
          data: {
            FAccessGUID: this.newGuid(),
            FAction: "QueryWxLogin",
            FUserName:"",
            FPassword:"",
            FWxBindNum:"",
            Fappid:"wx3b4747d01d2117ac",
            Fsecret:"2564c2b1ad81c1aceb01f2b36e84e9bb",
            Fcode:res.code,
            FVersion: "1.0.0"
          },
          success:function(json){
            console.log(json);
            if (json.data.Result===107){
              _this.isBindUser = false; 
              _this.userId = json.data.BindNum
            } else if (json.data.Result === 200){
              _this.isBindUser = true;
              _this.tokenId = json.data.FObject.Table[0].FTokenID
            }
            if (_this.isBindUserReadyCallback) {
              _this.isBindUserReadyCallback(json)
            }
          },
          fail:function(e){
            console.log(e)
          }
        })
      },
      fail:function(e){
        console.log("denglu",e)
      }
    });
    //获取手机屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        _this.windowWidth = res.windowWidth
      },
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  newGuid:function(){
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    return guid;
  },
  globalData: {
    userInfo: null
  },
  goodsInfo:{
    goodsName: "",//货物简称
    vehicleName: "",//车牌号
    lockId: "",//电子锁ID 
    code: "",//订单号
    address: "",//始发地
    driverName: "",//司机姓名
    driverTel: "",//司机电话号码
    carrier: "",//承运商
    imgArr: []//图片url
  },
  checkSite:[],
  isBindUser:null,
  userId:"",
  tokenId:"",
  url:"https://wap.cloud.jointcontrols.cn",
  code:"",
  windowWidth:null,
})