const db = wx.cloud.database();

const priveTable = db.collection("priveTable");

//var getTimes = require("../../uits/uits.js")

import { getTimes } from "../../uits/uits.js";

var that;

Page({

  data: {

    listData:[],

    active01:'active',

    active0:'',

    end: new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString(), //选择时间不能超过当前年月份

    date: new Date().getFullYear() + "-" + ((new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString()), 

  },

  onLoad: function (options) {

    this.setData({ options:options })

    that = this;

    this.geticonListData(this.data.options.img);

    if (this.data.date == getTimes()){
      this.setData({ date:'本月' })
    }

  },

  geticonListData(icon){
    
    wx.cloud.callFunction({

      name:'allDataList'

    }).then(res =>{

      console.log(res)

      var iconList = [];

      for(var i in res.result.data){

        for (var j in res.result.data[i].dataList){

          if (res.result.data[i].dataList[j].icon == icon){

            // res.result.data[i].dataList.splice(j,1);
            
            res.result.data[i].dataList[j].createdTime = res.result.data[i].createdTime;

            res.result.data[i].dataList[j].timeDaty = res.result.data[i].timeDaty;
            
            res.result.data[i].dataList[j].year = res.result.data[i].year

            iconList.push(res.result.data[i].dataList[j])

          }

        }

      }

      console.log(iconList);

      var listData = [];

      for(let item of iconList){
        if(that.data.date == "本月"){
          if(item.timeDaty == getTimes()){
            listData.push(item)
          }
        }else{
          if (item.timeDaty == that.data.date) {
            listData.push(item)
          }
        }
      }


      for(var i=1; i<listData.length; i++){  //大到小排序

        var item = listData[i];
        var j = i-1;
        
        while (j > -1 && Number(listData[j].prive) < Number(item.prive)){
          listData[j + 1] = listData[j];
          j--;
        }
        listData[j + 1] = item;

      }

      console.log(listData)


      var zc = 0;
      var sr = 0;
      for(let item of listData){
        if(item.status == 0){
          zc -= Number(item.prive);
        }else{
          sr += Number(item.prive);
        }
      }

      that.setData({ listData: listData, zc: zc.toFixed(2), sr: sr.toFixed(2) })

      console.log(this.data.zc,this.data.sr)

    }).catch(err =>{ console.log(err) })

  },


  shourufun() {

    this.setData({

      active01: "active",

      active02: ""

    })

  },


  zhichufun() {

    this.setData({

      active01: "",

      active02: "active",

    })

  },


  bindDateChange: function (e) { 
  
    if (e.detail.value == getTimes()){
      
      this.setData({ date:'本月' })

    }else{

      this.setData({ date: e.detail.value }) 

    }

    this.geticonListData(this.data.options.img);
    
  },


})