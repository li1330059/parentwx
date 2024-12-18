import request from '../../utils/request';
Page({
  data: {
    motto: 'Hello World',
    showDrawer: false,
    drawerAnimation: null,
    webSocketTask: null,
    childList:[],
    selectedItem:""
  },
  onLoad(){
    let that = this;
    this.animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
    });
    wx.login({
        success (res) {
          if (res.code) {
              console.log(res.code)
              //发起网络请求
                wx.request({
                    url: 'https://vid.duofenpai.com:15002/v1/external/info',
                    method:'POST',
                    header: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    },
                    data: {
                        js_code: res.code
                    },
                    success(res) {
                        console.log(res)
                        wx.setStorageSync('openid', res.data.openid); // 保存到本地存储
                        that.socketFun();
                        that.getChild();
                    }
                })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
  },
  openDrawer() {
    this.animation.translateX(0).step();
    this.setData({
      showDrawer: true,
      drawerAnimation: this.animation.export(),
    });
  },

  closeDrawer() {
    this.animation.translateX('-100%').step();
    this.setData({
      drawerAnimation: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        showDrawer: false,
      });
    }, 300); // 等待动画完成后隐藏
  },
  socketFun() {
    const socketTask = wx.connectSocket({
      url: 'wss://vid.duofenpai.com:15002/websocket?id='+wx.getStorageSync('openid'),  // 替换为实际地址
    });
    let timer;
    console.log(socketTask)
    socketTask.onOpen(() => {
      console.log('WebSocket 已连接');
      //心跳机制
      timer = setInterval(() => {
            if (this.data.socketOpen) {
                socketTask.send({
                    data: JSON.stringify({ type: 'ping-tinyapp', timestamp: Date.now() }),
                });
            }
        }, 30000); // 每 30 秒发送一次心跳
      this.setData({ socketOpen: true });
    });

    socketTask.onMessage((message) => {
        wx.hideLoading();
        console.log('收到消息:', message.data);
        if(message.data == '12306'){
          wx.showToast({
            title: '学生已离线',
            icon:'error'
          })
        }else if(this.data.sendType == 'position'){
            this.getMap(JSON.parse(message.data))
        }else{
            wx.previewImage({
                urls: [message.data]
            })
        }
    });

    socketTask.onClose((message) => {
      console.log('WebSocket 已关闭', message);
      clearInterval(timer); // 停止心跳
      this.setData({ socketOpen: false });
    });

    socketTask.onError((error) => {
        console.log('WebSocket连接打开失败，请检查！',error)
    })
    this.socketTask = socketTask;
  },
  ////功能区
  qrcode(){
    let that = this;
    wx.scanCode({
        success (res) {
            that.bindChild(res)
        }
      });
  },
  getChild(){
    request('/v1/user/parent/info', 'POST', {})
    .then((res) => {
        this.setData({
            childList: res.data.childVos,
        });
        if(res.data.childVos&&res.data.childVos.length>0){
          wx.setStorageSync('userCode', res.data.childVos[0].code)
          this.setData({
            selectedItem:res.data.childVos[0],
          }); // 更新选中状态
        }
      console.log('POST 请求成功：', res);
    })
    .catch((error) => {
      console.error('POST 请求失败：', error);
    });
  },
  bindChild(res){
    request('/v1/user/parent/set', 'POST', {
        "parentCode": wx.getStorageSync('openid'),
        "userCode": res.result
    })
    .then((res) => {
        wx.showToast({
          title: '绑定成功',
        })
        this.getChild();
      console.log('POST 请求成功：', res);
    })
    .catch((error) => {
      console.error('POST 请求失败：', error);
    });
  },
  // 点击事件处理
  selectChild(event) {
    const selectedItem = event.currentTarget.dataset.item;
    this.setData({ selectedItem }); // 更新选中状态
    this.closeDrawer();
  },
  sendRequest(event) {
    wx.showLoading({
      title:'连接设备中',
      mask: true // 是否显示遮罩层，默认为false
    });
    const { name } = event.currentTarget.dataset; // 通过 dataset 获取参数
    this.setData({
        sendType:name
    })
    request('/v1/external/web/opera', 'POST', {
        userCode: this.data.selectedItem.code,
        type: name
    })
    .then((res) => {
      console.log('POST 请求成功：', res);
    })
    .catch((error) => {
      wx.showLoading({
        title:'连接设备中',
        mask: true // 是否显示遮罩层，默认为false
      });
      console.error('POST 请求失败：', error);
    });
    console.dir(name)
    // if (this.data.socketOpen) {
    //   this.socketTask.send({
    //     data: name,
    //   });
    //   console.log('触发消息已发送');
    // } else {
    //   console.log('WebSocket 未连接');
    // }
  },
  getMap(item) {
      console.dir(item)
      wx.openLocation({
        latitude:item.lat,
        longitude:item.lng,
        scale: 18
      })
  },
  analysis(){
    wx.navigateTo({
      url: '/pages/analysis/index',
    })
  }
})
