var app = rpc("localhost", "MiGestionPacientes");
var conexion = "";

var loginPaciente = app.procedure("loginPaciente");//Hecho
var datosMedico = app.procedure("datosMedico");//Hecho
var listadoMuestras = app.procedure("listadoMuestras");//Hecho
var listadoVariables = app.procedure("listadoVariables");//Hecho
var eliminarMuestra = app.procedure("eliminarMuestra");//Hecho
var modificarMuestra = app.procedure("modificarMuestra");//Hecho
var anyadirMuestra = app.procedure("anyadirMuestra");//Hecho




var seccionActual = "loginPaciente";
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}

var pacienteActual = "";
var medico = "";
var muestras = "";
var variables= "";
var muestraActual = "";
var listaPacientesMedico = "";
var aquiencomparte = "";


listadoVariables(function (vari) {
    variables = vari;
})

function entrar(){
    var codigo = document.getElementById("codigo_acceso").value;
    loginPaciente(codigo, function(paciente){
        if (paciente != null){
            conexion = new WebSocket('ws://localhost:4444', "conexion");
            conexion.addEventListener("open", function (event){
                recargar(paciente);
                conexion.send(JSON.stringify({ origen: "sollistapacientes", idMedico: parseInt(pacienteActual.medico), idPaciente: pacienteActual.id }));
            })
            
            
        }
        conexion.addEventListener('message', function (event) {
            console.log("Mensaje del servidor:", event.data);
            var msg = JSON.parse(event.data);
            switch(msg.origen){
                case "sollistapaciente":
                    listaPacientesMedico = msg.mensaje;
                    
                    break;
                case "compartirparticular":
                    alert(msg.mensaje);
                    recargar(pacienteActual);
                    break;
            }
        });
    })   
     
    
}

//Funcion que nos recarga la pagina del paciente
function recargar(paciente){
    pacienteActual=paciente;
    datosMedico(paciente.medico, function(med){
        medico = med;
        console.log("Hola mi medico es:"+medico.id);
        bienvenida(pacienteActual);
        cambiarSeccion("menu-paciente");
    })
    
    listadoMuestras(pacienteActual.id, function(mues){
        muestras=mues;
        mostrarMuestras();  
        mostrarVariables();   
    })
    formanyadirmuestras();
    
}
//Compartir muestras
function ircompartirmuestra(muestra){
    muestraActual = muestra;
    console.log(variables);
    var selecCompartir = document.getElementById("lista-compartir-muestra");
    selecCompartir.innerHTML = "";
    selecCompartir.innerHTML += "<option value='mimedico'>Mi medico</option>";
    selecCompartir.innerHTML += "<option value='todospacientes'>Todos los pacientes de mi medico</option>";
    for(i in listaPacientesMedico){
        selecCompartir.innerHTML += "<option value="+listaPacientesMedico[i].id+">"+listaPacientesMedico[i].nombre+"</option>"
    }
    cambiarSeccion("compartir-muestra");
}

function compartirMuestra(){
    for(i in variables){
        if(variables[i].id == muestraActual){
            var nomMuestra = variables[i].nombre;
        }
    }
    for(i in muestras){
        if(muestras[i].id == muestraActual){
            fechaMuestra = muestras[i].fecha;
            valorMuestra = muestras[i].valor;
        }
    }
    var quiencompartir = document.getElementById("lista-compartir-muestra").value;
    console.log(quiencompartir);
    if(quiencompartir == "mimedico"){
        console.log(medico.id);
        conexion.send(JSON.stringify({ origen: "compartirmimedico", quiencompartir: medico.id, nomMuestra: nomMuestra, fechaMuestra: fechaMuestra, valorMuestra: valorMuestra, nomPaciente: pacienteActual.nombre }));
    }
    if(quiencompartir == "todospacientes"){
        conexion.send(JSON.stringify({ origen: "compartirtodospacientes", nomMuestra: nomMuestra, fechaMuestra: fechaMuestra, valorMuestra: valorMuestra, nomPaciente: pacienteActual.nombre }));
    }
    else{
        conexion.send(JSON.stringify({ origen: "compartirparticular", quiencompartir: quiencompartir, nomMuestra: nomMuestra, fechaMuestra: fechaMuestra, valorMuestra: valorMuestra, nomPaciente: pacienteActual.nombre }));
    }
    recargar(pacienteActual);
}
    //Mensaje de bienvenida para el paciente
