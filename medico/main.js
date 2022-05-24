// rest.get(url, callback)
// rest.post(url, body, callback)
// rest.put(url, body, callback)
// rest.delete(url, callback)
// function callback(estado, respuesta) {...}

//Variables que guardaremos acerca del médico y sus pacientes
var idMedico = "";
var idPaciente = "";
var seccionActual = "login";
var varPaciente = [];

//Boton para entrar en el sistema
function entrar(){
    //Guardamos los datos introducidos por el medico para comprobar que son ciertos
    var medico = {
        login: document.getElementById("usuario").value,
        password: document.getElementById("password").value
    }
    //Comprueba si el medico logeado existe y devuelve su id.
    rest.post("/api/medico/login", medico,function(estado, res){
        if(estado!=201){
            alert(res);
        }
        if(estado==201){
            idMedico = res;
            console.log(idMedico);
            
            conexion = new WebSocket('ws://localhost:4444', "conexion");
            conexion.addEventListener("open", function (event){  
            conexion.send(JSON.stringify({ origen: "connectmedico", idMedico: idMedico}));
            conexion.addEventListener('message', function (event) {
                console.log("Mensaje del servidor:", event.data);
                var msg = JSON.parse(event.data);
                switch(msg.origen){
                    case "compartirmimedico":
                        alert(msg.mensaje);
                        cargar();
                        break;
                }
            });
            cargar();
        })
        }
    })
}

//Recarga la página
function cargar(){
    bienvenida(idMedico);           
    mostrarPaciente(idMedico);   
    cambiarSeccion("menu-principal");
}

