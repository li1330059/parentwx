const request = (url, method, data = {}, customHeaders = {}) => {
    // 获取用户 openid
    const openid = wx.getStorageSync('openid') || ''; 
  
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://vid.duofenpai.com:15002'+url,
        method: method,
        data: data,
        timeout: 30000,
        header: {
          'Content-Type': 'application/json', // 默认头部
          'userCode': openid, // 携带 openid
          ...customHeaders, // 合并自定义头部
        },
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            console.error('接口错误：', res);
            reject(res.data);
          }
        },
        fail(err) {
          wx.showToast({
            title: '连接超时，请重试',
          })
          console.error('请求失败：', err);
          reject(err);
        }
      });
    });
  };
  
  // 导出请求函数
  export default request;
  