function bienvenida(pacienteActual){
    var mensaje_bienvenida = document.getElementById("bienvenida_paciente");
    mensaje_bienvenida.innerHTML ="";
    mensaje_bienvenida.innerHTML += '<p>Bienvenid@: '+pacienteActual.nombre+'</p>';
    mensaje_bienvenida.innerHTML += '<p>Su médic@ es: '+medico.nombre+'</p>';
    mensaje_bienvenida.innerHTML += '<p>Observaciones: '+pacienteActual.observaciones+'</p>';
}
    //Pequeño formulario para añadir nuevas muestras
function formanyadirmuestras(){
    var anyadirmuestra = document.getElementById("anyadirmuestra");
    anyadirmuestra.innerHTML = "";
    anyadirmuestra.innerHTML += "<h2>Añadir Muestras</h2>";
    anyadirmuestra.innerHTML += "<form id='formulariomuestras'></form>";
    var formuestras = document.getElementById("formulariomuestras");
    formuestras.innerHTML += "<select id='anyadirmuestras'></select>";
    var desplegable = document.getElementById("anyadirmuestras");
    for(i in variables){
        desplegable.innerHTML += "<option>"+variables[i].nombre+"</option>"
    }
    
    formuestras.innerHTML += "<label for='valormuestra'>Valor</label>";
    formuestras.innerHTML += "<input type='text' id='valormuestra'>";
    //La fecha por defecto es la actual.
    formuestras.innerHTML += "<input type='date' id='fechamuestra'>";
    formuestras.innerHTML += "<button onclick='anyadirmuestra()'>Añadir</button>";
}
//Apartado donde aparecen las muestras del paciente.
function mostrarMuestras(){
    var mismuestras = document.getElementById("mismuestras");
    mismuestras.innerHTML = "";
    mismuestras.innerHTML += '<h2>Tus muestras</h2>';
    
    for(i in muestras){
        idvar = muestras[i].variable;
        for(e in variables){
            if(variables[e].id == muestras[i].variable){
                var nomMuestra = variables[e].nombre;
            }
        }
        mismuestras.innerHTML += "<dt>Variable: "+nomMuestra+"</dt>";
        mismuestras.innerHTML += "<dd>Valor: "+muestras[i].valor+"</dd>";
        mismuestras.innerHTML += "<dd>Fecha: "+muestras[i].fecha+"</dd>";
        mismuestras.innerHTML += "<button onclick=eliminarmuestra("+muestras[i].id+")>Eliminar</button>";
        mismuestras.innerHTML += "<button onclick=irmodmuestra("+muestras[i].id+")>Modificar</button>";
        mismuestras.innerHTML += "<button onclick='ircompartirmuestra("+muestras[i].id+")'>Compartir</button>";
    }
}
//Selector que nos permite filtrar por variable.
function mostrarVariables(){
    var filtromuestras = document.getElementById("filtromuestras");
    filtromuestras.innerHTML = "";
    filtromuestras.innerHTML += '<h2>Filtro de Muestras</h2>';
    filtromuestras.innerHTML += '<button onclick=muestrasfiltradas()>Filtrar</button>';
    filtromuestras.innerHTML += '<select id="listavariables"></select>';
    var desplegable = document.getElementById("listavariables");
    for(i in variables){
        desplegable.innerHTML += '<option>'+variables[i].nombre+'</option>';
    }

}

