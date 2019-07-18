
const db = wx.cloud.database();

Page({

  data: {

  },

  onLoad: function (options) {
    var that = this;

    db.collection("uploadFildtest").get().then(res =>{ 

      console.log(res)

      for(let item of res.data){
        wx.cloud.downloadFile({
          fileID: item.img
      }).then(res => {
            console.log(res)
        that.setData({ img: res.tempFilePath})
        }).catch(error => {
          console.log(error)
        })
      }
    
    }).catch(err =>{ console.log(err) })

  },

  uploadFile(){

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.cloud.uploadFile({

          cloudPath: 'uploadFile',
          filePath: tempFilePaths[0]  //文件路径

        }).then(res => {

          console.log(res);

          if (res.errMsg == 'cloud.uploadFile:ok'){

            db.collection('uploadFildtest').add({

              data:{
                img:res.fileID
              }

            }).then(res =>{ console.log(res) })

            .catch(err =>{ console.log(err) })

          }

        }).catch(err => { console.log(err) })
      }
    })


  }

})