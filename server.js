const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser); // Middleware para parsear el cuerpo de la solicitud
server.use(middlewares);

// Agregar una nueva tarea (POST)
server.post("/tasks", (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now(); // Asignar un ID único basado en la marca de tiempo
    db.tasks.push(newTask);
    res.json(newTask);
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Resto de las rutas
server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
