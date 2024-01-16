const { createAppAuth } = require("@octokit/auth-app");
const { request } = require("@octokit/request");
const jsonServer = require("json-server");
const fetch = require("node-fetch");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

const privateKey = `-----BEGIN PRIVATE KEY-----\n[Contenido de tu clave privada]\n-----END PRIVATE KEY-----`;
const auth = createAppAuth({
  appId: 797731,
  privateKey: privateKey,
  clientId: Iv1.e36fde8b5ca36539,
  clientSecret: cc8c712ae5a4fe012461bd87a5efbf652d100a0e,
});

let db;

async function initData() {
  try {
    const response = await auth({ type: "app" });
    const { data } = await request("GET /repos/:owner/:repo/contents/:path", {
      owner: "racied92",
      repo: "backtask",
      path: "db.json",
      headers: {
        authorization: `token ${response.token}`,
      },
    });

    const dbContent = Buffer.from(data.content, "base64").toString();
    db = JSON.parse(dbContent);

    console.log("Datos cargados correctamente desde GitHub");
  } catch (error) {
    console.error("Error al cargar datos desde GitHub:", error);
  }
}

initData();

server.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    db.tasks.push(newTask);

    const response = await fetch("https://api.github.com/repos/racied92/backtask/contents/db.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `token ${response.token}`,
      },
      body: JSON.stringify({
        message: "Actualizar db.json",
        content: Buffer.from(JSON.stringify(db)).toString("base64"),
        sha: data.sha,
      }),
    });

    if (response.ok) {
      console.log("Datos actualizados correctamente en GitHub");
      res.json(newTask);
    } else {
      console.error("Error al actualizar datos en GitHub:", response.statusText);
      res.status(500).send("Error interno del servidor");
    }
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    res.status(500).send("Error interno del servidor");
  }
});

server.get("/tasks", (req, res) => {
  res.json(db.tasks);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
