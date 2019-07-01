
var that = this;

Page({

  data: {

    keyworddata:{
      keyword1: { value: '支出' },//记账类型
      keyword2: { value: '5000' },//金额
      keyword3: { value: '模板测试' },//原因备注
      keyword4: { value: '2019-06-30 14:31:54' },//记账时间
    }

  },

  onLoad(){
    that = this;
  },

  bindsubmit(e){

    var formid = e.detail.formId;

    wx.cloud.callFunction({

      name:'moban',

      data:{

        data: that.data.keyworddata,

        formId: formid

      }

    }).then(res =>{ console.log(res) })
    .catch(err =>{ console.log(err) })

  }

})