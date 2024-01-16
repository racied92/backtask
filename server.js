const jsonServer = require("json-server");
const fetch = require("node-fetch");
const server = jsonServer.create();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "db.json");

// Esta función obtiene los datos desde el archivo db.json y establece 'db' cuando el servidor se inicia
function initData() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log("Datos cargados correctamente desde db.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al cargar datos desde db.json:", error);
    throw error;
  }
}

let db;

// Llamamos a la función para cargar los datos cuando el servidor se inicia
initData().then(initialData => {
  db = initialData;
}).catch(err => {
  console.error(err);
});

// Agregar una nueva tarea (POST)
server.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    db.tasks.push(newTask);

    // Actualizar datos en el archivo db.json
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

    console.log("Datos actualizados correctamente en db.json");
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

// Escuchar en el puerto configurado por Render
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
