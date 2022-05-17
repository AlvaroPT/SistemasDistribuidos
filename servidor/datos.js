var medicos =[
    {id:1,nombre:"Alvaro",login:"pt20",password:"1234"},
    {id:2,nombre:"Ines",login:"pt21",password:"1234"},
    {id:3,nombre:"Luisa",login:"pt22",password:"1234"}
];

var pacientes = [{id:1,nombre:"Pablo",fecha_nacimiento:"1997-03-25",genero:"Masculino",medico:"1",codigo_acceso:"1234",observaciones:"Hola mundo"},
                {id:2,nombre:"Hector",fecha_nacimiento:"1995-09-15",genero:"Masculino",medico:"1",codigo_acceso:"1235",observaciones:"Hola mundo"},
                {id:3,nombre:"Yi",fecha_nacimiento:"2001-12-24",genero:"Femenino",medico:"2",codigo_acceso:"1236",observaciones:"Hola mundo"},
                {id:4,nombre:"Ende",fecha_nacimiento:"2001-06-28",genero:"Masculino",medico:"1",codigo_acceso:"1237",observaciones:"Hola mundo"}
];

var variables = [{id:1,nombre:"Peso"},
                {id:2,nombre:"Metros andados"},
                {id:3,nombre:"Metros corridos"},
                {id:4,nombre:"Minutos de ejercicio realizados"}
];

var muestras = [{id:1,paciente:1,variable:1,fecha:"2010-03-05",valor:"60"},
                {id:2,paciente:2,variable:1,fecha:"2010-10-05",valor:"55"},
                {id:3,paciente:1,variable:2,fecha:"2010-04-05",valor:"1000"},
                {id:4,paciente:1,variable:1,fecha:"2010-12-05",valor:"2000"},
                {id:5,paciente:1,variable:3,fecha:"2010-01-01",valor:"2000"}
];

var siguienteMuestra = 6

var acciones=[{id: 1, nombre: "Correr",  valor:30}];

var siguientePaciente = 5;

module.exports.medicos=medicos;
module.exports.pacientes=pacientes;
module.exports.variables=variables;
module.exports.muestras=muestras;
module.exports.acciones=acciones;
module.exports.siguientePaciente=siguientePaciente;
module.exports.siguienteMuestra=siguienteMuestra;

