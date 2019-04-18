var tride = {
	scene:0, 
	camera:0, 
	renderer:0, 
	model:0,
	line:0
}
inisialisasi3D(470, 280, 25);

var temperature = 0, 
	kelembaban = 0,
	arahAngin = 0,
	tekanan = 0,
	altitude = 0;	
const labAPTRG = {
	lintang: -6.976508, 
	bujur: 107.630290
}
const Bandung = {
	lintang 	: -6.9147439 , //Bandung
	bujur 		: 107.609809875, //Bandung
}
var param = {
	lintang: labAPTRG.lintang,
	bujur: labAPTRG.bujur,
	setLintang : function(data){
		this.lintang = parseFloat(data);
	},
	setBujur : function(data){
		this.bujur = parseFloat(data);
	},
	getLintang : function(){
		return this.lintang;
	},
	getBujur : function(){
		return this.bujur  ;
	}
};
    
var lineCoordinatesArray = [];

var gaugetemp = new LinearGauge({
    renderTo: 'gaugetemp',
    width: 100,
    height: 300,
    units: "°C",
    minValue: 0,
    startAngle: 90,
    ticksAngle: 180,
    valueBox: false,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 100,
            "to": 220,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear",
    barWidth: 10,
    value: 35
}).draw();

var gaugeArahAngin = new RadialGauge({
	renderTo: 'gaugeArahAngin',
	width : 160,
	height : 160,
	minValue: 0,
	maxValue: 360,
	majorTicks: [
		"N",
		"NE",
		"E",
		"SE",
		"S",
		"SW",
		"W",
		"NW",
		"N"
	],
	minorTicks: 22,
	ticksAngle: 360,
	startAngle: 180,
	strokeTicks: false,
	highlights: false,
	colorPlate: "#333",
	colorMajorTicks: "#f5f5f5",
	colorMinorTicks: "#ddd",
	colorNumbers: "#ccc",
	colorNeedle: "rgba(240, 128, 128, 1)",
	colorNeedleEnd: "rgba(255, 160, 122, .9)",
	valueBox: false,
	valueTextShadow: false,
	colorCircleInner: "#fff",
	colorNeedleCircleOuter: "#ccc",
	needleCircleSize: 15,
	needleCircleOuter: false,
	animationRule: "linear",
	needleType: "line",
	needleStart: 75,
	needleEnd: 99,
	needleWidth: 3,
	borders: true,
	borderInnerWidth: 0,
	borderMiddleWidth: 0,
	borderOuterWidth: 5,
	colorBorderOuter: "#ccc",
	colorBorderOuterEnd: "#ccc",
	colorNeedleShadowDown: "#222",
	borderShadowWidth: 0,
	animationTarget: "plate",
	animationDuration: 1500,
	value: 0,
	animateOnInit: true
}).draw();
gaugeArahAngin.draw();

function update(){
	const socket = io.connect();

	socket.on('socketData', (data)=>{
		// console.log(data);
		const dataHasil = data.datahasil;
		temperature = Math.abs(parseInt(dataHasil[2])) % 220;
		latitude = Math.round( param.lintang * 1000000 + parseInt(dataHasil[3]) ) / 1000000;
		longitude = Math.round( param.bujur * 1000000 + parseInt(dataHasil[4]) ) / 1000000;
		$( "#rawData" ).html(data.dataMentah);
		$( "#head" ).html(dataHasil[0]);
		$( "#altitude" ).html(dataHasil[1]);
		$( "#temperature" ).html(temperature);
		$( "#latitude" ).html(latitude);
		$( "#longitude" ).html(longitude);
		$( "#x" ).html(dataHasil[5]);
		$( "#y" ).html(dataHasil[6]);
		$( "#z" ).html(dataHasil[7]);
		altitude = parseInt(dataHasil[1]);
		param.lintang = (latitude);
		param.bujur = (longitude);
		gaugetemp.value = parseInt(temperature);
		tride.model.rotation.x = parseInt(dataHasil[5]) + 1.8;
		tride.line.rotation.x = parseInt(dataHasil[5]) + 1.8;
		tride.model.rotation.y = parseInt(dataHasil[6]);
		tride.line.rotation.y = parseInt(dataHasil[6]);
		tride.model.rotation.z = parseInt(dataHasil[7]);
		tride.line.rotation.z = parseInt(dataHasil[7]);
		arahAngin = Math.floor(Math.random() * (360 - 0 + 1)) + 0;; //kasih random karena belum ada fungsi arah angin dari data gps
		gaugeArahAngin.value = arahAngin;

		 //redraw maps
		redraw(param.getLintang(), param.getBujur());
	});
}

