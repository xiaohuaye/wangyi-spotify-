var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if(path === '/sign_up' && method === 'GET'){
    var string = fs.readFileSync('./src/sign_up.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === 'POST'){
    response.statusCode = 200
    // var string = fs.readFileSync('./vendor/jquery.min.js','utf8')
    // response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    // response.write(string)
    response.end()
  }else if(path === '/index'){
    response.statusCode = 200
    var string = fs.readFileSync('./src/index.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/player'){
    response.statusCode = 200
    var string = fs.readFileSync('./src/player.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_in'){
    response.statusCode = 200
    var string = fs.readFileSync('./src/sign_in.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/vendor/jquery.min.js'){
    var string = fs.readFileSync('./vendor/jquery.min.js','utf8')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/vendor/av-min.js'){
    var string = fs.readFileSync('./vendor/av-min.js','utf8')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/js/av-init.js'){
    var string = fs.readFileSync('./src/js/av-init.js','utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()
  }else if(path === '/player' && method === 'POST'){
    response.statusCode = 200
    string = fs.readFileSync('./src/player.html','utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)