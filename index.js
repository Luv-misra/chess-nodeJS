var util = require('util');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var name = null;
var white = null;
var black = null;
var side = "white";
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

app.get('/one', function (req, res) {
   name = req.query.name;	
   res.render('index',{name: name});
});

app.get('/',function(req,res){
  res.render('hello world');
});

io.use(function(socket, next){
  
  if(io.sockets.rooms[name]==null || io.sockets.rooms[name]!=2){
    console.log("allowed connection");
    socket.join(name);
    socket.room = name;
    if(io.sockets.rooms[name]==null){
      io.sockets.rooms[name] = 1;
      white = socket.id;
      console.log("side of socket");
      console.log(white);
    }
    else if(io.sockets.rooms[name]>=1){
      io.sockets.rooms[name] = 2;  
      black = socket.id;
      console.log("side of socket");
      console.log(black);
    }else{
     io.sockets.rooms[name] = 1;
      white = socket.id;
      console.log("side of socket");
      console.log(white);
    }
    console.log("iss perticular room ke")
    console.log(io.sockets.rooms);
    next();
  }else{
    console.log("iss perticular room ke")
    console.log(io.sockets.rooms);
    socket.join("unauthorised");
    io.to("unauthorised").emit('unauthorised',{});
  }


});

io.on('connection', function(socket){
  console.log('a user connected'+socket.room);
  idata = {};
  idata["white"] = white;
  idata["black"] = black;
  io.to(name).emit('sides',idata);
  socket.on('message',function(data){
  	console.log(data);

    if(side == "white"){
      side = "black";
    }else{
      side = "white";
    }
    data["side"] = side;

  	io.to(name).emit('message',data);
  });

  socket.on('disconnect', function() {
      console.log('Got disconnect!');
      if(io.sockets.rooms[name]==1 || io.sockets.rooms[name]==2){
        if(io.sockets.rooms[name]==1){
          io.sockets.rooms[name] = 0;
        }
        else if(io.sockets.rooms[name]==2){
          io.sockets.rooms[name] = 1;  
        }else{
         io.sockets.rooms[name] = 0; 
        }
      }  
      console.log(io.sockets.rooms);
  });

});


http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
