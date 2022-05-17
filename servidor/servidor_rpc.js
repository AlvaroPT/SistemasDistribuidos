var rpc = require("./rpc.js");
var datos=require("./datos.js");


var nuevoId=2;
var pacientes=datos.pacientes;
var medicos=datos.medicos;
var variables=datos.variables;
var muestras=datos.muestras;
var siguienteMuestra=datos.siguienteMuestra;

function loginPaciente(codigo){
    for(i in pacientes){
        if(pacientes[i].codigo_acceso == codigo){
            return pacientes[i];
        }
    }
    return null;
}


function datosMedico(idMedico){
    for(i in medicos){
        if(medicos[i].id == idMedico){
            return medicos[i];
        }
    }
}

function listadoVariables(){
    return variables;
}

function listadoMuestras(idPaciente){
    listamuestras= [];
    for(i in muestras){
        if(muestras[i].paciente== idPaciente){
            listamuestras.push(muestras[i]);
        }
    }
    listamuestras.sort(function(a,b){
        if(a.variable < b.variable){
            return -1;
        }
        if(a.variable > b.variable){
            return 1;
        }
        if(a.fecha < b.fecha){
            return -1;
        }
        if(a.fecha > b.fecha){
            return 1;
        }
        return 0;
    })
    return listamuestras;
}

function obtenerPacientes(){
    console.log("Se solicitan los pacientes");
    return pacientes;
}

function anyadir_asincrono(){
    var nom=document.getElementById("nombre").value;
    var ape=document.getElementById("apellidos").value;
    var ed=document.getElementById("edad").value;
    var ed_num=parseint(ed);

    anyadirPaciente(nom, ape, ed_num, function(){

    })
}



function eliminarPaciente(id){
    for(var i=0; i<pacientes.length; i++){
        if(pacientes[i].id==id){
            //Borrar el paciente
            pacientes.splice(i,1);
            console.log("Paciente borrado con identificador", id);
            return true;
        }
    }
    return false;
}

function eliminar_asincrono(id){
    console.log("Llamamos a eliminar de manera asincrona");
    eliminarPaciente(id, function(retorno){
        if(retorno==true){
            console.log("Se ha borrado el paciente");
            recargar_asincrono();
        }
        else{
            alert("No se ha podido eliminar paciente");
        }
    })
    console.log("Esto se ejecuta antes de confirmar que se ha eliminado el paciente.")
}

function eliminarMuestra(idMuestra){
    for(i in muestras){
        if(idMuestra == muestras[i].id){
            muestras.splice(i,1);
            return true;
        }
    }

}

function modificarMuestra(muestraActual, nuevaVar, nuevaFecha, nuevaVal){
    for(i in muestras){
        if(muestras[i].id == muestraActual){
            for(n in variables){
                if(nuevaVar == variables[n].nombre){
                    muestras[i].variable = variables[n].id;
                    console.log(variables[n].id)
                }
            }
            muestras[i].fecha = nuevaFecha;
            muestras[i].valor = nuevaVal;
            return true;
        }
    }
    
}

function anyadirMuestra(paciente,variable, valornueva, fechanueva){
    for(i in variables){
        if(variables[i].nombre == variable){
            console.log(variables[i].id);
            var variablenueva = variables[i].id;
        }
    }
    var nuevaMuestra={id:siguienteMuestra, paciente:paciente, variable:variablenueva, fecha:fechanueva, valor:valornueva}
    muestras.push(nuevaMuestra);
    siguienteMuestra ++;
    console.log(muestras);
    return true;
}

function anyadirPaciente(nombre, apellidos, edad){
    console.log("Nuevo Paciente", nombre, apellidos, edad);
    if(!nombre || !apellidos || !edad){
        return -1;
    }else{
        var nuevoPaciente={id: nuevoId, nombre: nombre, apellidos: apellidos, edad:edad}
        var retorno=nuevoId;
        pacientes.push(nuevoPaciente);
        nuevoId++;
        return retorno;
    }
}

var servidor = rpc.server();
var app = servidor.createApp("MiGestionPacientes");

app.register(obtenerPacientes);
app.register(anyadirPaciente);
app.register(eliminarPaciente);
app.register(loginPaciente);
app.register(datosMedico);
app.register(listadoMuestras);
app.register(listadoVariables);
app.register(eliminarMuestra);
app.register(modificarMuestra);
app.register(anyadirMuestra);

