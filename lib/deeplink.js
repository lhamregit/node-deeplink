var fs = require('fs')
var inliner = require('html-inline')
var stream = require('stream')

module.exports = function (options) {
  options = options || {}
  if (!options.fallback) { throw new Error('Error (deeplink): options.fallback cannot be null') }
  options.android_package_name = options.android_package_name || ''
  options.ios_store_link = options.ios_store_link || ''
  options.title = options.title || ''

  console.log('calling the deepling function');

  var deeplink = function (req, res, next) {
    var opts = {}
    Object.keys(options).forEach(function (k) { opts[k] = options[k] })

    // bail out if we didn't get url
    if (!req.query.url) {
      return next()
    }
    opts.url = req.query.url

    if (req.query.fallback) {
      opts.fallback = req.query.fallback
    }

    // read template file
    var file = fs.createReadStream(__dirname + '/public/index.html')

    console.log('opts.url ' + opts.url);

    // replace all template tokens with values from options
    var detoken = new stream.Transform({ objectMode: true })
    detoken._transform = function (chunk, encoding, done) {
      var data = chunk.toString()
      Object.keys(opts).forEach(function (key) {
        data = data.replace('{{' + key + '}}', opts[key])
      })
      //console.log(detoken);
      this.push(data)
      done()
    }

    // inline template js with html
    var inline = inliner({ basedir: __dirname + '/public' })

    // make sure the page is being sent as html
    res.set('Content-Type', 'text/html;charset=utf-8')

    // read file --> detokenize --> inline js --> send out
    file.pipe(detoken).pipe(inline).pipe(res)
  }

  return deeplink
}