//Crea un mensaje con el nombre del medico asociado a la id del login.
function bienvenida(idMedico){
    rest.get("/api/medico/"+idMedico, function(estado, medico){
        if(estado!=200){
            alert(medico);
        } 
        if(estado==200){
            //alert(medico.nombre);
            var bienvenida = document.getElementById("bienvenida");
            bienvenida.innerHTML = "<p>Bienvenido: "+medico.nombre+"</p>";
        }
    })
}
//PACIENTES
//Devuelve un array con la informacion de un paciente
function datosPaciente(id){
    rest.get("/api/paciente/"+id, function(estado, paciente){
        if(estado!=200){
            alert(paciente);
        } 
        if(estado==200){
             alert(paciente.nombre);
             var datosPaciente = document.createElement("ul");
             for (i in paciente){
                var datoPaciente = document.createElement("li");
                var dato = document.createTextNode(paciente[i]+": "+paciente[i].value);
                
                datoPaciente.appendChild(dato);
             }
             datosPaciente.appendChild(datoPaciente);
    }
    //Falta ponerlo en el documento
    })
}
//Mostrar pacientes asignados
function mostrarPaciente(id){
    rest.get("/api/medico/"+id+"/pacientes", function(estado, respuesta){
        //Respuesta hace referencia a la lista de pacientes
        if(estado==200){
            var itemlista = document.getElementById("lista-pacientes");
            itemlista.innerHTML = "";
            for(i in respuesta){  
                itemlista.innerHTML += "<dt>ID del paciente: "+respuesta[i].id+"</dt>";
                itemlista.innerHTML += "<dd>Nombre: "+respuesta[i].nombre+"</dd><button onclick=duplicarpaciente("+respuesta[i].id+")>Duplicar</button>";
                itemlista.innerHTML += "<dd>Fecha de nacimiento: "+respuesta[i].fecha_nacimiento+"</dd>";
                itemlista.innerHTML += "<dd>Sexo: "+respuesta[i].genero+"</dd>";
                itemlista.innerHTML += "<dd>Medico responsable: "+respuesta[i].medico+"</dd>";
                itemlista.innerHTML += "<dd>Codigo de acceso: "+respuesta[i].codigo_acceso+"</dd>";
                itemlista.innerHTML += "<dd>Observaciones: "+respuesta[i].observaciones+"</dd>";
                itemlista.innerHTML += "<button onclick='irmodificarpaciente("+respuesta[i].id+")'>Modificar paciente</button>";
                itemlista.innerHTML += "<button onclick=eliminarpaciente("+respuesta[i].id+") class='boton-eliminar'>Eliminar</button>";
            }
        }
    })
}
//Crea un nuevo paciente y despues lo muestra.
function crearpaciente(){
    var paciente = {
        nombre: document.getElementById("nombre_paciente").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        genero: document.getElementById("genero").value,
        medico: document.getElementById("lista-medicos").value,
        codigo_acceso: document.getElementById("codigo_acceso").value,
        observaciones: document.getElementById("observaciones").value
    }
    rest.post('/api/medico/:id/pacientes', paciente, function(estado, respuesta){
        if(estado==404){
            alert("Error, introduce todos los campos");
        }
        if(estado==201){
            bienvenida(idMedico);           
            mostrarPaciente(idMedico);   
            cambiarSeccion("menu-principal");
        }
    })
}
//Modifica los datos del paciente con los valores introducidos y despues los muestra.
function modificarPaciente(){
    paciente = {
        id: idPaciente,
        nombre: document.getElementById('nuevo_nombre').value,
        fecha_nacimiento: document.getElementById('nueva_fecha_nacimiento').value,
        genero: document.getElementById('nuevo_genero').value,
        medico: document.getElementById('nuevo_medico').value,
        codigo_acceso: document.getElementById('nuevo_codigo_acceso').value,
        observaciones: document.getElementById('nuevo_observaciones').value
    }
    console.log(document.getElementById(nuevo_nombre));
    rest.put("/api/paciente/"+idPaciente, paciente, function(estado, paciente){
        if(estado==200){    
            bienvenida(idMedico);           
            mostrarPaciente(idMedico);   
            cambiarSeccion("menu-principal");
        }
        else{
            alert("Error");
        }
    })
}
//Elimina al paciente 
function eliminarpaciente(id){
    rest.delete("/api/paciente/"+id, function(estado, respuesta){
        console.log(id);
        if(estado == 200){
            cargar();
        }
    })
}
//Duplicar Paciente
function duplicarpaciente(idPaciente){
    rest.post("/api/paciente/"+idPaciente+"/duplicar", function(estado,respuesta){
        if(estado == 201){
            cargar();
        }
    })
}
//MUESTRAS
//Coge las muestras de un paciente
function getmuestras(id){
    getvariables();
    var mosmuestras = document.getElementById("muestras-paciente");
    console.log(varPaciente);
    rest.get("/api/paciente/"+id+"/muestras", function(estado, respuesta){
        mosmuestras.innerHTML = "";
        for(i in respuesta){
            idvar = respuesta[i].variable;
            for(e in varPaciente){
                if(varPaciente[e].id == respuesta[i].variable){
                    var nomMuestra = varPaciente[e].nombre;
                }
            }
            mosmuestras.innerHTML += "<dt>Variable: "+nomMuestra+"</dt>";
            mosmuestras.innerHTML += "<dd>Valor: "+respuesta[i].valor+"</dd>";
            mosmuestras.innerHTML += "<dd>Fecha: "+respuesta[i].fecha+"</dd>";
        }
    })
}
//VARIABLES
//Coge un array con todas las variables.
function getvariables(){
    rest.get("/api/variable", function(estado,respuesta){
        console.log(respuesta);
        varPaciente = respuesta;
    })
}
//SECCIONES
//Función para mostrar las distintas partes de la pagina dependiendo de las acciones del usuario.
//Es una manera de tener toda la pagina en un solo html.
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}
//Vuelve al login
function salir(){
    cambiarSeccion("login");

}
//Cambia  a la seccion de crear un paciente.
function ircrearpaciente(){
    rest.get("/api/medico/"+idMedico+"/listamedicos", function(estado, respuesta){
        if(estado==200){
            var itemlista = document.getElementById("lista-medicos");
            itemlista.innerHTML = "";
            for(i in respuesta){  
                console.log(respuesta[i]);
                itemlista.innerHTML += "<option value="+respuesta[i].id+">"+respuesta[i].nombre+"</dt>";
            }
        }
    })
    cambiarSeccion("crear-paciente");
}
//Cambia a la seccion de modificar paciente, cogiendo la id del paciente que se ha pulsado.
function irmodificarpaciente(id){
    cambiarSeccion("modificar-paciente");
    idPaciente = id;
    getmuestras(id);
    getvariables();

}







