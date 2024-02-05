const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  // password: "",
  database: "gestion_sw",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

module.exports = db;