const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const app = express();
const port = 8080;



app.use(express.json());
app.use(cors());


const LoginRouter = require ('./routes/login_routes');
app.use(LoginRouter);

const EquipoRouter = require ('./routes/equipo_routes');
app.use(EquipoRouter);

const EstadoRouter = require ('./routes/estado_routes');
app.use(EstadoRouter);

const ProyectoRouter = require ('./routes/proyectos_routes');
app.use(ProyectoRouter);

const RecursoRouter = require ('./routes/recursos_routes');
app.use(RecursoRouter);

const RolesRouter = require ('./routes/roles_routes');
app.use(RolesRouter);

const TareasRouter = require ('./routes/tareas_routes.js');
app.use(TareasRouter);

https.createServer({
  cert: fs.readFileSync('localhost.crt'),
  key: fs.readFileSync('localhost.key')
}, app).listen(port, () => {
  console.log(`Servidor escuchando en https://localhost:${port}`);
});
