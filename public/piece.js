var socket = io();
var time = 0;
var started = false;

var x = function(){
	setInterval(function(){
		time = time + 1;
		document.getElementById('time').innerHTML = time;
	},1000);
}

// console.log(document.getElementById('vchat').src)
var bs = document.getElementsByClassName("bs");
var ws = document.getElementsByClassName("ws");
var e = document.getElementsByClassName("e");
var h = document.getElementsByClassName("h");
var c = document.getElementsByClassName("c");
var q = document.getElementsByClassName("q");
var k = document.getElementsByClassName("k");
var n = document.getElementsByClassName("n");

var whoMadeRed = null;
var side = "white";
var myside = null;

var sendTxt = document.getElementById('sendTxt');
var sendBtn = document.getElementById('sendBtn');
var msgList = document.getElementById('msgList');

sendTxt.addEventListener('keypress',function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode                        
        e.preventDefault();
        send();
    }
});

var send = function(){
	data = {};
	data['msg'] = sendTxt.value;
	data['side'] = myside;
	sendTxt.value = "";
	socket.emit('newMsg',data);
}

sendBtn.addEventListener('click',send);

socket.on('newMsg',function(data){
	var item = data['side']+" : "+data['msg'];
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(item));
	li.style.width = '75%';
	if(data['side']=='black'){
		li.style.backgroundColor = 'black';
		li.style.opacity = '0.7';
		li.style.color = 'white';
	}else{
		li.style.backgroundColor = 'white';
		li.style.opacity = '0.7';
		li.style.color = 'black';
	}
	msgList.appendChild(li);
	var elem = document.getElementById('chats');
	console.log(elem);
	console.log(elem.scrollHeight);
  	elem.scrollTop = elem.scrollHeight;
});

var authorize = function(target_div){

	console.log(target_div);
	var img = target_div;
	console.log(img);
	var src = img.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];

	console.log(myside);
	console.log(side);
	if(myside == side && src[1]==myside[0]){
		console.log("AUTHORIZED");
		return true;
	}
	console.log("UNAUTHORIZED");
	return false;
}

socket.on('sides',function(data){
	document.getElementById('vchat').src = "https://tokbox.com/embed/embed/ot-embed.js?embedId=869de6b2-51ec-41c1-b441-e645f2fef1be&room="+data["vname"]+"&iframe=true";
	if(socket.id == data["white"]){
		myside = "white";
		document.getElementById('white').style.opacity = '0.9';
		document.getElementById('uw').style.textDecoration='underline';
		document.getElementById('black').style.opacity = '0.7';
		document.getElementById('ub').style.textDecoration='none';

	}else{
		myside = "black";
		document.getElementById('black').style.opacity = '0.9';
		document.getElementById('ub').style.textDecoration='underline';
		document.getElementById('white').style.opacity = '0.7';
		document.getElementById('uw').style.textDecoration='none';
	}
});

socket.on('message',function(data){

	if(side == "white"){
		side = "black";
	}else{
		side = "white";
	}
	document.getElementById('player').innerHTML = side;
	time = 0;
	if(!started){
		x();
		started = true;
	}

	if(!data["whoMadeRed"]||!data["attackedOn"]){
		return;
	}
	whoMadeRed1 = document.getElementById(data["whoMadeRed"]);
	whoMadeRed2 = whoMadeRed1.childNodes;
	whoMadeRed = whoMadeRed2[1];
	attackedOn1 = document.getElementById(data["attackedOn"]);
	attackedOn2 = attackedOn1.childNodes;
	attackedOn = attackedOn2[1];
	console.log(whoMadeRed);
	console.log(attackedOn);
	checkAttack(attackedOn);
});

socket.on('connection', function(data){
    	console.log("I am connected");
    	console.log(document.getElementById('vchat').src)
   });

socket.on('unauthorized', function(data){
    console.log("I am unauthorized");
});

var someOneWon = function(){
	var wSide = null;
	if(side == "white"){
		wSide = "black";
	}else{
		wSide = "white";
	}

	alert(wSide + "  won :) :) :) ...congratulations");


}

