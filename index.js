var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var name = null;
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

app.get('/one', function (req, res) {
   name = req.query.name;	
   res.render('index',{name: name});
});

io.use(function(socket, next){
  socket.join(name);
  next();
});


io.on('connection', function(socket){
  console.log('a user connected'+name);
  socket.on('message',function(data){
  	console.log(data);
  	io.to(name).emit('message',data);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});