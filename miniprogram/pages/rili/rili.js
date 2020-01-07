const oneDay = require('../../uits/uits.js');

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [],

    dataList:[],

    active:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    that = this;

  },

  onReady(){

    this.getAllDataList();

    //this.getDataList(this.data.createdTime)

  },
  /**
  * 日历是否被打开
  */
  bindselect(e) {
    console.log(e.detail.ischeck)
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {

    let time = e.detail;

    console.log(time)

    that.setData({ active: '', createdTime: time.year + "-" + time.month + "-" + time.date + " " + oneDay.oneDay(time.year, time.month, time.date) })

    wx.showLoading({ title: '' })

    console.log("执行")

    wx.cloud.callFunction({

      name: 'addListData',

      data: {

        createdTime: that.data.createdTime

      }

    }).then(res => {

      console.log(res)

      wx.hideLoading();

      var data = res.result.data;

      if (data.length !== 0) {

        data[0].zctotalprice = 0;

        data[0].sctotalprice = 0;

        for (var i in data[0].dataList) {

          data[0].dataList[i].prive = Number(data[0].dataList[i].prive);

          if (data[0].dataList[i].status == 0) {

            data[0].zctotalprice -= data[0].dataList[i].prive;

          } else {

            data[0].sctotalprice += data[0].dataList[i].prive;

          }

        }

        data[0].zctotalprice = data[0].zctotalprice.toFixed(2);

        data[0].sctotalprice = data[0].sctotalprice.toFixed(2);

        that.setData({ dataList: data })

      } else {

        that.setData({ dataList: [] })

      };

      setTimeout(() => { that.setData({ active: 'active' }) }, 300);

      console.log(this.data.dataList)

    }).catch(err => { console.log(err); wx.hideLoading(); })

  },


  goDetailfun(e) {

    var index = e.currentTarget.dataset.index;

    var _id = e.currentTarget.dataset.id;

    wx.navigateTo({

      url: '../test/detail/detail?_id=' + _id + '&index=' + index + "&createdTime=" + that.data.createdTime,

    })

  },
  

  getDataList(createdTime){

    console.log(createdTime)
    
    this.getAllDataList();

  },


  getAllDataList(){

    wx.cloud.callFunction({

      name:'allDataList'

    }).then(res =>{

      console.log(res)

      var data = res.result.data;

      var selected = [];

      for(var i in data){

        var index = data[i].createdTime.indexOf(" ");

        data[i].createdTime = data[i].createdTime.substring(0,index);

        var obj = {};

        obj.date = data[i].createdTime;

        if (data[i].dataList.length !== 0) selected.push(obj);

      }

      that.setData({ selected: selected })

    }).catch(err =>{ console.log(err) })

  }
})