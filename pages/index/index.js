import request from '../../utils/request';
Page({
  data: {
    motto: 'Hello World',
    showDrawer: false,
    drawerAnimation: null,
    webSocketTask: null,
    childList:[],
    selectedItem:"",
    imageUrl:'https://view.duofenpai.com/image/default/38591234A8DF45659D499813ECB61286-6-2.jpg'
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
    console.log(socketTask)
    socketTask.onOpen(() => {
      console.log('WebSocket 已连接');
      this.setData({ socketOpen: true });
    });

    socketTask.onMessage((message) => {
      console.log('收到消息:', message.data);
    });

    socketTask.onClose((message) => {
      console.log('WebSocket 已关闭', message);
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
    const { name } = event.currentTarget.dataset; // 通过 dataset 获取参数
    console.dir(name)
    if (this.data.socketOpen) {
      this.socketTask.send({
        data: name,
      });
      if(name == 'position'){
        this.getMap()
      }else{
        wx.previewImage({
          urls: [this.data.imageUrl]
        })
      }
      console.log('触发消息已发送');
    } else {
      console.log('WebSocket 未连接');
    }
  },
  getMap() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      },
      fail(res){
        console.dir(res)
      }
     })
  },
  analysis(){
    wx.navigateTo({
      url: '/pages/analysis/index',
    })
  }
})