//Añade una muestra nueva con los valores introducidos por el paciente
function anyadirmuestra(){
    var variablenueva = document.getElementById("anyadirmuestras").value;
    var valornueva = document.getElementById("valormuestra").value;
    var fechanueva = document.getElementById("fechamuestra").value;
    anyadirMuestra(pacienteActual.id, variablenueva, valornueva, fechanueva);
    recargar(pacienteActual);
}

//Muestra las muestras que son filtradas por la variable
function muestrasfiltradas(){
    var selecionada = document.getElementById("listavariables").value;
    var mismuestras = document.getElementById("mismuestras");
    mismuestras.innerHTML = "";
    mismuestras.innerHTML += '<h2>Tus muestras</h2>';
    for(i in muestras){
        idvar = muestras[i].variable;
        for(e in variables){
            if(variables[e].id == muestras[i].variable){
                var nomMuestra = variables[e].nombre;
            }
            
        }
        if(nomMuestra == selecionada){
            mismuestras.innerHTML += "<dt>Variable: "+nomMuestra+"</dt>";
            mismuestras.innerHTML += "<dd>Valor: "+muestras[i].valor+"</dd>";
            mismuestras.innerHTML += "<dd>Fecha: "+muestras[i].fecha+"</dd>";
            mismuestras.innerHTML += "<button onclick=eliminarmuestra("+muestras[i].id+")>Eliminar</button>";
            mismuestras.innerHTML += "<button onclick=irmodmuestra("+muestras[i].id+")>Modificar</button>";
            mismuestras.innerHTML += "<button onclick='ircompartirmuestra("+muestras[i].id+")'>Compartir</button>";
        }
        
    }
}

function irmodmuestra(muestra){
    muestraActual=muestra;
    console.log(muestra);
    var listaVarMod = document.getElementById("varMod");
    listaVarMod.innerHTML = "";
    for(i in variables){
        listaVarMod.innerHTML += '<option>'+variables[i].nombre+'</option>';
    }
    cambiarSeccion("modificar-muestra");
}

function salir(){
    cambiarSeccion("loginPaciente");
}

function modificarmuestra(){
    var nuevaVar = document.getElementById("varMod").value;
    console.log(nuevaVar);
    var nuevaFecha = document.getElementById("fechaMod").value;
    var nuevaVal = document.getElementById("valMod").value;
    modificarMuestra(muestraActual, nuevaVar, nuevaFecha, nuevaVal, function(retorno){
        if(retorno == true){
            recargar(pacienteActual); 
            cambiarSeccion("menu-paciente");  
        }
    })
      
}

function mostrarPacientes(pacientes){
    console.log("Pintamos los pacientes");
    //La utilizamos para generar el código HTML
    var codigoHTML="";
    for(var i=0;i<pacientes.length;i++){
        codigoHTML=codigoHTML+"<li>"+pacientes[i].nombre+" "+pacientes[i].apellidos+" ("+pacientes[i].edad+") ";
        codigoHTML=codigoHTML+"<button onclick=\"eliminar("+pacientes[i].id+")\">Eliminar</button></li>"
    }
    document.getElementById("listaPacientes").innerHTML=codigoHTML;
}

function anyadir(){
    //Obtienen los valores introducidos en los input de HTML
    var nom=document.getElementById("nombre").value;
    var ape=document.getElementById("apellidos").value;
    var ed=document.getElementById("edad").value;

    var ed_num=parseInt(ed);

    var idGenerado=anyadirPaciente(nom,ape,ed_num);
    if(idGenerado==-1){
        alert("No se ha podido dar de alta el paciente, revise los datos");
    }else{
        recargar();
    } 
}

function eliminar(id){
    var retorno=eliminarPaciente(id);
    if(retorno==true){
        console.log("Se ha borrado el paciente");
    }else{
        console.log("No se  ha podido borrar el paciente");
    }
    recargar();
}


function eliminarmuestra(idMuestra){
    eliminarMuestra(idMuestra, function(retorno){
        if(retorno==true){
            console.log("Se ha borrado la muestra");
            recargar(pacienteActual);
        }else{
            console.log("No se  ha podido borrar la muestra");
        }
    })    
}

