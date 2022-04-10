const express = require("express");
const app = express();
const port = 8080;
const fs = require("fs");
const bodyParser = require("body-parser");
const rota = require("./components/rotas.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/", express.static("public"));
app.use(bodyParser.json());
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/adminstrator/login", urlencodedParser, rota.validateAdm);

app.post("/adminstrator/add-user", urlencodedParser, rota.addUser);

app.post("/adminstrator/add-event", urlencodedParser, rota.addEvent);

app.post("/usuarios/login", urlencodedParser, rota.validateUser);

app.post("/eventos/add-pass", rota.addPass);

app.get("/usuarios/cookie", rota.cookie);

app.get("/usuarios/qr", rota.genQr);

app.get("/eventos", rota.getEvent);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
