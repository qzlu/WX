//logs.js
const app = getApp()
Page({
  data: {
    logs: [],
    goodsInfo:{

    },
    //站点
    steps: [ ],
    isSending:false,//判断是否正在发货中
  },
  onLoad: function () {
    this.setData({
      goodsInfo: app.goodsInfo,
      steps: app.checkSite
    })
  },
  onShow: function () {
  },
  delSite(e){
    var item=e.currentTarget.dataset.site;
    for(var i=0;i<this.data.steps.length;i++){
      var obj = this.data.steps[i];
      if (item.FGUID === obj.FGUID){
        this.data.steps.splice(i,1)
      }
    }
    app.checkSite = this.data.steps
    this.setData({
      steps: this.data.steps
    })
  },
  send(){
    var _this=this;
    var siteGuidArr = [], receiveGUIDs=[],indexArr=[];
    var uploadFileStatus={status:0,url:[]}//上传图片进度
    if (!this.data.goodsInfo.lockId){
      wx.showToast({
        title: '请填写货物信息',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if(!this.data.steps.length){
      wx.showToast({
        title: '请填写站点信息',
        icon: 'none',
        duration: 2000
      });
      return
    }
    try{
      for (var i = 0; i < this.data.steps.length; i++) {
        let item = this.data.steps[i];
        siteGuidArr.push(item.FGUID);
        receiveGUIDs.push(item.FCustomerGUID);
        indexArr.push(i + 1);
      }
      var siteGuidStr = siteGuidArr.join(","), 
        receiveGUIDStr = receiveGUIDs.join(","),
       indexStr = indexArr.join(",");
    }catch(e){
      wx.showToast({
        title: '系统异常',
        icon: 'none',
        duration: 2000
      });
      return
    }
    //观察者模式观察图片上传进度，上传完成再发货
    Object.defineProperty(uploadFileStatus,'status',{
          get:function(){
            return status
          },
          set:function(newValue){
              if(newValue){
                wx.showToast({
                  title: '现在发货',
                  icon: 'loading',
                });
                _this.setData({
                  isSending: true
                })
                wx.request({
                  url: app.url + '/Wx/WxTrip',
                  method: "POST",
                  data: {
                    FTokenID: app.tokenId,
                    FAction: "AddTripInfo",
                    FMT_Wx_Trip: {
                      FAssetID: _this.data.goodsInfo.lockId,
                      FVehicleGUID: '',
                      FVehicleName: _this.data.goodsInfo.vehicleName,
                      FCargoCode: _this.data.goodsInfo.code,
                      FCargoName: _this.data.goodsInfo.goodsName,
                      FDeliveryAddress: _this.data.goodsInfo.address,
                      FDriverGUID: "",
                      FCarrier: _this.data.goodsInfo.carrier,
                      FDriverName: _this.data.goodsInfo.driverName,
                      FDriverPhone: _this.data.goodsInfo.driverTel,
                      FCargoPictures: uploadFileStatus.url.join(','),
                      FReceiveGUIDs: receiveGUIDStr,
                      FSDCGUIDs: siteGuidStr,
                      FIndexs: indexStr
                    },
                    FVersion: "1.0.0"
                  },
                  success: function (res) {
                    console.log(res);
                    _this.setData({
                      isSending: false
                    })
                    wx.hideToast()
                    if (res.data.Result === 200) {
                      wx.showToast({
                        title: '发货成功',
                        icon: 'success',
                        duration: 2000
                      });
                      app.checkSite = [];
                      _this.setData({
                        goodsInfo: {},
                        steps: []
                      });
                      app.goodsInfo = {}
                    } else if (res.data.Result === 106) {
                      wx.showToast({
                        title: '设备被占用',
                        icon: 'none',
                        duration: 2000
                      });
                    } else if (res.data.Result === 107) {
                      wx.showToast({
                        title: '设备不存在',
                        icon: 'none',
                        duration: 2000
                      });
                    } else {
                      wx.showToast({
                        title: '系统异常',
                        icon: 'none',
                        duration: 2000
                      });
                    }
                  },
                  fail: function (error) {
                    wx.hideToast();
                    _this.setData({
                      isSending: false
                    })
                    wx.showToast({
                      title: '系统异常',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                })
              }
          }
    })
    if (_this.data.goodsInfo.imgArr && _this.data.goodsInfo.imgArr.length) {
      wx.showToast({
        title: '正在上传图片',
        icon: 'none',
        duration: 2000
      });
      for (let i = 0; i < _this.data.goodsInfo.imgArr.length; i++) {
        wx.uploadFile({
          url: app.url + '/Wx/FileUpload',
          filePath: _this.data.goodsInfo.imgArr[i],
          name: 'file',
          formData: {
            "FTokenID": app.tokenId,
            "FAction": "FileUpload",
            "FVersion": "1.0.0"
          },
          success: function (res) {
            var data = JSON.parse(res.data) 
            //do something
            if(data.Result===200){
              uploadFileStatus.url.push(data.FObject);
              if (uploadFileStatus.url.length === _this.data.goodsInfo.imgArr.length){
                uploadFileStatus.status = 1
              }
            }
          }
        })
      }
    }else{
      uploadFileStatus.status = 1
    }
  },
  onHide: function () {
    app.goodsInfo = this.data.goodsInfo;
    app.checkSite=this.data.steps
  }
})