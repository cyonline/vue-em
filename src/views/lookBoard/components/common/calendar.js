function Calendar(year, month, date) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.day = undefined;
    this.dateArr = [];
    this.calendarList = [];
    this.tableData = [];
}

Calendar.prototype.init = function () {
    var today = null;
    if(this.year){
        if(this.month){
            if(this.date){
                today = new Date(this.year+'-'+this.month+'-'+this.date)
            }else{
                today = new Date(this.year+'-'+this.month)
            }
        }else{
            today = new Date(this.year);
        }
    }else{
        today = new Date();
    }
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var weekDay = today.getDay();
    // console.info(year, month, date, weekDay)
    var firstDay = this.getFirsday(year, month);
    // console.info('当月1日星期', firstDay);
    this.dateArr = this.createDate(year, month);
    var curD = this.createCalendar(firstDay);
    var preD = this.getPreMonthDay(year,month, firstDay);
    this.calendarList = [];
    for (var k in preD) {
        this.calendarList.push({
            day: preD[k],
            date: k,
            month: month-1
        })
    }
    for (var k in curD) {
        this.calendarList.push({
            day: curD[k],
            date: k,
            month:month,
        })
    }
    // console.info(this.calendarList)
    // this.tableData = this.createTableData(this.calendarList);
    return this.calendarList;
}
/*
* @description: 根据年和月份生成当月日期
* @params: year(number)年份 month(number)月份
* @return: [1,2,3,4...30]
*/
Calendar.prototype.createDate = function (year, month) {
    var dayCount = 0;
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            dayCount = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            dayCount = 30;
            break;
        case 2:
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                dayCount = 28
            } else {
                dayCount = 29
            }
            break;
    }
    var arr = [];
    for (var i = 0; i < dayCount; i++) {
        arr.push(i + 1);
    }
    return arr;
};
/*
* @description: 获取某年某月第一天的信息
* @params: (number)年，(number)月
* @return: weekDay(number)
*/
Calendar.prototype.getFirsday = function (y, m) {
    var today = new Date(y + '-' + m);
    // var date = today.getDate();
    var weekDay = today.getDay();
    return weekDay
};
/*
* @description: 生成对应的日期，星期
* @params: day(number) 当前月首日对应的星期
* @return: {1: 3, 2: 4, 3: 5, 4: 6, 5: 0,...,29: 3, 30: 4}
*/
Calendar.prototype.createCalendar = function (day) {
    var cMap = {};
    var weekDay = day;
    this.dateArr.forEach(function (ele, index) {
        weekDay = weekDay > 6 ? 0 : weekDay;
        cMap[ele] = weekDay;
        weekDay++;
    })
    // console.info(cMap)
    return cMap;
};
/*
* @description: 补全星期，获取上个月的日期
* @params: month(number) 上个月 day(number):当前月第一天的星期
* @return: {28:0,29:1,30:2}
*/
Calendar.prototype.getPreMonthDay = function (year,month, day) {
    // 获取天数，取结尾的数
    var y = year;
    var m = month-1;
    // 如果当月是1月，上月是去年12月
    if(month==1){
        y = year-1; 
        m = 12;
    }
    var dateArr = this.createDate(y, m);
    // console.info('上月日期', dateArr);
    var dayArr = dateArr.slice(dateArr.length - day, dateArr.length)
    var d = {};
    dayArr.forEach(function (ele, index) {
        d[ele] = index;
    })
    return d;
};

/*
* @description: 将当月日历数据传入，生成日历的二维数组
* @params: [{day,date,weather,}...]
* @return: [[{day,date,weather,}],[{day,date,weather,}]...]
*/
Calendar.prototype.createTableData = function (arr) {
    var tableData = [];
    do {
        tableData.push(arr.splice(0, 7));
    } while (arr.length > 7)
    tableData.push(arr);
    // console.info('talbeData', tableData)
    return tableData;
}


// var c = new Calendar(2021,6,10)
// c.init()

export default Calendar;