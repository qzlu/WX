//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    src:"/imgs/open-1.png",
    openStatus:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hideBindModal:true,
    isBindUser:"",//是否绑定账号
    userId:"",//微信用户唯一标识
    userName:"",//绑定账号
    psd:""//密码
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    //判断是否绑定过用户
    if(app.isBindUser!==null){
      this.setData({
        hideBindModal: app.isBindUser,
        isBindUser: app.isBindUser,
        userId: app.userId
      })
    }else{
      app.isBindUserReadyCallback = res => {
        if(res.data.Result === 107){
          this.setData({
            hideBindModal: false,
            isBindUser: false,
            userId: res.data.BindNum
          })
        } else if (res.data.Result === 200){
          app.tokenId = res.data.FObject.Table[0].FTokenID;
          this.setData({
            hideBindModal: true,
            isBindUser: true
          })
        }
      }
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  openLock:function(e){
    var _this = this, i = 0, timer;
    if(!this.data.isBindUser){
        this.setData({
          hideBindModal:false
        });
        return
    }
    if (this.data.src !=="/imgs/open-1.png"){
      return
    }
    wx.scanCode({
      success:  (res) => {
        console.log(res);
        var id=res.result;
          wx.request({
            url: app.url +'/Wx/WxSmartLock',
            method: "POST",
            data: {
              FTokenID: app.tokenId,
              FAction: "OpenLockControl",
              FAssetID: id,
              FVersion: "1.0.0"
            },
            success: function (json) {
              console.log(json);
              if (json.data.Result === 200) {
                _this.setData({
                  src: "/imgs/openIng.gif"
                })
                  timer = setInterval( function () {
                    i++;
                    if (i > 4) {
                      _this.setData({
                        src: "/imgs/openFail.gif"
                      })
                      clearInterval(timer);
                      setTimeout(()=>{
                        _this.setData({
                          src: "/imgs/open-1.png"
                        })
                      },3000)
                    } else {
                      wx.request({
                        url: app.url +'/Wx/WxSmartLock',
                        method: "POST",
                        data: {
                          FTokenID: "7115ce0f-1422-4f6e-a6c8-3eed8c26cddb",
                          FAction: "QueryLockStatus",
                          FAssetID: id,
                          FVersion: "1.0.0"
                        },
                        success: function (json) {
                          if (json.data.Result === 200) {
                            _this.setData({
                              src: "/imgs/openSuccess.gif"
                            })
                            clearInterval(timer);
                            setTimeout(() => {
                              _this.setData({
                                src: "/imgs/open-1.png"
                              })
                            }, 3000)
                          }
                        }
                      })
                    }
                  }, 2000)
              } else if (json.data.Result === 107 ){
                wx.showToast({
                  title: '没有权限开锁',
                  icon: 'none',
                  duration: 2000
                });
              } else if (json.data.Result === 108){
                wx.showToast({
                  title: '锁已打开',
                  icon: 'none',
                  duration: 2000
                });
              }else{
                wx.showToast({
                  title: '系统异常',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail:function(e){
              _this.setData({
                src: "/imgs/openFail.gif"
              })
              setTimeout(() => {
                _this.setData({
                  src: "/imgs/open-1.png"
                })
              }, 3000)
            }
          })
      }
    })
  },
  QueryOpenStatus:function(id){
      return new Promise(resove=>{

      })
  },
  getUser(e){
      this.setData({
        userName:e.detail.value
      })
  },
  getPsd(e){
    this.setData({
      psd:e.detail.value
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hideBindModal: true
    });
  },
  //确认  (绑定账号)
  confirm: function () {
    var _this=this;
    console.log(this.data.userName, this.data.psd,this.data.userId);
      this.setData({
        hideBindModal: true
      });
      wx.request({
        url: app.url+'/Wx/WxLogin',
        method: "POST",
        data: {
          FAccessGUID: app.newGuid(),
          FAction: "QueryWxLogin",
          FUserName: this.data.userName,
          FPassword: this.data.psd,
          FWxBindNum: this.data.userId,
          FVersion: "1.0.0"
        },
        success:function(res){
          console.log(res)
            if(res.data.Result===200){
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000
              });
              app.tokenId = res.data.FObject.Table[0].FTokenID;
              _this.setData({
                isBindUser: true
              })
            }else{
              wx.showToast({
                title: '绑定失败',
                icon: 'none',
                duration: 2000
              });
            }
        }
      })
  }, 
})
