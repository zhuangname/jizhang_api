var oneDay = function (y, m, d){

  var myDate = new Date();
  myDate.setFullYear(y, m - 1, d);
  var week = myDate.getDay()
  switch (week) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
  }

};

var getTime = function(){

    var year = new Date().getFullYear();

    var month = (new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();

    var date = (new Date().getDate()).toString().length == 1 ? "0" + (new Date().getDate()).toString() : (new Date().getDate()).toString()

    var str = year + "-" + month + "-" + date;

    return str;

};


var getTimes = function(stat){

  var year = new Date().getFullYear();

  var month = (new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();

  var date = (new Date().getDate()).toString().length == 1 ? "0" + (new Date().getDate()).toString() : (new Date().getDate()).toString()

  var day = new Date().getDay() == 0 ? "星期日" : new Date().getDay() == 1 ? "星期一" : new Date().getDay() == 2 ? "星期二" : new Date().getDay() == 3 ? "星期三" : new Date().getDay() == 4 ? "星期四" : new Date().getDay() == 5 ? "星期五" : "星期六";

  if (stat == "年月日星期") {

    let str = year + "-" + month + "-" + date + " " + day;

    return str;

  } else if (stat == "年月日") {

    let str = year + "-" + month + "-" + date

    return str;

  } else {

    let str = year + "-" + month;

    return str;

  }

};


var isLastDayOfMonth = function() {
  var flag = new Boolean(false);
  var date = new Date();

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var today = date.getDate();

  var new_year = year; //取当前的年份
  var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {//如果当前大于12月，则年份转到下一年
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天

  var month_last_day = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();

  if (today == month_last_day) {
    flag = true;
  }
  return flag;
}


module.exports = {

  oneDay,

  getTime,

  getTimes,

  isLastDayOfMonth
  
}

//console.log(oneDay.oneDay("2019", "06", "09"))