var express = require("express"),
app = express(),
socket = require('socket.io'),
bodyParser = require("body-parser");

// Cambio: Reemplazar SQL Server con Mongoose
const mongoose = require('mongoose');
var multer = require('multer');
const fs = require('fs'); // para borrar archivos
var path = require('path'); // Es para poder mantener el extension name

var server1 = app.listen(3000,function(){
  console.log("escuchando")
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/DB_APP_GASTOS', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

// Esquema para la colección GASTOS_FOTO
const gastosSchema = new mongoose.Schema({
  id: Number ,
  Fecha: { type: Date, required: true },
  MontoGasto: { type: Number, required: true },
  cat_gasto: { type: String, required: true },
  cat_especifica: { type: String },
  descripcion: { type: String },
  imagen: { type: [String] },
  latitud: { type: String },
  longitud: { type: String },
  bancoOrigen: { type: String },
  cuentaOrigen: { type: String },
  numConfirmacion: { type: String },
  esFactura: { type: Number, default: 0 },
  bancoDestino: { type: String },
  cuentaDestino: { type: String },
  FECHA_LOADED: { type: Date}
});

const GastosFoto = mongoose.model('GASTOS_FOTO', gastosSchema, 'GASTOS_FOTO');

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

//APP CONFIG
app.set("view engine","ejs"); // para no tener que poner ejs al final de cada archivo en render
app.use(express.static("public")); // para tener CSS y Javascript files en folder llamado public
app.use(bodyParser.urlencoded({extended: true})); //para poder usar las variables req.body...

var elArraysito

//RESTful Routes

app.get("/", async (req, res) => {     
  try {
    // Obtener categorías específicas distintas para supermercado
    const supermercado1 = await GastosFoto.distinct('cat_especifica', { cat_gasto: 'Supermercado' });
    
    // Obtener los últimos 10 registros
    const last3 = await GastosFoto.find({}).sort({ id: -1 }).limit(10);
    

    res.render("index", {
      supermercado: supermercado1.map(item => ({ cat_especifica: item })), // Formato compatible con EJS
      last3: { recordset: last3 } // Formato compatible con EJS
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get('/show/:id', async (req, res) => {
  try {
    const r1 = await GastosFoto.findById(req.params.id);
    
    res.render('showFoto.ejs', {
      data1: { recordset: [r1] } // Formato compatible con EJS
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get('/filtroBase', async (req, res) => {
  res.render('filtroBD.ejs');
});

app.get('/resultadosFiltro', async (req, res) => {

  
  res.render('resultadosFiltroBD.ejs', { elArraysito: { recordset: elArraysito } });
});

app.get('/saldoBanco', async (req, res) => {
  try {
    // Esta funcionalidad requeriría una colección separada para saldos bancarios
    // Por ahora devolvemos un array vacío
    const mirarUltimoSaldo1 = [];
    
    res.render('saldoBanco.ejs', { ultimoSaldo: { recordset: mirarUltimoSaldo1 } });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/filtroBase", async function(req, res){
  try {
    let query = {};
    
    // Construir query dinámicamente basado en los campos del formulario
    if (req.body.categoriaGasto1 && req.body.categoriaGasto1.length > 0) {
      query.cat_gasto = { $regex: req.body.categoriaGasto1, $options: 'i' };
    }
    
    if (req.body.catEspecifica1 && req.body.catEspecifica1.length > 0) {
      query.cat_especifica = { $regex: req.body.catEspecifica1, $options: 'i' };
    }
    
    if (req.body.banco_destino && req.body.banco_destino.length > 0) {
      query.bancoDestino = { $regex: req.body.banco_destino, $options: 'i' };
    }

    console.log("Query MongoDB:", query);
    
    elArraysito = await GastosFoto.find(query).sort({ Fecha: -1 });
    
    res.redirect("/resultadosFiltro");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/", upload.array('imagen', 10), async function(req, res){
  try {

    const maxIdDoc = await GastosFoto.findOne().sort({ id: -1 }).select('id');
       
    const maxId = maxIdDoc ? maxIdDoc.id : 0;

    
    const nuevoId = maxId + 1;

    console.log(maxId, nuevoId)

    console.log("este es el body que se envia");
    console.log(req.body);
    
    let factura = 0;
    if (req.body.esFactura == 1) {
      factura = 1;
    }

  // Crear nuevo documento
  const uploadedFiles = req.files && req.files.length ? req.files.map(f => f.filename) : (req.file ? [req.file.filename] : null);

  const nuevoGasto = new GastosFoto({
      id: nuevoId,
      Fecha: req.body.Fecha ? String(req.body.Fecha) : "",
      MontoGasto: parseFloat(req.body.montoGastado),
      cat_gasto: req.body.categoriaGasto,
      cat_especifica: req.body.catEspecifica,
      descripcion: req.body.descripcion,
  imagen: uploadedFiles,
      latitud: req.body.latitud ? String(req.body.latitud) : null,
      longitud: req.body.longitud ? String(req.body.longitud) : null,
      bancoOrigen: req.body.banco_origen,
      cuentaOrigen: req.body.cuenta_origen,
      numConfirmacion: req.body.num_confirmacion,
      esFactura: factura,
      bancoDestino: req.body.banco_destino,
      cuentaDestino: req.body.cuenta_destino,
      FECHA_LOADED: new Date().toISOString().substring(0, 10) // o cualquier formato string que prefieras
    });
    console.log("new GastosFoto object:");
    console.log(nuevoGasto);

    await nuevoGasto.save();
    console.log("Documento guardado exitosamente");
    res.redirect("/");
    
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/borrar/:id", async function(req, res){
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // Borrar por ID de MongoDB -> eliminar documento completo y archivos asociados
      const documento = await GastosFoto.findById(req.params.id);

      if (documento && documento.imagen) {
        try {
          if (Array.isArray(documento.imagen)) {
            documento.imagen.forEach(fname => {
              try { fs.unlinkSync(`./public/uploads/${fname}`); } catch (e) { console.log('Error borrando archivo:', e); }
            });
          } else {
            try { fs.unlinkSync(`./public/uploads/${documento.imagen}`); } catch (e) { console.log('Error borrando archivo:', e); }
          }
        } catch (err) {
          console.log("Error borrando archivo:", err);
        }
      }

      await GastosFoto.findByIdAndDelete(req.params.id);
    } else {
      // Borrar por nombre de imagen -> eliminar solo la referencia a la imagen del documento
      const filename = req.params.id;
      const documento = await GastosFoto.findOne({ imagen: filename });

      if (documento) {
        // Si imagen es array, hacer $pull; si es string, unset/eliminar documento
        if (Array.isArray(documento.imagen)) {
          await GastosFoto.updateOne({ _id: documento._id }, { $pull: { imagen: filename } });
          // borrar archivo físico
          try { fs.unlinkSync(`./public/uploads/${filename}`); } catch (e) { console.log('Error borrando archivo:', e); }
          // si quedó vacío, quitar campo
          const updated = await GastosFoto.findById(documento._id);
          if (!updated.imagen || (Array.isArray(updated.imagen) && updated.imagen.length === 0)) {
            await GastosFoto.findByIdAndUpdate(documento._id, { $unset: { imagen: "" } });
          }
        } else {
          // imagen es string -> eliminar documento completo
          await GastosFoto.deleteOne({ _id: documento._id });
          try { fs.unlinkSync(`./public/uploads/${filename}`); } catch (e) { console.log('Error borrando archivo:', e); }
        }
      }
    }
    
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get('/editar/:id', async (req, res) => {
  try {
    const r2 = await GastosFoto.findById(req.params.id);
    
    res.render('editando.ejs', {
      data1: { recordset: [r2] } // Formato compatible con EJS
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/seEdita", upload.single('imagen'), async function(req, res){
  try {
    const documento = await GastosFoto.findById(req.body.elId);
    
    if (!documento) {
      return res.send("Documento no encontrado");
    }

    // Actualizar campos básicos
    const updateData = {
      nombrePersona: req.body.nombrePersona,
      descripcion: req.body.descripcion
    };

    // Lógica para manejo de archivos (adaptada del código original)
    if (req.body.nombreArchivo == '') {
      // Borrar archivo anterior si existía
      if (req.body.noSeMira && req.body.noSeMira !== 'NULL') {
        try {
          fs.unlinkSync(`./public/uploads/${req.body.noSeMira}`);
        } catch (err) {
          console.log("Error borrando archivo:", err);
        }
      }
      
      if (req.file) {
        updateData.nombreArchivo = req.file.filename;
      } else {
        updateData.nombreArchivo = null;
      }
    } else {
      if (req.file) {
        // Borrar archivo anterior si no es NULL
        if (req.body.nombreArchivo !== 'NULL' && req.body.noSeMira) {
          try {
            fs.unlinkSync(`./public/uploads/${req.body.noSeMira}`);
          } catch (err) {
            console.log("Error borrando archivo:", err);
          }
        }
        updateData.nombreArchivo = req.file.filename;
      }
      // Si no hay archivo nuevo, no se actualiza el campo nombreArchivo
    }

    await GastosFoto.findByIdAndUpdate(req.body.elId, updateData);
    res.redirect("/");
    
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Manejo de errores de conexión a MongoDB
mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado de MongoDB');
});