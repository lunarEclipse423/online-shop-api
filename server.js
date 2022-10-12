const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

const SECRET_KEY = "82387238728";
const expiresIn = "1h";
const dbjson = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

const createToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const isAuthenticated = ({ username, password }) => {
  return (
    dbjson.users.findIndex(
      (user) => user.username === username && user.password === password
    ) !== -1
  );
};

server.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!isAuthenticated({ username, password })) {
    const status = 401;
    const message = "Incorrect username or password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ username, password });
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token });
});

server.listen(port);
