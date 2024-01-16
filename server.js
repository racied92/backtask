// JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

// Make sure to use the default middleware
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Parse JSON in POST and PUT requests
server.use(jsonServer.bodyParser);

// Add custom route here if needed
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

// Custom route to handle both POST and PUT requests
server.post("/api/*", (req, res, next) => {
  // Handle POST request (create)
  router.db.object = { ...router.db.object, ...req.body };
  res.jsonp(req.body);
});

server.put("/api/*", (req, res, next) => {
  // Handle PUT request (update)
  router.db.object = { ...router.db.object, ...req.body };
  res.jsonp(req.body);
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
