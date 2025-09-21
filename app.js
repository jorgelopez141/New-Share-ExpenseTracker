var express = require("express"),
app = express(),
socket = require('socket.io'),
bodyParser = require("body-parser");
const sql = require('mssql');
var multer = require('multer');
//var fs = require('file-system'); //para borrar archivos
const fs = require('fs'); // para borrar archivos
var path = require('path'); // Es para poder mantener el extension name
var server1 = app.listen(3000,function(){
  console.log("escuchando")
});
/*io = socket(server1);*/


/*                    socket io*/
/*io.on('connection',function(socket){
      console.log('we made socket connection', socket.id);

      socket.on('chat', function(){
              io.sockets.emit('chat');
      })
})*/
/*                    socket io*/


var storage = multer.diskStorage({
		  destination: function (req, file, cb) {
		    cb(null, 'public/uploads/') // aqui se guarda cada foto
		  },
		  filename: function (req, file, cb) {
		    cb(null, Date.now() + path.extname(file.originalname)) //esto le pone el nombre a cada foto
		  }
})

var upload = multer({ storage: storage });
app.use(express.static("public")); //donde se guardan los archivos locales: fotos, css, etc..
//sino pones esto, entonces no vas a poder hacer referencia a las fotos con src = xyxy

//funciono
//fs.unlinkSync('./public/uploads/brujo.png')


//APP CONFIG
app.set("view engine","ejs"); // para no tener que poner ejs al final de cada archivo en render
app.use(express.static("public")); // para tener CSS y Javascript files en folder llamado public
app.use(bodyParser.urlencoded({extended: true})); //para poder usar las variables req.body...


var config = {

	server: "192.168.1.129",//"WIN-3GIT7G6LQCJ\\SUPERMAN2025", //"DESKTOP-MEJA2OJ" /*"LAPTOP-2JKF563A\\BATMAN2012"*/,/*"DESKTOP-MEJA2OJ",*/
	user: "sa",
	password: "Modem56k",
	database: "Situacion_Financiera",
	port: 1433,
	options: {
    encrypt: true, // Must be true to match "Mandatory" in SQL Server
    trustServerCertificate: true // Allow self-signed certificates
  }
};

const executeQuery = function (res, query) {
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    console.log(query);
                    res.redirect("/");

                }
            });
        }
    });
}

var elArraysito

const executeQuery1 = function (res, query) {
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    
                    elArraysito = result;
                    
                    res.redirect("/resultadosFiltro");

                }
            });
        }
    });
}

//RESTful Route




app.get("/", async (req, res) => {     
      await sql.connect(config);

      /*const q1 = await sql.query`select * from lasImagenesUno order by id desc `;*/
      const supermercado1 = await sql.query`select distinct cat_especifica from tGastosFoto where cat_gasto = 'Supermercado'`;     
     
      const last3 = await sql.query`select top 10 * from tGastosFoto order by id desc`;     
     
 
      
      res.render("index",{supermercado: supermercado1,last3: last3})
   
});

app.get('/show/:id', async (req, res) => {
      await sql.connect(config);
      
      const r1 = await sql.query`select * from tGastosFoto where id = ${req.params.id}`;
      
      //console.log(r1)
      res.render('showFoto.ejs',{data1: r1})

});

app.get('/filtroBase', async (req, res) => {
          
      //console.log(r1)
      res.render('filtroBD.ejs')

});

app.get('/resultadosFiltro', async (req, res) => {
          
      //console.log(r1)
      res.render('resultadosFiltroBD.ejs',{elArraysito:elArraysito})

});

app.get('/saldoBanco', async (req, res) => {
      await sql.connect(config);

      /*const q1 = await sql.query`select * from lasImagenesUno order by id desc `;*/
      const mirarUltimoSaldo1 = await sql.query`select * from mirarUltimoSaldo`;    
      //console.log(r1)
      res.render('saldoBanco.ejs',{ultimoSaldo:mirarUltimoSaldo1})

});



app.post("/filtroBase", function(req, res){

 
  //{ categoriaGasto1: 'Supermercado', catEspecifica1: '' }
  //{ categoriaGasto1: 'Supermercado', catEspecifica1: 'leche' }

  var queryBase = `select * from tGastosFoto`
  dic_pegarSQL = {categoriaGasto1: 'cat_gasto', catEspecifica1: 'cat_especifica', banco_destino: 'bancoDestino'}

  var contandoDiccionario = 0

  for(Diccionario_element in req.body){
    //console.log(req.body[Diccionario_element].length)

        if (req.body[Diccionario_element].length>0) {
            contandoDiccionario = contandoDiccionario + 1

              if(contandoDiccionario == 1 ){
                queryBase = queryBase+` where `+ dic_pegarSQL[Diccionario_element] + ` like ` + `'%`+req.body[Diccionario_element]+`%'`

              } else 
              {
                queryBase = queryBase + ` and `+ dic_pegarSQL[Diccionario_element] + ` like ` + `'%` + req.body[Diccionario_element]+ `%'` 
              }

        }


  }

 // console.log(req.body) --> esto te sirve para ver lo que viene del formulario
 // console.log(queryBase) --> esto te sirve para ver lo que imprime el texto

  var query = queryBase + `order by Fecha desc`
  //var query = `select * from tGastosFoto where cat_gasto = '${req.body.categoriaGasto1}'
    //            and cat_especifica = '${req.body.catEspecifica1}'`;

  // ya no necesitas esto porque el trigger en sql ya mueve automaticamente la informacion de gastosHijos a tGastosFoto
  // if(req.body.categoriaGasto1=='Gastos para Madres'){
  //   var query = `select * from gastosHijos where nombre_madre = '${req.body.catEspecifica1}' order by id desc`
  // }


  executeQuery1 (res, query);  
})