// Grafik
$(function() {
    Highcharts.setOptions({
	    global: {
	        useUTC: false
	    }
	});

	Highcharts.chart('grafikAltitude', {
	    chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        events: {
	            load: function () {
	                // set up the updating of the chart each second
	                var series = this.series[0];
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = altitude;
	                    series.addPoint([x, y], true, true);
	                }, 1000);
	            }
	        }
	    },
	    title: {
	        text: 'Grafik Altitude'
	    },
	    xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
	    yAxis: {
	        title: {
	            text: 'meter (m)'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	        formatter: function () {
	            return '<b>' + this.series.name + '</b><br/>' +
	                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                Highcharts.numberFormat(this.y, 2);
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    exporting: {
	        enabled: false
	    },
	    series: [{
	        name: 'Altitude data',
	        data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;

	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 1000,
	                    y: altitude
	                });
	            }
	            return data;
	        }())
	    }]
	});
}); // end jquery


function initMap() {
	// Make map
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 17,
	center: {lat: param.getLintang(), lng : param.getBujur(), alt : 0}
	});

	//make marker
	map_marker = new google.maps.Marker({
		position: {
			lat: param.getLintang(), 
			lng: param.getBujur()
		}, 
		icon: {
			url: "../icon/icon-drone-micro-red.png",
			anchor: new google.maps.Point(24, 24)
		},
		map: map
	});
	map_marker.setMap(map);

}
function redraw(Lintang, Bujur) {
	map.setCenter({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah
	map_marker.setPosition({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah

	pushCoordToArray(Lintang, Bujur); //masukin nilai lintan dan bujur ke array coordinates

	var lineCoordinatesPath = new google.maps.Polyline({
		path: lineCoordinatesArray,
		geodesic: true,
		strokeColor: '#ffeb3b',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});

	lineCoordinatesPath.setMap(map); 
}
function pushCoordToArray(latIn, lngIn) {
	lineCoordinatesArray.push(new google.maps.LatLng(latIn, lngIn));
}

function inisialisasi3D(width, height, jarak = 50) {
	tride.scene = new THREE.Scene();
	tride.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
	tride.renderer = new THREE.WebGLRenderer( { antialias: true } );
	tride.renderer.setSize( width, height);

	// document.body.appendChild( tride.renderer.domElement );
	// $( tride.renderer.domElement ).append( '#tride-model' );
	document.getElementById('tride-model').appendChild(tride.renderer.domElement);
	var geometry = new THREE.TorusBufferGeometry( 10, 3, 16, 100 );
	var material = new THREE.MeshBasicMaterial( { color: 0x1080ff } );/*{ color: 0x00ff00 } */
	
	var wireframe = new THREE.WireframeGeometry( geometry );

	tride.line = new THREE.LineSegments( wireframe );
	tride.line.material.depthTest = false;
	tride.line.material.opacity = 0.25;
	tride.line.material.transparent = true;
	tride.scene.add( tride.line );

	tride.model = new THREE.Mesh( geometry, material );
	tride.scene.add( tride.model );

	tride.model.rotation.x = 1.8;
	tride.line.rotation.x = 1.8;
	tride.camera.position.z = jarak;

	var animate = function () {
		requestAnimationFrame( animate );
		tride.renderer.render( tride.scene, tride.camera );
	};

	animate();
}