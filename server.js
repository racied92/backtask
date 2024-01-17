const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const crypto = require("crypto");

// Make sure to use the default middleware
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Parse JSON in POST and PUT requests
server.use(jsonServer.bodyParser);

// Reemplaza "tu_secreto_de_webhook" con el secreto real de tu webhook
const webhookSecret = "tu_secreto_de_webhook";

// Custom route to handle both POST and PUT requests with signature verification
server.post("/api/*", (req, res, next) => {
  // Verifica la firma del webhook de GitHub
  const signature = req.get("X-Hub-Signature-256") || "";
  const body = JSON.stringify(req.body);
  const computedSignature = `sha256=${crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
    // La firma es válida, maneja la solicitud
    router.db.object = { ...router.db.object, ...req.body };
    res.jsonp(req.body);
  } else {
    // La firma no es válida, rechaza la solicitud
    res.status(403).send("Forbidden");
  }
});

server.put("/api/*", (req, res, next) => {
  // Verifica la firma del webhook de GitHub
  const signature = req.get("X-Hub-Signature-256") || "";
  const body = JSON.stringify(req.body);
  const computedSignature = `sha256=${crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
    // La firma es válida, maneja la solicitud
    router.db.object = { ...router.db.object, ...req.body };
    res.jsonp(req.body);
  } else {
    // La firma no es válida, rechaza la solicitud
    res.status(403).send("Forbidden");
  }
});

// Use router for other HTTP methods (GET, DELETE, etc.)
server.use(router);

// Listen to port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

// Export the Server API
module.exports = server;
