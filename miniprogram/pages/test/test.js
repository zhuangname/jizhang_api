const db = wx.cloud.database();

const priveTable = db.collection("priveTable");

var that;

var query;

Page({

  data: {
    
    shuaixuanimg:[
      { "img": "../../images/mr.png", "text": "默认" },
      { "img": "../../images/cy.png", "text": "餐饮" },
      { "img": "../../images/fs.png", "text": "服饰" },
      { "img": "../../images/gw.png", "text": "购物" },
      { "img": "../../images/jt.png", "text": "交通" },
      { "img": "../../images/yj.png", "text": "烟酒" },
      { "img": "../../images/yl.png", "text": "娱乐" },
      { "img": "../../images/gz.png", "text": "工资" },
      { "img": "../../images/qt.png", "text": "其他" },
    ],

    dataList: [],   //数据

    year: new Date().getFullYear(),                 //当前年份

    month: (new Date().getMonth() + 1).toString(),  //当前月份

    q: 0,

    h: 0,

    end: new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString(), //选择时间不能超过当前年月份

    addimgStyle: '',

    menuStyle: '',

    state: false,  //操作滚动条到顶部的状态

    tjimg:'../../images/tj-h.png',

    tjStyle:'',

    mximg:'../../images/rl-h.png',

    mxStyle:'',

    stopPageScroll:''
    
  },

  onReady() {

    wx.createSelectorQuery().selectAll(".bottom-box").boundingClientRect(function (res) {

      that.setData({ BottomBoxHeight: "height:" + res[0].height + "px;" })

    }).exec();

  },


  onShow() {

    this.setData({ tjimg: '../../images/tj-h.png', mximg: '../../images/rl-h.png', mxStyle: '',tjStyle:'' })

    if (this.data.state) { wx.pageScrollTo({ scrollTop: 0 }); this.setData({ state: false }) }

  },


  onLoad(options) {

    that = this;

    that.getDataList();

  },


  getDataList() {                   //获取数据 

    wx.showLoading({ title: '' });  //loading加载

    wx.cloud.callFunction({         //云函数调用

      name: 'getListData',          //云函数名称

      data: {                       //参数为当前年月的数据 （格式：2019-06）
        
        timeDaty: that.data.year + "-" + (that.data.month.length == 1 ? "0" + that.data.month : that.data.month)

      }

    }).then(res => {

      console.log(res)

      var data = res.result.data;

      console.log(data)

      if(data.length !== 0){
        
        var JL = 0;

        for (var i in data) {

          var shouru = 0;

          var zhichu = 0;

          if (data[i].dataList.length !== 0) { 
            
            JL += 1;
            
          }

          if(data.length-1 == i){         //到最后一次循环如果JL=0就删除掉这条数据，因为这条数据里面没有子数据

            if (JL === 0) { priveTable.doc(data[i]._id).remove({}).then(res => { that.getDataList() }).catch(err => { console.log(err) }) }

          }
          
          for (var j in data[i].dataList) {

            if (data[i].dataList[j].status == 0) {

              zhichu -= Number(data[i].dataList[j].prive) //循环算出当天支出总数

            } else {

              shouru += Number(data[i].dataList[j].prive)//循环算出当天收入总数

            }

          }

          data[i].shouru = shouru.toFixed(2);

          data[i].zhichu = zhichu.toFixed(2);

        }

      }

      that.setData({ dataList: data }); //更新视图

      wx.hideLoading();                 //隐藏loading

      that.totalPricefun();             //计算当前月份（总支出）（总收入） //处理金钱格式 如.前面数字变大，后面变小(0.oo)

    }).catch(err => {

      console.log(err);

      wx.hideLoading();

      that.getDataList();

    })

  },


  bindDateChange: function (e) {    //选择日期监听

    var e = e.detail.value;

    var index = e.indexOf("-");

    if (e !== (that.data.year + that.data.month)){  //如果选中的年月跟当前的不相等就重新加载数据

      this.setData({      //跟新选中的年月

        year: e.substring(0, index),            

        month: e.substring(index + 1, e.length)

      })

      this.getDataList(); //重新加载数据

    }

  },


  gettotalzc() {  //算出当前月份总支出金额

    let total = 0;

    for (let item of that.data.dataList) {

      for (let items of item.dataList) {

        if (items.status == 0) {

          total -= Number(items.prive);

        }

      }

    }

    return total.toFixed(2);

  },


  gettotalsr() {  //算出当前月份总收入金额

    let total = 0;

    for (let item of that.data.dataList) {

      for (let items of item.dataList) {

        if (items.status == 1) {

          total += Number(items.prive);

        }

      }

    }

    return total.toFixed(2);

  },


  totalPricefun() { //处理金钱格式 如.前面数字变大，后面变小(0.oo)

    that.priceq(that.gettotalsr(), function (q) { that.setData({ s: q }) });

    that.priceh(that.gettotalsr(), function (h) { that.setData({ r: h }) });

    that.priceq(that.gettotalzc(), function (q) { that.setData({ z: q }) });

    that.priceh(that.gettotalzc(), function (h) { that.setData({ c: h }) });

  },


  addfunc(e) {

    wx.vibrateShort();  //震动

    if (this.data.menuStyle == "") {

      this.setData({ addimgStyle: 'transform: rotate(45deg);', menuStyle: 'transform: rotate(0deg);transition: all .3s;' })

    } else if (this.data.menuStyle == "transform: rotate(0deg);transition: all .3s;") {

      this.setData({ addimgStyle: '', menuStyle: 'transform: rotate(180deg);transition: all .3s;' });

      setTimeout(() => { this.setData({ addimgStyle: '', menuStyle: '' }); }, 300);

    } else {

      console.log("else")

    }

  },


  zcfun(e) {

    wx.navigateTo({ url: 'zc/zc?status=0' });  //跳转记账页面 参数status = 0 是支出的状态

    this.setData({ addimgStyle: '', menuStyle: 'transform: rotate(180deg);transition: all .3s;' });

    setTimeout(() => { this.setData({ addimgStyle: '', menuStyle: '' }); }, 300);

  },


  srfun(e) {

    wx.navigateTo({ url: 'zc/zc?status=1' });   //跳转记账页面 参数status = 1 是收入的状态

    this.setData({ addimgStyle: '', menuStyle: 'transform: rotate(180deg);transition: all .3s;' });

    setTimeout(() => { this.setData({ addimgStyle: '', menuStyle: '' }); }, 300);

  },


  goDetailfun(e) {

    var index = e.currentTarget.dataset.index;

    var _id = e.currentTarget.dataset.id;

    wx.navigateTo({

      url: 'detail/detail?_id=' + _id + '&index=' + index, //跳转详情页 参数是数据的id index是索引，用索引获取该数据的子数据

    })

  },


  priceq(num, callback) {

    var str = num.toString();

    var index = str.indexOf(".");

    if (index !== -1) {

      var q = str.substring(0, index);

      callback(q);

    }

  },


  priceh(num, callback) {

    var str = num.toString();

    var index = str.indexOf(".");

    if (index !== -1) {

      var q = str.substring(index, str.length);

      callback(q);

    }

  },

  
  mxfun(){

    wx.vibrateShort();

    this.setData({ mximg: "../../images/rl.png", mxStyle: 'color: #FADA63;' })

    wx.navigateTo({ url: '../rili/rili' })

  },


  tjfun(){

    wx.vibrateShort();

    this.setData({ tjimg: '../../images/tj.png', tjStyle: 'color: #FADA63;' })

    wx.navigateTo({ url: '../zhangdan/zhangdan' })

  },

  shuaixuanfun(){

    this.setData({ stopPageScroll: "stopPageScroll", shuaixuanboxBottom:'bottom:0' })

  },

  close(){

    this.setData({ stopPageScroll: '', shuaixuanboxBottom: 'bottom:-100%' })

    console.log("执行")

  },


  goimgfun(e){
    console.log(e.currentTarget.dataset.img)
    wx.navigateTo({
      url: '../iconListData/iconListData?img=' + e.currentTarget.dataset.img,
    })
    this.setData({ stopPageScroll: '', shuaixuanboxBottom: 'bottom:-100%' })
  },

  stopPageScroll() { return }

})
