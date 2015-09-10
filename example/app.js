var express = require('express')
var deeplink = require('..')
var app = express()

app.get('/test', function (req, res, next) {
 res.send("hello");
})

app.get('/', function (req, res, next) {
  res.redirect("https://www.goyardhub.com");
})

// mount deeplinks middleware
app.get('/deeplink', deeplink({
  fallback: 'http://wr1.com',
  android_package_name: 'com.wr1'//,
  //ios_store_link: 'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
}))

app.listen(process.env.PORT)
console.log('deeplink service listening on port' + process.env.PORT)

// now open browser and point it to http://localhost:3000/deeplink?url=cups%3A%2F%2Fmain
// try different browsers (desktop, android, ios)
// remember that the deeplink has to be url encoded i.e. cups://main --> cups%3A%2F%2Fmain

app.get('/another', function (req, res, next) {
  // you can do stuff here like add analytics to the request
  // when you're done, simply pass on to deeplink:
  return next()
}, deeplink({
  fallback: 'http://wr1.com',
  android_package_name: 'com.citylifeapps.cups',
  ios_store_link: 'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
}))

app.get('/wr1app', function (req, res, next) {
  // you can do stuff here like add analytics to the request
  // when you're done, simply pass on to deeplink:
  // reformat the URL to fit deeplink lib
  //http://wr1.com/wr1app?club=2&posttype=artistpost&post=140
  //becomes vnd.wr1.wr1://com.wr1.ios/club/2/artistpost/140

  //node-deeplink-dev.elasticbeanstalk.com/wr1app?club=2&posttype=artistpost&post=140
  //
  console.log("wr1app");
  var club = req.query.club;
  var posttype = req.query.posttype;
  var post = req.query.post;
  // %3A :
  // %2F /
  //
  // construct the new url and pass on
  var url = 'vnd%2ewr1%2ewr1%3A%2F%2Fcom%2ewr1%2eios%2Fclub%2F'+club+'%2F'+posttype+'%2F'+post
  //var url = 'vnd.wr1.wr1://com.wr1.ios/club/'+club+'/'+posttype+'/'+post
  var redirectUrl = '/deeplink?url=' + url;
  console.log("redirectUrl " + redirectUrl)
  res.redirect(redirectUrl);
})