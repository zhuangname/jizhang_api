var that;

Page({

  data: {

    dataList:[],

    date: new Date().getFullYear(),

    end: new Date().getFullYear(),

    yearTotalPrice: { "sryearTotalq": 0, "sryearTotalh": "00", "zcyearTotalq": 0, "zcyearTotalh": "00", "jyq": 0, "jyh": "00" },

    loadingStatus:false,

  },


  onLoad(){

    that = this;

    wx.createSelectorQuery().selectAll(".top-box").boundingClientRect(function (res) {

      that.setData({ navtopBoxHeight: "height:" + res[0].height + "px;" })

    }).exec();

    wx.createSelectorQuery().selectAll(".nav-top-box").boundingClientRect(function (res) {

      that.setData({ navcenterBoxHeight: "height:" + res[0].height + "px;" })

    }).exec();

    that.getdataList();

  },


  getdataList(){

    that.setData({ loadingStatus: false })

    wx.cloud.callFunction({

      name: 'zongji',

      data: {

        year: that.data.date.toString()

      }

    }).then(res => {

      console.log(res)

      var dataList = [];

      for (var i = 1; i <= 12; i++) {

        dataList.push([{ year: that.data.date.toString() + "-" + (i.toString().length == 1 ? "0" + i.toString() : i.toString()) }])

      }


      for (var i in dataList) {

        for (var j in dataList[i]) {

          for (var d in res.result.data) {

            if (res.result.data[d].timeDaty == dataList[i][j].year) {

              dataList[i].push(res.result.data[d])

            }

          }

        }

      }

      var listData = dataList;

      that.fiflerListData(listData);

      console.log(res.result.data)
      console.log(dataList)

    })
      .catch(err => { console.log(err); that.getdataList(); })

  },


  fiflerListData(listData){

    var dataList = listData;

    var arr = [];

    for(let i in dataList){

      if(dataList[i].length !== 1){

        arr.push(dataList[i])

      }

    }

    var yearTotalPrice = { "zcyearTotal": 0, "sryearTotal":0, "jy":0 }

    for (let i in arr){

      var year = arr[i][0].year.split("-");

      arr[i][0].year = year[1];

      arr[i][0].zctotalprice = 0;

      arr[i][0].srtotalprice = 0;

      for(let j in arr[i]){

        if (arr[i][j].dataList !== undefined){

          for(let d in arr[i][j].dataList){

            if (arr[i][j].dataList[d].status == 0){

              yearTotalPrice.zcyearTotal -= Number(arr[i][j].dataList[d].prive);

              arr[i][0].zctotalprice -= Number(arr[i][j].dataList[d].prive);

            }else{

              yearTotalPrice.sryearTotal += Number(arr[i][j].dataList[d].prive);

              arr[i][0].srtotalprice += Number(arr[i][j].dataList[d].prive);

            }

          }

        }

      }

      arr[i][0].srtotalprice = arr[i][0].srtotalprice.toFixed(2);

      arr[i][0].zctotalprice = arr[i][0].zctotalprice.toFixed(2);

      arr[i][0].jytotalprice = (Number(arr[i][0].zctotalprice) + Number(arr[i][0].srtotalprice)).toFixed(2);

    }

    console.log(arr)

    yearTotalPrice.jy = (yearTotalPrice.sryearTotal + yearTotalPrice.zcyearTotal).toFixed(2);

    that.priceq(yearTotalPrice.sryearTotal.toFixed(2), function (q) { that.setData({ ["yearTotalPrice.sryearTotalq"]: q }) })
    that.priceh(yearTotalPrice.sryearTotal.toFixed(2), function (h) { that.setData({ ["yearTotalPrice.sryearTotalh"]: h }) })

    that.priceq(yearTotalPrice.zcyearTotal.toFixed(2), function (q) { that.setData({ ["yearTotalPrice.zcyearTotalq"]: q }) })
    that.priceh(yearTotalPrice.zcyearTotal.toFixed(2), function (h) { that.setData({ ["yearTotalPrice.zcyearTotalh"]: h }) })

    that.priceq(yearTotalPrice.jy, function (q) { that.setData({ ["yearTotalPrice.jyq"]: q }) })
    that.priceh(yearTotalPrice.jy, function (h) { that.setData({ ["yearTotalPrice.jyh"]: h }) })

    this.setData({ dataList: arr })

    that.setData({ loadingStatus: true })

  },


  bindDateChange: function (e) {

    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({ date: e.detail.value })

    that.getdataList();

  },


  onPageScroll(e){

    e.scrollTop > 0 ? this.setData({ nabtopboxStyle: "position:fixed;", h: that.data.navcenterBoxHeight }) : this.setData({ nabtopboxStyle: "", h:'' })

  },


  priceq(num, callback) {

    var str = num.toString();

    var index = str.indexOf(".");

    if (index !== -1) {

      var q = str.substring(0, index);

      callback(q);

    } else {

      var q = str;

      callback(q);

    }

  },


  priceh(num, callback) {

    var str = num.toString();

    var index = str.indexOf(".");

    if (index !== -1) {

      var q = str.substring(index+1, str.length);

      callback(q);

    } else {
      
      if(str == 0)callback("00")

    }

  },


  detailfun(e){

    console.log(e)

    var pages = getCurrentPages();

    var currPage = pages[pages.length - 1];

    var prevPage = pages[pages.length - 2];

    prevPage.setData({ year: that.data.date, month:e.currentTarget.dataset.month })

    prevPage.getDataList();

    setTimeout(() => { wx.navigateBack({ delta: 1 }) },200)

  }


})