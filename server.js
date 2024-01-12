// Importar el módulo json-server
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Middleware para parsear el cuerpo de la solicitud como JSON
server.use(jsonServer.bodyParser);

// Agregar una nueva tarea
server.post("/tasks", (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now(); // Asignar un ID único basado en la marca de tiempo
    db.tasks.push(newTask); // 'db' es el objeto que representa tu base de datos
    res.json(newTask);
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Middleware predeterminado y enrutador
server.use(middlewares);
server.use(router);

// Escuchar en el puerto 3000
server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
