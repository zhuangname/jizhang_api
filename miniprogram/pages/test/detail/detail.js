const db = wx.cloud.database();

const priveTable = db.collection("priveTable");

var that;

Page({

  data: {

  },

  onLoad: function (options) {

    console.log(options)

    that = this;

    this.setData({ options:options })

  },

  onShow(){

    this.getdataList();

  },


  getdataList(){

    priveTable.doc(that.data.options._id).get()
    .then(res =>{

      console.log(res.data.dataList)

      that.setData({ listData:res.data});

    }).catch(err =>{ console.log(err) })

  },


  deletefun(){

    wx.showModal({

      title: '确认删除',

      content: '删除后数据不可恢复!',

      confirmColor:'#F80C02',

      success(res) {

        if (res.confirm) {

          var index = Number(that.data.options.index);

          that.data.listData.dataList.splice(index,1);

          priveTable.doc(that.data.options._id).update({

            data: {

              dataList: that.data.listData.dataList

            }

          }).then(res => {

            if (res.errMsg == "document.update:ok") {

              setTimeout(() => { wx.navigateBack({ delta: 1 }) }, 500);

              var pages = getCurrentPages();

              var currPage = pages[pages.length - 1];

              var prevPage = pages[pages.length - 2];

              var prevPage3 = pages[pages.length - 3];

              if (prevPage3 !== undefined) prevPage3.getDataList();

              prevPage.getDataList(that.data.options.createdTime);

            } else {

              wx.showToast({

                title: '删除失败',

                icon: 'none',

                mask: true

              });

            }

          }).catch(err => {

            console.log(err)

          })

        }

      }
      
    })

  },


  exitfun(){

    wx.navigateTo({

      url: '../exit/exit?_id=' + that.data.options._id + '&index=' + that.data.options.index + "&createdTime=" + that.data.options.createdTime,

    })

  }

})