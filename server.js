var express = require('express');
var app = express();

var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

var getDate = function(d){
    d = new Date(d);
	if(d === undefined || d  === null || d.toString() === 'Invalid Date')
		return { unix:null, natural:null};
	return {unix:d.getTime()/1000,natural:monthNames[d.getMonth()] +" " + d.getDate() +"," +d.getFullYear()};
};

var getIp = function(req){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(ip.indexOf('::')>-1){
        ip = ip.substr(7);
    }
    return ip;
};

var getLanguage = function(lang){
    var arr = lang.split(',');
    for(var i= 0;i<arr.length;i++){
        var index = arr[i].indexOf(';');
        if(index>-1)
            arr[i] = arr[i].substr(0,index);
    }
    return arr;
};

var getOS = function(OS){
    var start = OS.indexOf('(')+1;
    var end = OS.indexOf(')');
    return OS.substr(start,end-start);
};

var getHeaderParser = function(req){
    var ip = getIp(req);
    var lang = getLanguage(req.headers['accept-language']);
    var OS = getOS(req.headers['user-agent']);
    return {ipaddress:ip,language:lang,software:OS};
};

var port = process.env.PORT || 8080;

app.configure(function(){
	app.use(express.static(__dirname+'/client'));
});

app.get('/api/unixtime/:date', function (req, res) {
    var date = req.params.date;
	var number = parseInt(date,10);
    res.json(getDate(isNaN(number) ?date:number*1000));
});

app.get('/api/whoami',function(req, res) {
    res.json(getHeaderParser(req));
});

app.get('/',function(req,res){
	res.sendfile('client/index.html');
});

app.listen(port, function () {
  console.log('Example app listening on %s !',port);
})
