// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onLoad(){
    let that = this;
    wx.login({
        success (res) {
          if (res.code) {
              console.log(res.code)
              //发起网络请求
                wx.request({
                    url: 'https://dfp.bluebirdabc.com:15002/v1/external/info',
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
                        that.socketFun();
                    }
                })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
  },
  qrcode(){
    wx.scanCode({
        success (res) {
          console.log(res);
        }
      });
  },
  socketFun() {
      console.log(111)
    const socketTask = wx.connectSocket({
      url: 'wss://dfp.bluebirdabc.com/websocket', // 替换为实际地址
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

    this.socketTask = socketTask;
  },
  sendRequest() {
    if (this.data.socketOpen) {
      this.socketTask.send({
        data: 'trigger_capture',
      });
      console.log('触发消息已发送');
    } else {
      console.log('WebSocket 未连接');
    }
  },
//   bindViewTap() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onChooseAvatar(e) {
//     const { avatarUrl } = e.detail
//     const { nickName } = this.data.userInfo
//     this.setData({
//       "userInfo.avatarUrl": avatarUrl,
//       hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
//     })
//   },
//   onInputChange(e) {
//     const nickName = e.detail.value
//     const { avatarUrl } = this.data.userInfo
//     this.setData({
//       "userInfo.nickName": nickName,
//       hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
//     })
//   },
//   getUserProfile(e) {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res)
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     })
//   },
})
