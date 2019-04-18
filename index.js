const SerialPort = require('serialport'); //import package
const portNumber =  'COM5';
const myPort = new SerialPort(portNumber, {
	baudRate : 57600
}); // buat object serial port

//parser biar ga nampilin buffer
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({ delimiter : '\r\n' });
myPort.pipe(parser); // using parser 

// event yang dipanggil ketika serial port kebuka. pake 'open'
myPort.on('open', ()=> {
	console.log("Arduino Connected on port " + portNumber);

	let timeOut = 3000; // 3detik
	setTimeout(()=> {
		// kirim command 1 ke arduino
		myPort.write('1', (err)=> {
			if(err)
				console.log(err); // munculin error
			else 
				console.log("success write 1"); // kalo ga error kasih notif
		});
	},timeOut);
});

// EXPRESS DAN SOCKET IO
const express = require('express'); // import package express
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

// Middleware milik si express.js
app.use(express.static(path.join(__dirname,'static/'))); // supaya file di dalam folder 'static' dapat diakses di web

app.get('/', (req, res) => { //route '/'
	res.sendFile(path.resolve(__dirname, 'static/index.html'));
})
app.get('/testing', (req, res) => { //route '/'
	res.sendFile(path.resolve(__dirname, 'static/testing.html'));
})

const portListen = process.env.PORT || 8080;
server.listen(portListen);

io.on('connection' , (socket)=> {
	console.log('Client connected!');
	parser.on('data', (data)=>{
        //panggil si parsing
        let hasilParsing = parsingRAWData(data, " ");
		socket.emit('socketData',{ datahasil : hasilParsing, dataMentah: data });
	});	
	socket.on('disconnect' , ()=> {
		console.log('Client disconnected!');
	});
});

/**
 * 
 * @param {String} data datamentah
 * @param {String} delimiter pemisah
 */
function parsingRAWData(data, delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

	return result;
}