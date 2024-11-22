import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actTab:1,
    list:null,
    data: {
      "code": "1",
      "accountCode": "13333333333",
      "userName": "李文强",
      "phone": "13333333333",
      "school": "哈尔滨第三中学",
      "gradeClass": "初三2班",
      "schoolId": "1",
      "cityId": "1",
      "city": "黑龙江哈尔滨",
      "avatar": "http://dfppic.oss-cn-beijing.aliyuncs.com/avatars/6d6b832e-161b-4fe7-ad34-ce658e0446de.png?Expires=1732267481&OSSAccessKeyId=LTAI5tHmqekCi59JKQHgyzgE&Signature=NbKKP8Qp65d85rVsoYFrImiMPNM%3D",
      "yesterdayInfo": {
        "learnDate": 60,
        "weaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数",
            "frequency": 1
          }
        ],
        "cancelWeaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数",
            "frequency": 1
          }
        ],
        "examinationList": [
          {
            "subject": '数学',
            "examId": "1",
            "examName": "2023湖南高考模拟一卷",
            "type": 1,
            "operaLongTime": 30,
            "translate": 80,
            "ranking": 1
          },
        ]
      },
      "lastWeekInfo": {
        "learnDate": 330,
        "weaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值1",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域1",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数1",
            "frequency": 1
          }
        ],
        "cancelWeaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值1",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域1",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数1",
            "frequency": 1
          }
        ],
        "examinationList": [
          {
            "subject": '数学',
            "examId": "1",
            "examName": "2023湖南高考模拟一卷",
            "type": 1,
            "operaLongTime": 30,
            "translate": 80,
            "ranking": 1
          },
          {
            "subject": '数学',
            "examId": "1",
            "examName": "2023湖南高考模拟一卷",
            "type": 1,
            "operaLongTime": 30,
            "translate": 80,
            "ranking": 1
          },
          {
            "subject": '数学',
            "examId": "1",
            "examName": "2023湖南高考模拟一卷",
            "type": 1,
            "operaLongTime": 30,
            "translate": 80,
            "ranking": 1
          },
        ]
      },
      "lastMonthInfo": {
        "learnDate": 1220,
        "weaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值2",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域2",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数2",
            "frequency": 1
          }
        ],
        "cancelWeaknessList": [
          {
            "pointId": "1",
            "pointName": "绝对值2",
            "frequency": 2
          },
          {
            "pointId": "2",
            "pointName": "作用域2",
            "frequency": 10
          },
          {
            "pointId": "3",
            "pointName": "三角函数2",
            "frequency": 1
          }
        ],
        "examinationList": [
          {
            "subject": '数学',
            "examId": "1",
            "examName": "2024湖南高考英语模拟2卷",
            "type": 1,
            "operaLongTime": 30,
            "translate": 80,
            "ranking": 1
          },
        ]
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.dir(this.data.data)
    request('/v1/learn/user/total', 'POST', {
      "parentCode": wx.getStorageSync('openid'),
      "userCode": wx.getStorageSync('userCode')
    })
    .then((res) => {
      console.log('POST 请求成功：', res);
      if(res.data){
        this.setData({
          list:res.data
        })
      }else{
        this.setData({
          list:this.data.data.yesterdayInfo
        })
      }
    })
    .catch((error) => {
      console.error('POST 请求失败：', error);
    });
  },
  selectTab(event) {
    const selectedItem = event.currentTarget.dataset.item;
    if(selectedItem == 1){
      this.setData({
        actTab:selectedItem,
        list:this.data.data.yesterdayInfo
      })
      console.dir(selectedItem)
    }else if(selectedItem == 2){
      this.setData({
        actTab:selectedItem,
        list:this.data.data.lastWeekInfo
      })
    }else if(selectedItem == 3){
      this.setData({
        actTab:selectedItem,
        list:this.data.data.lastMonthInfo
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})