app.post("/", upload.single('imagen'),function(req, res){

            console.log("este es el body que se envia")
            console.log(req.body)            
            var factura = 0

            if(req.body.esFactura==1){
              factura = 1
            }
   
            if(req.file !== undefined){ //dado que se inserte un archivo
             //consoCOe.log(req.file.filename) //esto es el nombre del archivo

              //si hay un archivo, entonces se inserta el nombre del archivo en la base de datos 


                  var query = `INSERT INTO tGastosFoto VALUES (
                    '${req.body.Fecha}',
                  ${req.body.montoGastado},
                  '${req.body.categoriaGasto}',
                  '${req.body.catEspecifica}',
                  '${req.body.descripcion}',
                  '${req.file.filename}',

                  '${req.body.banco_origen}',
                  '${req.body.cuenta_origen}',
                  '${req.body.num_confirmacion}',`+factura+
                   `,
                   '${req.body.banco_destino}',
                   '${req.body.cuenta_destino}',
                   cast(getdate() as date)                   
                   `+ `)`;
                      
           
            } else {
                      var query = `INSERT INTO tGastosFoto (Fecha,MontoGasto,cat_gasto,cat_especifica,descripcion,
                      bancoOrigen,cuentaOrigen,numConfirmacion,esFactura,bancoDestino,cuentaDestino, FECHA_LOADED) VALUES (                      
                       '${req.body.Fecha}',
                       ${req.body.montoGastado},
                  '${req.body.categoriaGasto}',
                  '${req.body.catEspecifica}',
                  '${req.body.descripcion}',
                  '${req.body.banco_origen}',
                  '${req.body.cuenta_origen}',
                  '${req.body.num_confirmacion}',`+ factura+
                   `,
                   '${req.body.banco_destino}',
                   '${req.body.cuenta_destino}',
                    cast(getdate() as date)                   
                   `+ 
                  `)` ;
                    

            }
          /* query = `select 1`
           console.log(req.body.Fecha)*/
     console.log(query)
     executeQuery (res, query);   


})

/* io.on('connection',function(socket){
            console.log('we made socket connection', socket.id);

            socket.on('chat', function(){
                    io.sockets.emit('chat');
            })
      })*/



app.post("/borrar/:id",function(req,res){

    if(isNaN(Number(req.params.id))){ //si es int, entonces se borra por id
      // si no es int, entoncs se borra por foto
        var query1 = `delete from tSaldoBancos where id_origen in (select id from tGastosFoto where imagen = '${req.params.id}'); \n 
        delete from tGastosFoto where imagen = '${req.params.id}';`
        fs.unlinkSync(`./public/uploads/${req.params.id}`)
    } else {
        //se borrar por id
        var query1 = `delete from tSaldoBancos where id_origen = ${req.params.id} \n delete from tGastosFoto where id = ${req.params.id}`
    }   
    
    executeQuery (res, query1);
})


//hay que mejorar el editar

//se tiene que llevar a un formulario que se pueble con la informacion contenida

//luego se tiene que tener un post que tenga la condicional que si se cambio la foto o no

app.get('/editar/:id', async (req, res) => {
      await sql.connect(config);
      
      const r2 = await sql.query`select * from lasImagenesUno where id = ${req.params.id}`; 
      
      //console.log(r1)
     res.render('editando.ejs',{data1: r2})

});

app.post("/seEdita", upload.single('imagen'),function(req, res){

      //dado que habia un archivo y lo borraron
      //al momento de darle submit se detach la foto que tenia
     if(req.body.nombreArchivo == ''){

                  fs.unlinkSync(`./public/uploads/${req.body.noSeMira}`)

                              
                  if(req.file == undefined){
                  
                  //si no mete un archivo nuevo
                  //solo modifica descripcion y Titulo/NombrePersona
                    var query = `Update lasImagenesUno  
                                 set nombrePersona = '${req.body.nombrePersona}',
                                 descripcion = '${req.body.descripcion}',
                                 nombreArchivo = NULL
                                 where id = ${req.body.elId} `;                      
           
                  } else {

                     var query = `Update lasImagenesUno  
                     set nombrePersona = '${req.body.nombrePersona}',
                     descripcion = '${req.body.descripcion}',
                     nombreArchivo = '${req.file.filename}'
                     where id = ${req.body.elId} `;         

                  }

     } else {

           if(req.file == undefined){
                        
                        //si no mete un archivo nuevo
                        //solo modifica descripcion y Titulo/NombrePersona
                        var query = `Update lasImagenesUno  
                                     set nombrePersona = '${req.body.nombrePersona}',
                                     descripcion = '${req.body.descripcion}'                               
                                     where id = ${req.body.elId} `;
                            
                 
              } else {

                      //si mete archivo nuevo
                      //se modifica descripcion, Titulo, y nombre Archivo
                      //y se borra el archivo anterior


                      //dado que imagen no diga null, entonces se borra el archivo

                      if(req.body.nombreArchivo == 'NULL'){
                                     var query = `Update lasImagenesUno  
                                     set nombrePersona = '${req.body.nombrePersona}',
                                     descripcion = '${req.body.descripcion}',
                                     nombreArchivo = '${req.file.filename}'
                                     where id = ${req.body.elId} `;                

                      } else {

                                     var query = `Update lasImagenesUno  
                                     set nombrePersona = '${req.body.nombrePersona}',
                                     descripcion = '${req.body.descripcion}',
                                     nombreArchivo = '${req.file.filename}'
                                     where id = ${req.body.elId} `;      

                                    
                                     fs.unlinkSync(`./public/uploads/${req.body.noSeMira}`)          
                      }
                        


                        
              }

     }

     //dado que metieron un archivo o no



      

     executeQuery (res, query);   

})

