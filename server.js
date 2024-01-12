// server.js

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Inicializar el objeto 'db'
const db = {
  tasks: require("./db.json").tasks || [],
};

// Agregar una nueva tarea (POST)
server.post("/tasks", (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    db.tasks.push(newTask);
    updateDbFile();
    res.json(newTask);
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todas las tareas (GET)
server.get("/tasks", (req, res) => {
  res.json(db.tasks);
});

// Obtener una tarea por ID (GET)
server.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = db.tasks.find(task => task.id === taskId);

  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Tarea no encontrada");
  }
});

// Actualizar una tarea por ID (PUT)
server.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;
  const index = db.tasks.findIndex(task => task.id === taskId);

  if (index !== -1) {
    db.tasks[index] = updatedTask;
    updateDbFile();
    res.json(updatedTask);
  } else {
    res.status(404).send("Tarea no encontrada");
  }
});

// Eliminar una tarea por ID (DELETE)
server.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = db.tasks.findIndex(task => task.id === taskId);

  if (index !== -1) {
    const deletedTask = db.tasks.splice(index, 1)[0];
    updateDbFile();
    res.json(deletedTask);
  } else {
    res.status(404).send("Tarea no encontrada");
  }
});

// Resto de las rutas
server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

// Función para actualizar el archivo db.json
function updateDbFile() {
  const fs = require("fs");
  const filePath = "./db.json";
  const newData = JSON.stringify({ tasks: db.tasks }, null, 2);

  fs.writeFileSync(filePath, newData);
}
