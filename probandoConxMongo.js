
// Cambio: Reemplazar SQL Server con Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;


// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/DB_APP_GASTOS', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch(err => {
  console.error("Error al conectar a MongoDB", err);
});


// Esquema para la colección GASTOS_FOTO
const gastosSchema = new mongoose.Schema({
  id: Number ,
  Fecha: { type: String, required: true },
  MontoGasto: { type: Number, required: true },
  cat_gasto: { type: String, required: true },
  cat_especifica: { type: String },
  descripcion: { type: String },
  imagen: { type: String },
  bancoOrigen: { type: String },
  cuentaOrigen: { type: String },
  numConfirmacion: { type: String },
  esFactura: { type: Number, default: 0 },
  bancoDestino: { type: String },
  cuentaDestino: { type: String },
  FECHA_LOADED: { type: String}
});

const GastosFoto = mongoose.model('GASTOS_FOTO', gastosSchema, 'GASTOS_FOTO');

const unGasto = async () => {
    const gastos = await GastosFoto.find({}).sort({ id: -1 }).limit(10);
    console.log(gastos);
}

unGasto();
    