var hatao = function(rsrc){
	if(rsrc==null||!rsrc){
		return;
	}
	var i = 1;
	var id = rsrc[0]+rsrc[1]+i.toString();
	var ele = document.getElementById(id);
	while(!ele || ele.style.opacity == '0.1'){
		i = i+1;
		id = rsrc[0]+rsrc[1]+i.toString();
		ele = document.getElementById(id);
	}
	ele.style.opacity ='0.1';
	if(rsrc[0]=='k'){
		someOneWon();
	}
}

var checkAttack = function(attackedOn){

	var redSrc = whoMadeRed.src;
	console.log(redSrc);
	var split_result = redSrc.split('/');
	redSrc = split_result[split_result.length-1];

	var attSrc = attackedOn.src;
	split_result = attSrc.split('/');
	attSrc = split_result[split_result.length-1];
	
	var Rsrc = whoMadeRed.src;

	whoMadeRed.src="";
	

	if(Rsrc && redSrc){
		attackedOn.src = Rsrc;
	}else{
		attackedOn.src="";
	}

	var redF = null;
	console.log(redSrc);
	if(redSrc){
		if(redSrc[0]=='s'){
			if(redSrc[1]=='w'){
				console.log("sw");
				redF = "sw";
			}else{
				console.log("sb");
				redF = "sb";
			}
		}else{
			console.log(redSrc[0]);
			redF = redSrc[0];
		}
	}
	var attF = null;
	if(attSrc){
		if(attSrc[0]=='s'){
			if(attSrc[1]=='w'){
				attF = "sw";
			}else{
				attF = "sb";
			}
		}else{
			attF = attSrc[0];
		}
	}

	console.log("redF" );
	console.log(redF);
	console.log("attF" );
	console.log(attF);

	if(redF==null){
		attackedOn.onclick = new function(){};
		attackedOn.addEventListener('click',nfunc);
	}
	else if(redF=="sb"){
		attackedOn.onclick = new function(){};
		attackedOn.addEventListener('click',bsfunc);
	}else if(redF=="sw"){
		console.log("m here");
		attackedOn.onclick = new function(){};
		attackedOn.addEventListener('click',wsfunc);
	}else{	
		switch(redF){
			case 'e': attackedOn.onclick = new function(){};attackedOn.addEventListener('click',efunc);break;
			case 'h': console.log("added a func"); attackedOn.onclick = new function(){};attackedOn.addEventListener('click',hfunc);break;
			case 'c': attackedOn.onclick = new function(){};attackedOn.addEventListener('click',cfunc);break;
			case 'q': attackedOn.onclick = new function(){};attackedOn.addEventListener('click',qfunc);break;
			case 'k': attackedOn.onclick = new function(){};attackedOn.addEventListener('click',kfunc);break;
		}
	}

	
	whoMadeRed.onclick = new function(){};
	whoMadeRed.addEventListener('click',nfunc);
	console.log("daal diya normal")
	


	console.log("first");
	console.log(whoMadeRed.classList);
	console.log("second");
	console.log(attackedOn.classList);


	var inilength = whoMadeRed.classList.length;

	for( i = 0;i<attackedOn.classList.length;i++){
		whoMadeRed.classList.add(attackedOn.classList.item(i));
	}

	while(attackedOn.classList.item(0)!=null){
		attackedOn.classList.remove(attackedOn.classList.item(0));
	}

	for(i=0;i<inilength;i++){
		attackedOn.classList.add(whoMadeRed.classList.item(i));
	}
	
	var it =0;
	while(it<inilength){
		whoMadeRed.classList.remove(whoMadeRed.classList.item(0));
		it = it+1;
	}
	whoMadeRed.classList.add("PP");

	console.log("first");
	console.log(whoMadeRed.classList);
	console.log("second");
	console.log(attackedOn.classList);
	removeColor();
	hatao(attSrc);
}

var removeColor = function(){
	var divs = document.getElementsByClassName("P");
	for(i=0;i<divs.length;i++){
		divs[i].style.removeProperty("background-color");
		divs[i].style.removeProperty("opacity");
	}
	whoMadeRed = null;
}

