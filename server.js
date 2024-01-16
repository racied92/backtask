const jsonServer = require("json-server");
const fetch = require("node-fetch");
const server = jsonServer.create();
const masterKey = "$2a$10$OHQUQ5Pr4sVQgCbq9L7/yut67KgIRRWeLB8TXczMHI76bTu/NtW/m";
const binUrl = "https://api.jsonbin.io/v3/b/65a5601d266cfc3fde78fe86";

// Esta función obtiene los datos desde JSONBin.io y establece 'db' cuando el servidor se inicia
async function initData() {
  try {
    const response = await fetch(binUrl, {
      headers: {
        "X-Master-Key": masterKey,
      },
    });
    const data = await response.json();
    console.log("Datos cargados correctamente desde JSONBin.io");
    return data;
  } catch (error) {
    console.error("Error al cargar datos desde JSONBin.io:", error);
    throw error;
  }
}

let db;

// Llamas a la función para cargar los datos cuando el servidor se inicia
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

    // Actualizar datos en JSONBin.io
    const updateResponse = await fetch(binUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": masterKey,
      },
      body: JSON.stringify(db),
    });

    if (updateResponse.ok) {
      console.log("Datos actualizados correctamente en JSONBin.io");
      res.json(newTask);
    } else {
      console.error("Error al actualizar datos en JSONBin.io:", updateResponse.statusText);
      res.status(500).send('Error interno del servidor');
    }
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
