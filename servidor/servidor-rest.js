var express = require("express");
var app = express();

//Hacemos referencia a los datos.
var datos = require('./datos.js');

var pacientes = datos.pacientes;
var medicos = datos.medicos;
var variables = datos.variables;
var muestras = datos.muestras;
var acciones = datos.acciones;
var siguientePaciente = datos.siguientePaciente;
var siguienteMuestra = datos.siguienteMuestra;

//Accede al index html de nuestra carpeta indicada
app.use("/medico", express.static("../medico"));
app.use("/paciente", express.static("../paciente"));
//app.use(express.static("../css" + '/public'));

app.use(express.json()); // en el req.body tengamos el body JSON

//Va mostrando una seccion u otra.
var seccionActual = "login";
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}

//Comprueba si el login del medico es correcto y devuelve la id de ese medico.
app.post("/api/medico/login", function(req,res){
    var medico = {
        login: req.body.login,
        password: req.body.password
    };
    for(i in medicos){
        if(medico.login == medicos[i].login && medico.password == medicos[i].password){
            res.status(201).json(medicos[i].id);
            console.log("id del medico logeado"+medicos[i].id)
            return;
        }   
        
    }
    res.status(403).json("Médico o contraseña incorrecta");
})

//Elimina un paciente de la lista y sus muestras
app.delete("/api/paciente/:id", function(req,res){
    var check = true;
    if (check == true){
        var idPaciente =req.params.id;
        var nuevasmuestras = [];
        for(i in pacientes){
            if(pacientes[i].id == idPaciente){
                pacientes.splice(i, 1);
            }
        }
        
        for(i in muestras){
            if(muestras[i].paciente != idPaciente){
                nuevasmuestras.push(muestras[i]);
            }
        }
        muestras = nuevasmuestras;
        console.log(pacientes);
        res.status(200).json("Paciente eliminado");
        return;
    }
    
    res.status(403).json("Paciente no encontrado.");
})

//Duplicar Muestras de un paciente en concreto
app.post("/api/paciente/:id/duplicar", function(req,res){
    var id = req.params.id;
    
    for(i in pacientes){
        if(pacientes[i].id == id){
            nuevopaciente = {
                id : siguientePaciente,
                nombre: pacientes[i].nombre,
                fecha_nacimiento: pacientes[i].fecha_nacimiento,
                genero: pacientes[i].genero,
                medico: pacientes[i].medico,
                codigo_acceso: pacientes[i].codigo_acceso,
                observaciones: pacientes[i].observaciones

            };
            
            pacientes.push(nuevopaciente);
        }
    }
    siguientePaciente ++;
    console.log(pacientes);
    return res.status(201).json(pacientes);
    
})
//Compueba que el medico logeado existe en la lista.
app.get("/api/medico/:id", function(req,res){
    var id = req.params.id;
    medico = "";
    for(i in medicos){
        if (medicos[i].id == id){
            medico = {
                id: id,
                nombre: medicos[i].nombre,
                login: medicos[i].login
            }
            res.status(200).json(medico);
            return;
        }
            
        
    }
    res.status(403).json("Médico no encontrado.");
    
})
//Devuelve un array con los pacientes del medico con la id pasada como parametro.
app.get("/api/medico/:id/pacientes", function(req,res){
    var check = false;
    var id= req.params.id;
    listapacientes = [];
    for (i in pacientes){
        if (pacientes[i].medico == id){
            listapacientes.push(pacientes[i]);
            check = true;
        }
    }
    if(check == true){
        res.status(200).json(listapacientes);
    }else{
        res.status(404).json("Este médico no existe.")
    }
    
})
//Devuelve un array con los medicos
app.get("/api/medico/:id/listamedicos", function(req,res){
    var check = true;
    
    if(check == true){
        res.status(200).json(medicos);
    }
    else{
        res.status(404).json("Este médico no existe.")
    }
    
})

app.get("/api/paciente/:id", function(req,res){
    var id = req.params.id;
    paciente = "";
    for(i in pacientes){
        if (pacientes[i].id == id){
            paciente = {
                id: id,
                nombre: pacientes[i].nombre,
                medico: pacientes[i].medico,
                observaciones: pacientes[i].observaciones
            }
            res.status(200).json(paciente);
            return;
        }
    }
    res.status(403).json("Médico no encontrado.");
})

//Crea un nuevo paciente.
app.post('/api/medico/:id/pacientes', function(req,res){
    var nom = req.body.nombre;
    var fecha_nacimiento = req.body.fecha_nacimiento;
    var genero = req.body.genero;
    var medico = req.body.medico;
    var codigo = req.body.codigo_acceso;
    var obser = req.body.observaciones;
    if(!nom || !fecha_nacimiento || !genero || !medico || !codigo || !obser){
        res.status(404).json("Error");
    }
    else{
        var paciente_nuevo = {
            id: siguientePaciente,
            nombre: nom,
            fecha_nacimiento: fecha_nacimiento,
            genero: genero,
            medico: medico,
            codigo_acceso: codigo,
            observaciones: obser,
        }
        siguientePaciente ++;
        pacientes.push(paciente_nuevo);
        res.status(201).json(pacientes);
    }
})
//Modifica la lista de pacientes.
app.put('/api/paciente/:id', function(req,res){
    for(i in pacientes){
        if(pacientes[i].id == req.body.id){
            pacientes[i].nombre = req.body.nombre;
            pacientes[i].fecha_nacimiento = req.body.fecha_nacimiento;
            pacientes[i].genero = req.body.genero;
            pacientes[i].medico = req.body.medico;
            pacientes[i].codigo_acceso = req.body.codigo_acceso;
            pacientes[i].observaciones = req.body.observaciones;
            res.status(200).json(pacientes[i]);
        }
    }
    
})

//Devuelve un array con las variables
app.get("/api/variable", function(req, res){
    var listavariables = variables;
    res.status(200).json(listavariables);
})

//Devuelve las muestras de un paciente.
app.get("/api/paciente/:id/muestras", function(req,res){
    var idpaciente = req.params.id;
    listamuestras= [];
    for(i in muestras){
        if(muestras[i].paciente== idpaciente){
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
    });
    res.status(200).json(listamuestras);
    
})

app.listen(8080);