var checkOponent = function(target_div){
	console.log(target_div);
	var img = target_div.childNodes;
	img = img[1];
	console.log(img);
	var src = img.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	console.log("inside check"+src);
	if(src==null || src==undefined || !src ){
		target_div.style.backgroundColor = 'red';
		target_div.style.opacity = '0.5';
		return true;
	}else{
		return false;
	}
}

var ifOponent = function(target_div,op){
	console.log(target_div);
	var img = target_div.childNodes;
	img = img[1];
	console.log(img);
	var img_src = img.src;
	console.log(img_src);
	var split_result = img_src.split('/');
	img_src = split_result[split_result.length-1];
	if(img_src[1] == op ){
		target_div.style.backgroundColor = 'red';
		target_div.style.opacity = '0.5';
	}
}

var bsfunc = function(){
	
	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
					data = {};
				
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("bs function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
	if(!authorize(this)){
		return;
	}
	removeColor();

	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	if(!src || src==null || src==undefined){
		return;
	}
	var pass = src[0];
	if(pass!='s'){
		return;
	}
	whoMadeRed = this;
	var id = this.parentNode.id;
	id = parseInt(id);

	var id1 = id+10;
	var f1 = document.getElementById(id1);
	var bool = checkOponent(f1,'w');
	console.log(bool);

	if(id<30 && id>20 && bool){
		var id2 = id+20;
		var f2 = document.getElementById(id2);
		checkOponent(f2,'w');
	}

	var id3 = id+10-1;
	if(id3%10 != 0){
		var f3 = document.getElementById(id3);
		ifOponent(f3,'w');
	}

	var id4 = id+10+1;
	if ( id4%10 != 9){
		var f4 = document.getElementById(id4);
		ifOponent(f4,'w');
	}	

}

var wsfunc = function(){
	

	console.log("ho toh gaya authorize ... ab karo kaam");
	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
					data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("ws function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
	if(!authorize(this)){
		return;
	}
	removeColor();
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	if(!src || src==null || src==undefined){
		return;
	}
	var pass = src[0];
	if(pass!='s'){
		return;
	}
	whoMadeRed = this;
	var id = this.parentNode.id;
	id = parseInt(id);

	var id1 = id-10;
	var f1 = document.getElementById(id1);
	var bool = checkOponent(f1,'b');
	console.log(bool);

	if(id<80 && id>70 && bool){
		var id2 = id-20;
		var f2 = document.getElementById(id2);
		checkOponent(f2,'b');
	}

	var id3 = id-10-1;
	if(id3%10 != 0){
		var f3 = document.getElementById(id3);
		ifOponent(f3,'b');
	}

	var id4 = id-10+1;
	if ( id4%10 != 9){
		var f4 = document.getElementById(id4);
		ifOponent(f4,'b');
	}	

}

var checkSelf = function(target_div,same){
	console.log("came in");
	console.log(target_div);
	if(same == undefined || same == null || !same){
		console.log("kuch same bheja hi nahi .. issi liye wapis");
		return;
	}
	console.log("reached here atleast");
	console.log(target_div);
	var img = target_div.childNodes;
	img = img[1];
	console.log(img);
	var img_src = img.src;
	console.log(img_src);
	var split_result = img_src.split('/');
	img_src = split_result[split_result.length-1];
	console.log(img_src);
	console.log(same);
	if(img_src==null || img_src==undefined || !img_src){
		target_div.style.backgroundColor = 'red';
		target_div.style.opacity = '0.5';
		console.log("reached des...returning true");
		return true;
	}
	if(  img_src[1] != same  ){
		target_div.style.backgroundColor = 'red';
		target_div.style.opacity = '0.5';
		console.log("opposition ki wajha se wapis aaya ");
		return false;
	}
	console.log("waha mai khud tha !...tabhi wapis");
	return false;
}

var efunc = function(){

	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
		console.log("pehle yaha");
			data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("e function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
	if(!authorize(this)){
		return;
	}
	console.log("red was not detected");
	removeColor();
	whoMadeRed = this;
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	var same = src[1];
	var pass = src[0];
	if(pass!='e'){
		console.log("returning from log");
		return;
	}
	var id = this.parentNode.id;
	id = parseInt(id);

	for( i=id+10 ;i<90;i=i+10){
		console.log(i);
		var div = document.getElementById(i);
		if(!checkSelf(div,same)){
			break;
		}		
	}

	for( i=id-10 ;i>10;i=i-10){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		if(!checkSelf(div,same)){
			break;
		}	
	}

	for( i=id+1 ;i%10 < 9;i=i+1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}
	for( i=id-1 ;i%10 > 0;i=i-1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}

}

var hfunc = function(){
	
	console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
	console.log(this.onclick);
	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
					data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("h function call hua hai .. data");	
			console.log(data);
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
		if(!authorize(this)){
		return;
	}
	removeColor();

	whoMadeRed = this;
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	var same = src[1];
	var pass = src[0];
	if(pass!='h'){
		return;
	}
	console.log("same");
	console.log(same);
	var id = this.parentNode.id;
	id = parseInt(id);

	id1 = id+21;
	console.log("id1:"+id1);
	if(id1<90 && id1%10<9){
		var div = document.getElementById(id1);
		checkSelf(div,same);
	}
	id2 = id+19;
	console.log("id2:"+id2);
	if(id2%10 > 0 && id2<90 ){
		var div = document.getElementById(id2);
		checkSelf(div,same);
	}
	id3 = id+2+10;
	console.log("id3:"+id3);
	if(id3<90 && id3%10 < 9 && id3%10>0){
		var div = document.getElementById(id3);
		checkSelf(div,same);
	}
	id4 = id+2-10;
	console.log("id4:"+id4);
	if(id4>10 && id4%10<9 && id4%10>0){
		var div = document.getElementById(id4);
		checkSelf(div,same);
	}
	id5 = id-20-1;
	console.log("id5:"+id5);
	if(id5<90 && id5%10>0){
		var div = document.getElementById(id5);
		checkSelf(div,same);
	}
	id6 = id-20+1;
	console.log("id6:"+id6);
	if(id6>10 && id6%10<9){
		var div = document.getElementById(id6);
		checkSelf(div,same);
	}
	id7 = id-2+10;
	console.log("id7:"+id7);
	if(id7<90 && id7%10>0 && id7%10<9){
		var div = document.getElementById(id7);
		checkSelf(div,same);
	}
	id8 = id-2-10;
	console.log("id8:"+id8);
	if(id8>0 && id8%10>0 && id8%10<9){
		var div = document.getElementById(id8);
		checkSelf(div,same);
		
	}

}

var cfunc = function(){

	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
					data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("c function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
		if(!authorize(this)){
		return;
	}
	removeColor();
	whoMadeRed = this;
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	var same = src[1];
	var pass = src[0];
	if(pass!='c'){
		return;
	}
	var id = this.parentNode.id;
	id = parseInt(id);

	for( i=id+11 ;i<90&&i%10<9;i=i+11){
		var div = document.getElementById(i);
		if(!checkSelf(div,same)){
			break;
		}		
	}

	for( i=id-11 ;i>10&&i%10>0;i=i-11){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		if(!checkSelf(div,same)){
			break;
		}	
	}

	for( i=id-9 ;i%10 < 9&&i>10;i=i-9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}
	for( i=id+9 ;i%10 > 0 && i<90;i=i+9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}

}

var qfunc = function(){
	
	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
			data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("q function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
		if(!authorize(this)){
		return;
	}
	removeColor();
	whoMadeRed = this;
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	var same = src[1];
	var pass = src[0];
	if(pass!='q'){
		return;
	}
	var id = this.parentNode.id;
	id = parseInt(id);

	for( i=id+11 ;i<90&&i%10<9;i=i+11){
		var div = document.getElementById(i);
		if(!checkSelf(div,same)){
			break;
		}		
	}

	for( i=id-11 ;i>10&&i%10>0;i=i-11){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		if(!checkSelf(div,same)){
			break;
		}	
	}

	for( i=id-9 ;i%10 < 9&&i>10;i=i-9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}
	for( i=id+9 ;i%10 > 0 && i<90;i=i+9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}	
	for( i=id+10 ;i<90;i=i+10){
		var div = document.getElementById(i);
		if(!checkSelf(div,same)){
			break;
		}		
	}

	for( i=id-10 ;i>10;i=i-10){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		if(!checkSelf(div,same)){
			break;
		}	
	}

	for( i=id+1 ;i%10 < 9;i=i+1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}
	for( i=id-1 ;i%10 > 0;i=i-1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		if(!checkSelf(div,same)){
			break;
		}
	}

}

var kfunc = function(){
	
	var Reddiv = this.parentNode;
	if(Reddiv.style.backgroundColor=='red'){
			data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("k function call hua hai .. data");	
			console.log(data);
			removeColor();
			socket.emit('message',data);
		// checkAttack(this);
		return;
	}
		if(!authorize(this)){
		return;
	}
	removeColor();
	whoMadeRed = this;
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	var same = src[1];
	var pass = src[0];
	if(pass!='k'){
		return;
	}
	var id = this.parentNode.id;
	id = parseInt(id);

	for( i=id+11 ;i<90&&i%10<9;i=i+11){
		var div = document.getElementById(i);
		checkSelf(div,same)
		break;
	}

	for( i=id-11 ;i>10&&i%10>0;i=i-11){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		checkSelf(div,same)
		break;	
	}

	for( i=id-9 ;i%10 < 9&&i>10;i=i-9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		checkSelf(div,same)
		break;
	}
	for( i=id+9 ;i%10 > 0 && i<90;i=i+9){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		checkSelf(div,same)
		break;
	}	
	for( i=id+10 ;i<90;i=i+10){
		var div = document.getElementById(i);
		checkSelf(div,same)
		break;		
	}

	for( i=id-10 ;i>10;i=i-10){
		var div = document.getElementById(i);
		// checkSelf(div,same);	
		checkSelf(div,same)
		break;
	}

	for( i=id+1 ;i%10 < 9;i=i+1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		checkSelf(div,same)
		break;
	}
	for( i=id-1 ;i%10 > 0;i=i-1){
		var div = document.getElementById(i);
		// checkSelf(div,same);		
		checkSelf(div,same)
		break;
	}
}

var nfunc = function(){
	
	var src = this.src;
	var split_result = src.split('/');
	src = split_result[split_result.length-1];
	
	if(src==null || src==undefined || !src){
		console.log("kya krega mujhe dabake NNNNNNNNNNNNNNNNNNNNNNNNNNNN");
		var Reddiv = this.parentNode;
		if(Reddiv.style.backgroundColor=='red'){
			data = {};
			data["attackedOn"]=this.parentNode.id;
			data["whoMadeRed"]=whoMadeRed.parentNode.id;
			console.log("bs function call hua hai .. data");	
			console.log(data);
			console.log("yahi se call hui");
			removeColor();
			socket.emit('message',data);
			// checkAttack(this);
			return;
		}
		if(!authorize(this)){
		return;
	}
		removeColor();
	}	
}

for(i=0;i<bs.length;i++){
	console.log(" hello !!! added function !! ");
	bs[i].addEventListener('click',bsfunc);
}
for(i=0;i<ws.length;i++){
	console.log(" hello !!! added function !! ");
	ws[i].addEventListener('click',wsfunc);
}

for(i=0;i<e.length;i++){
	console.log(" hello !!! added function !! ");
	e[i].addEventListener('click',efunc);
}

for(i=0;i<h.length;i++){
	console.log(" hello !!! added function !! ");
	h[i].addEventListener('click',hfunc);
}

for(i=0;i<c.length;i++){
	console.log(" hello !!! added function !! ");
	c[i].addEventListener('click',cfunc);
}

for(i=0;i<q.length;i++){
	console.log(" hello !!! added function !! ");
	q[i].addEventListener('click',qfunc);
}
for(i=0;i<k.length;i++){
	console.log(" hello !!! added function !! ");
	k[i].addEventListener('click',kfunc);
}
for(i=0;i<n.length;i++){
	console.log(" hello !!! added function !! ");
	n[i].addEventListener('click',nfunc);
}
