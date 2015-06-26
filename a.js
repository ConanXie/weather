var Weather = {
    nodeData: {},
    date: '',
    cityname: '',
    weatherData: null,
    dragObject: null,
    dragIndex: null,
    dropIndex: null
};
/*拖拽*/
Weather.dragStartHandler = function (event) {
    this.dragObject = event.target;
    this.dragIndex = Number(event.target.id.slice(6));
};
Weather.dragEnterHandler = function (event) {
    event.preventDefault();
    this.dropIndex = Number(event.target.id.slice(6));
};
Weather.dragOverHandler = function (event) {
    event.preventDefault();
};
Weather.dropHandler = function (event) {
    var editbox = this.nodeData.editbox;
    var dragIndex = this.dragIndex;
    var dropIndex = this.dropIndex;
    var dragObject = this.dragObject;
    if (dragIndex > dropIndex) {
        editbox.insertBefore(dragObject, editbox.childNodes[dropIndex + 4]);
    } else if (dragIndex < dropIndex) {
        editbox.insertBefore(dragObject, editbox.childNodes[dropIndex + 5]);
    } else {
        return;
    }
    for (var i = 6; i < editbox.childNodes.length - 1; i++) {
        editbox.childNodes[i].id = 'delete' + (i - 4);
        editbox.childNodes[i].firstChild.id = 'span' + (i - 4);
    }
};
Weather.initNode = function () {
    /*查询所有的页面元素*/
    var city = document.querySelector('#city'),
        realtemperature = document.querySelector('#realtemperature'),
        t_p = document.querySelector('#t_p'),
        pm25box = document.querySelector('#pm25box'),
        pm25text = document.querySelector('#pm25text'),
        pm25canvas = document.querySelector('#pm25canvas'),
        today = document.querySelector('#today'),
        tomorrow = document.querySelector('#tomorrow'),
        aftertomorrow = document.querySelector('#aftertomorrow'),
        threedays = document.querySelector('#threedays'),
        todaydate = document.querySelector('#todaydate'),
        todayimg = document.querySelector('#todayimg'),
        todayweather = document.querySelector('#todayweather'),
        todaywind = document.querySelector('#todaywind'),
        todaytemperature = document.querySelector('#todaytemperature'),
        tomorrowdate = document.querySelector('#tomorrowdate'),
        tomorrowimg = document.querySelector('#tomorrowimg'),
        tomorrowweather = document.querySelector('#tomorrowweather'),
        tomorrowwind = document.querySelector('#tomorrowwind'),
        tomorrowtemperature = document.querySelector('#tomorrowtemperature'),
        aftertomorrowdate = document.querySelector('#aftertomorrowdate'),
        aftertomorrowimg = document.querySelector('#aftertomorrowimg'),
        aftertomorrowweather = document.querySelector('#aftertomorrowweather'),
        aftertomorrowwind = document.querySelector('#aftertomorrowwind'),
        aftertomorrowtemperature = document.querySelector('#aftertomorrowtemperature'),
        threedaysdate = document.querySelector('#threedaysdate'),
        threedaysimg = document.querySelector('#threedaysimg'),
        threedaysweather = document.querySelector('#threedaysweather'),
        threedayswind = document.querySelector('#threedayswind'),
        threedaystemperature = document.querySelector('#threedaystemperature'),
        inputcity = document.querySelector('#inputcity'),
        submit = document.querySelector('#submit'),
        citybox = document.querySelector('#citybox'),
        editbutton = document.querySelector('#editbutton'),
        editbox = document.querySelector('#editbox'),
        add = document.querySelector('#add'),
        cancel = document.querySelector('#cancel'),
        confirm = document.querySelector('#confirm'),
        citylist = document.getElementsByClassName('citylist'),
        deletelist = document.getElementsByClassName('deletelist'),
        addbox = document.querySelector('#addbox'),
        addcity = document.querySelector('#addcity'),
        addbutton = document.querySelector('#addbutton'),
        cancelbutton = document.querySelector('#cancelbutton'),
        trendcanvas = document.querySelector('#trendcanvas');
    this.nodeData = {
        date: [todaydate, tomorrowdate, aftertomorrowdate, threedaysdate],
        weather: [todayweather, tomorrowweather, aftertomorrowweather, threedaysweather],
        wind: [todaywind, tomorrowwind, aftertomorrowwind, threedayswind],
        temperature: [todaytemperature, tomorrowtemperature, aftertomorrowtemperature, threedaystemperature],
        image: [todayimg, tomorrowimg, aftertomorrowimg, threedaysimg],
        daybox: [today, tomorrow, aftertomorrow, threedays],
        city: city,
        realtemperature: realtemperature,
        t_p: t_p,
        pm25box: pm25box,
        pm25text: pm25text,
        pm25canvas: pm25canvas,
        inputcity: inputcity,
        submit: submit,
        citybox: citybox,
        editbutton: editbutton,
        editbox: editbox,
        cancel: cancel,
        confirm: confirm,
        citylist: citylist,
        deletelist: deletelist,
        add: add,
        addbox: addbox,
        addcity: addcity,
        addbutton: addbutton,
        cancelbutton: cancelbutton,
        trendcanvas: trendcanvas,
    };
    this.bindEvent();
};
Weather.sendCityName = function (cityname, direction) { // Ajax
    if (cityname == this.nodeData.city.innerHTML && cityname != '' && direction != 'load')  { // 阻止重复提交
        return;
    }
    var that = this;
    this.cityName = cityname;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () { // 处理返回数据
        if (xhr.readyState == 1) {
            if (direction == 'load') { // 显示加载动画
                $('#loadingbox').css('display', 'block');
            } else {
                $('#cityloading').css('display', 'block');
            }
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            // console.log(xhr.responseText);
            if (direction == 'load') {
                $('#loadingbox').css('display', 'none');
                that.weatherData = JSON.parse(xhr.responseText);
                if (that.weatherData.error == -3) {
                    alert("列表中的某些城市不存在！");
                    return;
                }
            } else {
                $('#cityloading').css('display', 'none');
                var queryData = JSON.parse(xhr.responseText);
                if (queryData.error == -3) {
                    alert("该城市不存在！");
                    return;
                }
                that.date = queryData.date; // 获取时间
                that.animate.detailhide(that.nodeData);
                that.updatePage(queryData.results[0]);
            }
        }
    };
    xhr.open('post', 'weather.php', true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    xhr.send('r=' + Math.random() + '&city=' + cityname);
};
Weather.updatePage = function (weatherData) {
    var dateData = this.calDate(this.date), // 计算日期
        realData = weatherData.weather_data[0].date, // 获取实时数据
        currentCity = weatherData.currentCity;
    if (/[市县]/.test(currentCity)) {
        currentCity = currentCity.slice(0, currentCity.length - 1);
    }
    this.nodeData.city.innerHTML = currentCity; // 显示当前城市
    var weatherImage = [],
        weatherText,
        weekData = [],
        realtext = '',
        day,
        night;
    weatherImage[0] = [];
    weatherImage[1] = [];
    for (var i = 0, len = weatherData.weather_data.length; i < len; i++) {
        var dayPictureUrl = weatherData.weather_data[i].dayPictureUrl,
            nightPictureUrl = weatherData.weather_data[i].nightPictureUrl;
        weatherImage[0][i] = dayPictureUrl.slice(dayPictureUrl.lastIndexOf('/') + 1);
        weatherImage[1][i] = nightPictureUrl.slice(nightPictureUrl.lastIndexOf('/') + 1);
    }
    if (/\：/.test(realData)) { // 解析实时温度
        realtext = realData.slice(realData.lastIndexOf('(') + 4, realData.lastIndexOf(')')-1) + '°';
        realtemperature.innerHTML = realtext;
    } else {
        realtemperature.innerHTML = '*';
    }
    if (weatherData.pm25 == '') { // 解析并绘画pm2.5图形
        pm25text.innerHTML = '*';
        pm25text.style.top = '55%';
        this.drawPM25(-1);
    } else {
        pm25text.innerHTML = weatherData.pm25;
        pm25text.style.top = '45%';
        this.drawPM25(weatherData.pm25);
    }
    var time = new Date().getHours(),
        flag;
    if (time >= 18 || time <= 6) {
        time = 1;
        flag = 'night/';
    } else {
        time = 0;
        flag = 'day/';
    }
    for (i = 0, len = this.nodeData.date.length; i < len; i++) { // 更新天气详情
        weekData[i] = weatherData.weather_data[i].date.slice(0, 2);
        this.nodeData.date[i].innerHTML = dateData[i][0] + '/' + dateData[i][1] + ' ' + weekData[i];
        this.nodeData.weather[i].innerHTML = weatherData.weather_data[i].weather;
        this.nodeData.wind[i].innerHTML = weatherData.weather_data[i].wind;
        this.nodeData.temperature[i].innerHTML = weatherData.weather_data[i].temperature.slice(0, weatherData.weather_data[i].temperature.length - 1) + '°';
        this.nodeData.image[i].style.background = 'url(img/' + flag + weatherImage[time][i] + ') no-repeat center center';
        this.nodeData.image[i].style.backgroundSize = '40%';
    }
    this.animate.detailshow(this.nodeData); // 页面动画
    if (weatherData.index == '') { // 更新指数
        for (i = 0, len = $('.indexdetail').length; i < len; i++) {
            var indexText = weatherData.index[i];
            $('.indexdetail')[i].childNodes[1].childNodes[3].innerHTML = '无';
            $('.indexdetail')[i].childNodes[3].innerHTML = '';
        }
    } else {
        for (i = 0, len = $('.indexdetail').length; i < len; i++) {
            var indexText = weatherData.index[i];
            $('.indexdetail')[i].childNodes[1].childNodes[3].innerHTML = indexText.zs;
            $('.indexdetail')[i].childNodes[3].innerHTML = indexText.des;
        }
    }
    var trendData = [], // 趋势数据
        weather = [],
        trendText,
        weatherText;
    for (i = 0, len = weatherData.weather_data.length; i < len; i++) {
        trendText = weatherData.weather_data[i].temperature;
        weatherText = weatherData.weather_data[i].weather;
        trendData[i] = [];
        weather[i] = [];
        if (/\~/.test(trendText)) {
            trendData[i][0] = trendText.slice(0, trendText.indexOf('~') - 1);
            trendData[i][1] = trendText.slice(trendText.indexOf('~') + 2, trendText.length - 1);
        }else if (realtext != '') {
            trendData[i][0] = realtext.slice(0, realtext.length - 1);
            trendData[i][1] = trendText.slice(0, trendText.length - 1);
            if (trendData[i][0]*1 < trendData[i][1]*1) {
                var temp = trendData[i][0];
                trendData[i][0] = trendData[i][1];
                trendData[i][1] = temp;
            }
        } else {
            trendData[i][0] = trendText.slice(0, trendText.length - 1);
            trendData[i][1] = trendData[i][0];
        }
        if (/\转/.test(weatherText)) {
            weather[i][0] = weatherText.slice(0, weatherText.indexOf('转'));
            weather[i][1] = weatherText.slice(weatherText.indexOf('转') + 1);
        } else {
            weather[i][0] = weatherText;
            weather[i][1] = weatherText;
        }
    }
    t_p.innerHTML = weather[0][0] + ' | ' + t_p.innerHTML;
    trendData.push(weather);
    trendData.push(dateData);
    trendData.push(weekData);
    this.drawTrend(trendData);
    if (this.cityName == '') {
        var localCity = JSON.parse(localStorage.getItem('cityArray')),
            temp;
        temp = localCity[0];
        localCity[0] = currentCity;
        for (i = 1, len = localCity.length; i < len; i++) {
            if (localCity[0].slice(0, 2) == localCity[i].slice(0, 2)) {
                localCity[i] = temp;
            }
        }
        this.sendCityName(localCity.join('|'), 'load');
        localStorage.setItem('cityArray', JSON.stringify(localCity));
        this.createCityList(localCity);
    }
};
Weather.drawPM25 = function (pm25) {
    var canvas = this.nodeData.pm25canvas,
        t_p = this.nodeData.t_p,
        ctx = canvas.getContext('2d'),
        box = {
            width: canvas.width,
            height: canvas.height
        },
        radius = 100,
        beginAngle = -Math.PI/2 - Math.PI*6/7,
        begin = beginAngle,
        finish,
        increment = 0,
        strokeStyle,
        imageData;
    function animation() {
        ctx.putImageData(imageData, 0, 0);
        ctx.save();
        ctx.beginPath();
        ctx.translate(box.width/2, box.height/2);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 12;
        ctx.arc(0, 0, radius, beginAngle, begin, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        begin += increment;
        if (beginAngle - (beginAngle - finish)/2 > begin) {
            increment += 0.003;
        } else {
            increment -= 0.0028;
        }
        if (increment < 0) {
            increment = -increment;
        }
        if (begin < finish) {
            window.requestAnimationFrame(animation);
        } else {
            return;
        }
    }
    ctx.clearRect(0, 0, box.width, box.height);
    ctx.save();
    ctx.translate(box.width/2, box.height/2);
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#fff';
    ctx.textAlign = "center";
    ctx.lineWidth = 12;
    ctx.arc(0, 0, radius, 0, 2*Math.PI, true);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.arc(0, 0, radius + 19, beginAngle, -Math.PI/2 + Math.PI*6/7, false);
    ctx.moveTo(-radius*Math.sin(Math.PI/7), radius*Math.cos(Math.PI/7));
    ctx.lineTo(-(radius + 19)*Math.sin(Math.PI/7), (radius + 19)*Math.cos(Math.PI/7));
    ctx.moveTo(radius*Math.sin(Math.PI/7), radius*Math.cos(Math.PI/7));
    ctx.lineTo((radius + 19)*Math.sin(Math.PI/7), (radius + 19)*Math.cos(Math.PI/7));
    ctx.stroke();
    ctx.font = "normal 10px 黑体-繁";
    ctx.fillText('PM2.5', 0, box.width/2 - 2);
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "normal 18px 黑体-繁";
    if (pm25 == -1) {
        ctx.restore();
        return;
    }else if (pm25 <= 50) {
        strokeStyle = '#2ec300';
        ctx.fillStyle = '#b1f71a';
        ctx.fillText('优', 0, 50);
        t_p.innerHTML = '空气优';
        finish = beginAngle + (pm25/50)*Math.PI*2/7;
    } else if (pm25 <= 100) {
        ctx.fillStyle = '#b1f71a';
        ctx.fillText('良', 0, 50);
        strokeStyle = '#b1f71a';
        t_p.innerHTML = '空气良';
        finish = beginAngle + (pm25/50)*Math.PI*2/7;
    } else if (pm25 <= 150) {
        ctx.fillStyle = '#fee400';
        ctx.fillText('轻度污染', 0, 50);
        t_p.innerHTML = '轻度污染';
        strokeStyle = '#fee400';
        finish = beginAngle + (pm25/50)*Math.PI*2/7;
    } else if (pm25 <= 200) {
        ctx.fillStyle = '#ff7200';
        ctx.fillText('中度污染', 0, 50);
        t_p.innerHTML = '中度污染';
        strokeStyle = '#ff7200';
        finish = beginAngle + (pm25/50)*Math.PI*2/7;
    } else if (pm25 <= 300) {
        ctx.fillStyle = '#ed0006';
        ctx.fillText('重度污染', 0, 50);
        t_p.innerHTML = '重度污染';
        strokeStyle = '#ed0006';
        finish = beginAngle + 4*Math.PI*2/7 + (pm25/100-2)*Math.PI*2/7;
    } else if (pm25 <= 500) {
        ctx.fillStyle = '#bf003a';
        ctx.fillText('严重污染', 0, 50);
        t_p.innerHTML = '空气严重污染';
        strokeStyle = '#bf003a';
        finish = beginAngle + 5*Math.PI*2/7 + (pm25-300)/200*Math.PI*2/7;
    } else {
        ctx.fillStyle = '#90002c';
        ctx.fillText('空气剧毒', 0, 50);
        t_p.innerHTML = '空气剧毒';
        strokeStyle = '#90002c';
        finish = beginAngle + 6*Math.PI*2/7 + (pm25-500)/500*Math.PI*2/7;
    }
    imageData = ctx.getImageData(0, 0, box.width, box.height);
    var that = this;
    setTimeout(function () {
        window.requestAnimationFrame(animation);
    }, 400);
    ctx.closePath();
    ctx.restore();
};
Weather.drawTrend = function (trendData) {
    var canvas = this.nodeData.trendcanvas,
        ctx = canvas.getContext('2d'),
        box = {
            width: canvas.width,
            height: canvas.height
        },
        average = box.width/8,
        max = Number(trendData[0][0]),
        min = Number(trendData[0][1]),
        center = 0,
        radius = 6,
        proportion,
        date,
        week,
        len = trendData.length;
    for (var i = 0; i < 4; i++) {
        if (Number(trendData[i][0]) > max) {
            max = Number(trendData[i][0]);
        }
        if (Number(trendData[i][1]) < min) {
            min = Number(trendData[i][1]);
        }
    }
    center = max - min; // 温差
    if (center <= 10) {
        proportion = 10;
    } else if (center <= 18) {
        proportion = 8;
    } else if (center <= 30) {
        proportion = 5;
    } else {
        proportion = 2;
    }
    center = (max + min)/2;
    ctx.clearRect(0, 0, box.width, box.height);
    ctx.strokeStyle = '#fff';
    ctx.font = "normal 16px 黑体-繁";
    ctx.fillStyle = '#c4c4c4';
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    for (i = 1; i <= 4; i++) {
        date = trendData[len - 2][i - 1];
        week = trendData[len - 1][i - 1];
        ctx.beginPath();
        ctx.fillText(date[0] + '/' + date[1] + ' ' + week, average*(2*i - 1), box.height - 10);
    }
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, box.height/2);
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.font = "normal 16px 微软雅黑 Light";
    for (i = 0; i < len - 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#33aaff';
        ctx.fillStyle = '#33aaff';
        ctx.fillText(trendData[i][1] + '°', average*(2*i + 1), (center - trendData[i][1])*proportion + 35);
        ctx.fillText(trendData[4][i][1], average*(2*i + 1), (center - trendData[i][1])*proportion + 55);
        ctx.arc(average*(2*i + 1), (center - trendData[i][1])*proportion, radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.moveTo(average*(2*i + 1), (center - trendData[i][1])*proportion);
        ctx.lineTo(average*(2*i + 3), (center - trendData[i+1][1])*proportion);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#ff4223';
        ctx.fillStyle = '#ff4223';
        ctx.fillText(trendData[i][0] + '°', average*(2*i + 1), (center - trendData[i][0])*proportion - 20);
        ctx.fillText(trendData[4][i][0], average*(2*i + 1), (center - trendData[i][0])*proportion - 40);
        ctx.arc(average*(2*i + 1), (center - trendData[i][0])*proportion, radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.moveTo(average*(2*i + 1), (center - trendData[i][0])*proportion);
        ctx.lineTo(average*(2*i + 3), (center - trendData[i+1][0])*proportion);
        ctx.stroke();
    }
    ctx.restore();
};
Weather.calDate = function (dateString) { // 计算日期
    var date = [],
        nonleap = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        leap = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        year, month, theDate;
    year = dateString.slice(0, dateString.indexOf('-'));
    month = dateString.slice(dateString.indexOf('-') + 1, dateString.lastIndexOf('-'));
    theDate = dateString.slice(dateString.lastIndexOf('-') + 1);
    if (year%400 == 0||year%4==0&&year%100!=0) {
        var monthNum = leap[Number(month)];
    } else {
        var monthNum = nonleap[Number(month)];
    }
    for (var i = 0; i < 4; i++) {
        date[i] = [];
        date[i][0] = Number(month);
        date[i][1] = theDate++;
        if (date[i][1] > monthNum) {
            if (++month > 12) {
                month = 1;
                date[i][0] = month;
            } else {
                date[i][0] = month;
            }
            theDate = 1;
            date[i][1] = theDate++;
        }
    }
    return date;
};
Weather.getCityWeather = function (event) { // 点击城市列表中的城市得到天气数据
    if (event.target.innerHTML == city.innerHTML) {
        return;
    }
    $('#menubox').slideUp();
    var that = this;
    this.animate.detailhide(this.nodeData);
    setTimeout(function () {
        that.updatePage(that.weatherData.results[event.target.id.slice(4) - 1]);
    }, 300);
};
Weather.createCityList = function (array) {
    $('#citybox div').remove('.citylist');
    for (var i = 0, len = array.length; i < len; i++) {
        var div = document.createElement('div'),
            textNode = document.createTextNode(array[i]);
        div.className = 'citylist';
        div.id = 'city' + (this.nodeData.citylist.length + 1);
        div.setAttribute('onclick', "Weather.getCityWeather(event)");
        div.appendChild(textNode);
        citybox.appendChild(div);
    }
};
Weather.createDeleteDiv = function (id, text) {
    var div = document.createElement('div'),
        textNode = document.createTextNode(text),
        span = span = document.createElement('span');
    div.className = 'deletelist';
    div.id = 'delete' + (id + 1);
    div.setAttribute('draggable', "true");
    div.setAttribute('ondragstart', "Weather.dragStartHandler(event)");
    div.setAttribute('ondragenter', "Weather.dragEnterHandler(event)");
    div.setAttribute('ondragover', "Weather.dragOverHandler(event)");
    div.setAttribute('ondrop', "Weather.dropHandler(event)");
    span.className = 'delete';
    span.id = 'span' + (id + 1);
    span.setAttribute('onclick', "Weather.deleteCity(event)");
    div.appendChild(span);
    div.appendChild(textNode);
    return div;
};
Weather.deleteCity = function (event) {
    var index = event.target.id.slice(4);
    document.getElementById('delete' + index).style.display = 'none';
    this.nodeData.add.style.display = 'block';
};
Weather.bindEvent = function () {
    var that = this,
        nodeData = this.nodeData,
        addcity = nodeData.addcity,
        editbox = nodeData.editbox,
        deletelist = nodeData.deletelist,
        addbox = nodeData.addbox,
        add = nodeData.add;
    nodeData.submit.addEventListener('click', function () {
        $('#menubox').slideUp();
        if (/[\w\s]/.test(nodeData.inputcity.value)) {
            return;
        }
        if (nodeData.inputcity.value != '') {
            that.sendCityName(that.nodeData.inputcity.value, 0);
            nodeData.inputcity.value = '';
        }
    }, false);
    nodeData.editbutton.addEventListener('click', function () {
        var cityArray = JSON.parse(localStorage.getItem('cityArray'));
        editbox.style.display = 'block';
        $('#editbox div').remove('.deletelist').remove('#add');
        var div = document.createElement('div'),
            textNode = document.createTextNode(cityArray[0]),
            span;
        div.className = 'deletelist';
        div.id = 'delete1';
        div.appendChild(textNode);
        editbox.appendChild(div);
        for (var i = 1, len = cityArray.length; i < len; i++) {
            editbox.appendChild(that.createDeleteDiv(i, cityArray[i]));
        }
        div = document.createElement('div');
        div.id = 'add';
        editbox.appendChild(div);
        add = document.getElementById('add');
        add.addEventListener('click', function () {
            addbox.style.display = 'block';
            addcity.focus();
        }, false);
        if (len > 11) {
            add.style.display = 'none';
        }
    }, false);
    nodeData.addbutton.addEventListener('click', function () {
        if (/[\w\s]/.test(addcity.value) || addcity.value == '') {
            addcity.focus();
            return;
        }
        for (var i = 5, len = editbox.childNodes.length - 1; i < len; i++) {
            if (editbox.childNodes[i].style.display != 'none' && addcity.value.slice(0, 2) == editbox.childNodes[i].lastChild.nodeValue.slice(0, 2)) {
                alert('该城市已添加！');
                return;
            }
        }
        addbox.style.display = 'none';
        len = deletelist.length;
        if (len >= 11) {
            add.style.display = 'none';
        }
        editbox.insertBefore(that.createDeleteDiv(len, addcity.value), editbox.childNodes[len + 5]);
        addcity.value = '';
    }, false);
    nodeData.cancelbutton.addEventListener('click', function () {
        addbox.style.display = 'none';
        addcity.value = '';
    }, false);
    nodeData.cancel.addEventListener('click', function () {
        editbox.style.display = 'none';
    }, false);
    nodeData.confirm.addEventListener('click', function () {
        editbox.style.display = 'none';
        var cityArray = JSON.parse(localStorage.getItem('cityArray')),
            remain = [];
        for (var i = 5, len = editbox.childNodes.length - 1; i < len; i++) {
            if (editbox.childNodes[i].style.display != 'none') {
                remain.push(editbox.childNodes[i].lastChild.nodeValue);
            }
        }
        if (cityArray.join('') == remain.join('')) {
            return;
        }
        that.createCityList(remain);
        var flag = 0;
        for (i = 0, len = remain.length; i < len; i++) {
            if (nodeData.city.innerHTML == remain[i]) {
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            that.updatePage(that.weatherData[0]);
        }
        that.sendCityName(remain.join('|'), 'load');
        localStorage.setItem('cityArray', JSON.stringify(remain));
    }, false);
};
Weather.localStorage = function () {
    if (!localStorage.getItem('cityArray')) {
        localStorage.setItem('cityArray', '[]');
    }
    var cityArray = localStorage.getItem('cityArray');
    if (!/^\[\".*\"\]$/.test(cityArray)) {
        localStorage.setItem('cityArray', '["'+city.innerHTML+'"]');
        cityArray = localStorage.getItem('cityArray');
    }
    cityArray = JSON.parse(cityArray);
};
Weather.jqueryBind = function () {
    $('#menu').click(function () {
        if ($('#cityloading').css('display') == 'block') {
            return;
        }
        $('#menubox').slideToggle();
    });
    $('#closemenu').click(function () {
        $('#menubox').slideUp();
    });
    $('#query').click(function () {
        $('#querybox').show();
        $('#trendbox').hide();
        $('#indexbox').hide();
        $(this).addClass('query');
        $('#trend').removeClass('trend');
        $('#index').removeClass('index');
    });
    $('#trend').click(function () {
        $('#querybox').hide();
        $('#trendbox').show();
        $('#indexbox').hide();
        $(this).addClass('trend');
        $('#query').removeClass('query');
        $('#index').removeClass('index');
    });
    $('#index').click(function () {
        $('#querybox').hide();
        $('#trendbox').hide();
        $('#indexbox').show();
        $(this).addClass('index');
        $('#query').removeClass('query');
        $('#trend').removeClass('trend');
    });
    $(".right:first").addClass('active');
    $(".indextext:gt(0)").hide();
    $('.indexhead').click(function () {
        $(this).next('.indextext').slideToggle();
        $(this).parent().siblings('.indexdetail').children('.indextext').slideUp();
        $(this).children('.right').toggleClass('active')
        $(this).parent().siblings('.indexdetail').children('.indexhead').children('.right').removeClass('active');
    });
};
Weather.animate = {
    detailshow: function (nodeData) {
        var city = nodeData.city,
            realtemperature = nodeData.realtemperature,
            pm25box = nodeData.pm25box,
            daybox = nodeData.daybox,
            today = daybox[0],
            tomorrow = daybox[1],
            aftertomorrow = daybox[2],
            threedays = daybox[3];
        city.className = 'city';
        realtemperature.className = 'realtemp';
        pm25box.className = 'pm25box';
        today.className = 'daybox dayshow';
        tomorrow.className = 'daybox dayshow tomorrowshow';
        aftertomorrow.className = 'daybox dayshow aftertomorrowshow';
        threedays.className = 'daybox dayshow threedaysshow';
    },
    detailhide: function (nodeData) {
        var city = nodeData.city,
            realtemperature = nodeData.realtemperature,
            pm25box = nodeData.pm25box,
            daybox = nodeData.daybox,
            today = daybox[0],
            tomorrow = daybox[1],
            aftertomorrow = daybox[2],
            threedays = daybox[3];
        realtemperature.className = 'realtemphide';
        city.className = 'cityhide';
        pm25box.className = 'pm25boxhide';
        today.className = 'daybox dayhide';
        tomorrow.className = 'daybox dayhide';
        aftertomorrow.className = 'daybox dayhide';
        threedays.className = 'daybox dayhide';
    }
};
Weather.init = function () {
    Weather.initNode();
    Weather.sendCityName('', 0);
    Weather.localStorage();
    Weather.jqueryBind();
};
window.onload = function () {
    Weather.init();
};