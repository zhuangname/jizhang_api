

const oneDay = require('../../../uits/uits.js');

const db = wx.cloud.database();

const _ = db.command;

const priveTable = db.collection("priveTable");

var that;

Page({

  data: {

    formData: [

      { type: "text", label: "备注", name: "remark", labelStyle: "", inputStyle: '', changeEven: "changeremark", value: '' },

      { type: "digit", label: "金额", name: "price", labelStyle: "", inputStyle: '', changeEven: "changeremark", value: '' }

    ],

    btnlodingstatue: false,

    iconStatus0: [],

    idx: 0,

    end: new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString() + "-" + (new Date().getDate()).toString(),

    date:'',

    formSubmit:"formSubmit"

  },


  onLoad(options) {

    that = this;

    console.log(options)

    that.setData({ options: options });

  },


  onReady(){

    priveTable.doc(that.data.options._id).get()
    .then(res =>{

      var data = res.data.dataList[that.data.options.index];

      if(data.status == 0){

        that.setData({ active01: "", active02: "active", })

        that.setData({

        iconStatus0: [

          { src: '../../../images/mr.png', title: '默认', name: 'mr.png' },

          { src: '../../../images/cy.png', title: '餐饮', name: 'cy.png' },

          { src: '../../../images/fs.png', title: '服饰', name: 'fs.png' },

          { src: '../../../images/gw.png', title: '购物', name: 'gw.png' },

          { src: '../../../images/jt.png', title: '交通', name: 'jt.png' },

          { src: '../../../images/yj.png', title: '烟酒', name: 'yj.png' },

          { src: '../../../images/yl.png', title: '娱乐', name: 'yl.png' },

          { src: '../../../images/qt.png', title: '其他', name: 'qt.png' }

        ]

      })

      }else{

        that.setData({ active01: "active", active02: "", })

        that.setData({

        iconStatus0: [

          { src: '../../../images/mr.png', title: '默认', name: 'mr.png' },

          { src: '../../../images/gz.png', title: '工资', name: 'gz.png' },

          { src: '../../../images/qt.png', title: '其他', name: 'qt.png' }

        ]

      })

      }

      for(var i in that.data.iconStatus0){

        if(data.icon.indexOf(that.data.iconStatus0.name) !== -1){

          that.setData({ idx:i })

        }

      }

      var str = res.data.createdTime.split(" ");

      var ymd = str[0];

      that.setData({ 

        dataList:res.data.dataList,

        data:data,

        'formData[0].value': data.remark, 
        
        'formData[1].value': data.prive,
        
        'formData[0].labelStyle': 'font-size:26rpx; top:20rpx;', 'formData[0].inputStyle': 'top:26rpx;' ,
        
        'formData[1].labelStyle': 'font-size:26rpx; top:20rpx;', 'formData[1].inputStyle': 'top:26rpx;' ,

        date: ymd == oneDay.getTime() ? "今天" : ymd,

        createdTime: res.data.createdTime,

        year: res.data.year,

        YM: res.data.timeDaty

      });

    }).catch(err =>{ console.log(err); });

  },


  changeremark(e) {

    var value = e.detail.value;

    var index = e.currentTarget.dataset.index;

    var formData = that.data.formData;

    if (value == "") {

      this.setData({

        ["formData[" + index + "].labelStyle"]: "",

        ["formData[" + index + "].inputStyle"]: ""

      });

    } else {

      for (var item of formData) {

        item.labelStyle = ""

      }

      this.setData({

        ["formData[" + index + "].labelStyle"]: "font-size:26rpx; top:20rpx;",

        ["formData[" + index + "].inputStyle"]: "top:26rpx;"

      });

    }

  },


  formSubmit(e) {

    console.log(that.data);

    var e = e.detail.value;

    if (e.remark !== "" || e.price !== "") {

      that.setData({ btnlodingstatue: true, formSubmit:'' });

      that.data.dataList[that.data.options.index].status = that.data.active01 !== "" ? "1" : "0";

      that.data.dataList[that.data.options.index].prive = e.price;

      that.data.dataList[that.data.options.index].remark = e.remark;

      that.data.dataList[that.data.options.index].icon = "../../images/"+that.data.iconStatus0[that.data.idx].name;

      that.setData({ dataList: that.data.dataList });

      that.addfun(that.data.options._id, that.data.dataList);

    }

  },


  getTime() {

    var year = new Date().getFullYear();

    var month = (new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();

    var date = (new Date().getDate()).toString().length == 1 ? "0" + (new Date().getDate()).toString() : (new Date().getDate()).toString()

    var day = new Date().getDay() == 0 ? "星期日" : new Date().getDay() == 1 ? "星期一" : new Date().getDay() == 2 ? "星期二" : new Date().getDay() == 3 ? "星期三" : new Date().getDay() == 4 ? "星期四" : new Date().getDay() == 5 ? "星期五" : "星期六";

    var str = year + "-" + month + "-" + date + " " + day;

    return str;

  },

  
  addfun(_id, obj) {

    console.log(obj)

    var datalist = obj;

    var addData = datalist.splice(that.data.options.index,1)

    console.log(datalist)

    priveTable.doc(_id).update({

      data:{

        dataList: datalist

      }

    }).then(res =>{ }).catch(err =>{ console.log(err) })

    
    wx.cloud.callFunction({

      name: 'addListData',

      data: {

        createdTime: that.data.createdTime

      }

    }).then(res => {

      console.log(res);

      if (res.result.data.length == 0) {

        priveTable.add({

          data: {

            createdTime: that.data.createdTime,

            timeDaty: that.data.YM,

            year: that.data.year,

            dataList: addData

          }

        }).then(res => {

          if (res.errMsg == "collection.add:ok") {

            that.setData({ btnlodingstatue: false });

            wx.showToast({

              title: '修改成功',

              icon: 'none',

              mask: true

            });

            setTimeout(() => { wx.navigateBack({ delta: 2 }) }, 500)

            var pages = getCurrentPages();

            var currPage = pages[pages.length - 1];

            var prevPage = pages[pages.length - 3];

            var prevPage4 = pages[pages.length - 4];

            console.log(prevPage)

            if (prevPage4 !== undefined) prevPage4.getDataList();

            prevPage.getDataList(that.data.options.createdTime);

          } else {

            wx.showToast({

              title: '修改失败',

              icon: 'none',

              mask: true

            });

          }

        }).catch(err => { console.log(err) })

      }else{

        priveTable.doc(res.result.data[0]._id).update({

          data:{

            dataList: _.unshift(addData)

          }

        }).then(res =>{

          console.log(res)

          if (res.errMsg == "document.update:ok"){

            that.setData({ btnlodingstatue: false });

            wx.showToast({

              title: '修改成功',

              icon: 'none',

              mask: true

            });

            setTimeout(() => { wx.navigateBack({ delta: 2 }) }, 500)

            var pages = getCurrentPages();

            var currPage = pages[pages.length - 1];

            var prevPage = pages[pages.length - 3];

            var prevPage4 = pages[pages.length - 4];

            if (prevPage4 !== undefined) prevPage4.getDataList(); 

            console.log(prevPage)

            prevPage.getDataList(that.data.options.createdTime);

          }else{

            wx.showToast({

              title: '修改失败',

              icon: 'none',

              mask: true

            });

          }

        }).catch(err => { console.log(err) })

      }

    }).catch(err =>{ console.log(err) })

  },


  shourufun(){ 
    
    this.setData({ 
      
      active01: "active", 
      
      active02: "", 

      iconStatus0: [

        { src: '../../../images/mr.png', title: '默认', name: 'mr.png' },

        { src: '../../../images/gz.png', title: '工资', name: 'gz.png' },

        { src: '../../../images/qt.png', title: '其他', name: 'qt.png' }

      ],

      idx: 0
      
    }) 
    
  },


  zhichufun(){ 
    
    this.setData({ 
      
      active01: "", 
      
      active02: "active", 

      iconStatus0: [

        { src: '../../../images/mr.png', title: '默认', name: 'mr.png' },

        { src: '../../../images/cy.png', title: '餐饮', name: 'cy.png' },

        { src: '../../../images/fs.png', title: '服饰', name: 'fs.png' },

        { src: '../../../images/gw.png', title: '购物', name: 'gw.png' },

        { src: '../../../images/jt.png', title: '交通', name: 'jt.png' },

        { src: '../../../images/yj.png', title: '烟酒', name: 'yj.png' },

        { src: '../../../images/yl.png', title: '娱乐', name: 'yl.png' },

        { src: '../../../images/qt.png', title: '其他', name: 'qt.png' }

      ],

      idx: 0
      
    }) 
    
  },


  imgfun(e) {

    var e = e.currentTarget.dataset.index;

    this.setData({ idx: e })

  },


  bindDateChange: function (e) {

    var value = e.detail.value;

    if (value == oneDay.getTime()) {

      this.setData({ date: '今天' });

    } else {

      this.setData({ date: value })

    }

    var YM = value.split("-");

    this.setData({

      createdTime: value + " " + oneDay.oneDay(YM[0], YM[1], YM[2]),

      YM: YM[0] + "-" + YM[1],

      year: YM[0]

    });

  },

})