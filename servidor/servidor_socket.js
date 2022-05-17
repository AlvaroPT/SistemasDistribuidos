var datos=require("./datos.js");
var pacientes=datos.pacientes;
var medicos=datos.medicos;
var variables=datos.variables;
var muestras=datos.muestras;

// Crear un servidor HTTP
var http = require("http");
var httpServer = http.createServer();

// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

//Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});

var conexiones = []; // Todas las conexiones (clientes) de mi servidor
var compartirlista = [];

wsServer.on("request", function (request) { // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("conexion", request.origin); // aceptar conexión
	var conexion = {connection: connection};
	conexiones.push(conexion); // guardar la conexión
	console.log("Cliente conectado. Ahora hay", conexiones.length);	
	connection.on("message", function (message) { // mensaje recibido del cliente
		if (message.type === "utf8") {
			console.log("Mensaje recibido de cliente: " + message.utf8Data);
			var msg = JSON.parse(message.utf8Data);
			switch (msg.origen) {
				//listaPacientes(connection); // enviar la lista de pacientes al nuevo cliente
				case "connectmedico":
					//Verificamos que el servidor y medico estan conectados
					conexion.id = msg.id;
					conexion.quien = 'medico';
					console.log(conexion.id);
					console.log(conexion.quien);
					break;
				case "sollistapacientes":
					conexion.id=msg.idPaciente;
					conexion.quien= "paciente";
					console.log(msg);
					for(i in pacientes){
						if(msg.idMedico == pacientes[i].medico){
							compartirlista.push(pacientes[i]);
						}
					}
					connection.sendUTF(JSON.stringify({origen: "sollistapaciente" ,mensaje: compartirlista}));
					break;
				case "compartirparticular":
					console.log("Compartir a paciente con id:"+msg.quiencompartir);
					for(i in conexiones){
						if(conexiones[i].id == msg.quiencompartir && conexiones[i].quien == "paciente"){
							console.log("Se envia alerta la paciente con id:"+msg.quiencompartir);
							conexiones[i].connection.sendUTF(JSON.stringify({origen: "compartirparticular",mensaje: "El paciente "+ msg.nomPaciente +" ha compartido contigo la muestra: "+ msg.nomMuestra+" con valor de: "+msg.valorMuestra+" y fecha de: "+ msg.fechaMuestra}));
						}
					}
					break;
				case "compartirmimedico":
					for(i in conexiones){
						if(conexiones[i].id == msg.quiencompartir && conexiones[i].quien == "medico"){
							conexiones[i].connection.sendUTF(JSON.stringify({origen: "compartirmimedico",mensaje: "El paciente "+ msg.nomPaciente +" ha compartido contigo la muestra: "+ msg.nomMuestra+" con valor de: "+msg.valorMuestra+" y fecha de: "+ msg.fechaMuestra}));
						}
					}
					break;
				case "compartirtodospacientes":
					for(i in conexiones){
						if(conexiones[i].quien == "paciente"){
							conexiones[i].connection.sendUTF(JSON.stringify({origen: "compartirparticular",mensaje: "El paciente "+ msg.nomPaciente +" ha compartido contigo la muestra: "+ msg.nomMuestra+" con valor de: "+msg.valorMuestra+" y fecha de: "+ msg.fechaMuestra}));
						}
					}
					break;
			}
			//for (var i = 0; i < conexiones.length; i++) {
			//	conexiones[i].sendUTF(JSON.stringify(pacientes));
			//}
		}
	});
	connection.on("close", function (reasonCode, description) { // conexión cerrada
		conexiones.splice(conexiones.indexOf(connection), 1);
		console.log("Cliente desconectado. Ahora hay", conexiones.length);
	});
});
