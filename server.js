const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("https://api.jsonbin.io/v3/b/65a5601d266cfc3fde78fe86/latest");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// No necesitas inicializar 'db' con datos al comienzo ya que lo obtendrás de JSONBin.io
let db;

// Esta función obtiene los datos desde JSONBin.io y establece 'db' cuando el servidor se inicia
async function initData() {
  try {
    const response = await router.db.read();
    db = response;
    console.log("Datos cargados correctamente desde JSONBin.io");
  } catch (error) {
    console.error("Error al cargar datos desde JSONBin.io:", error);
  }
}

// Llamas a la función para cargar los datos cuando el servidor se inicia
initData();

// Agregar una nueva tarea (POST)
server.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    db.tasks.push(newTask);

    // Actualizar datos en JSONBin.io
    await router.db.write(db);

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

// Resto de las rutas...

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
