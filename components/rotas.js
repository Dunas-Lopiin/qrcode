const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const qrcode = require("qrcode-generator");
const bcrypt = require("bcrypt");
const fs = require("fs");
let USUARIOS = require("./user.json");
let ADM = require("./adm.json");
let EVENTOS = require("./eventos.json");
let INGRESSOS = require("./ingressos.json");
const crypto = require("crypto");
const { stringify } = require("querystring");
const saltRounds = 10;
let myHash;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

async function validateADM(req, res) {
  let thisUser = req.body;
  console.log(thisUser);
  let checkUser = JSON.stringify(ADM).includes(JSON.stringify(thisUser));
  if (checkUser) {
    console.log("usuario verificado");
    bcrypt.hash(thisUser.password, saltRounds, function (err, hash) {
      myHash = hash;
      res.cookie("rpgambulante-username", thisUser, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send({ res: "ok" });
    });
  } else {
    let posta = "a";
    console.log("usuario invalido");
    res.send({ posta });
  }
}

async function validateUser(req, res) {
  let thisUser = req.body;
  let stringUser = JSON.stringify(thisUser);
  stringUser = stringUser.replaceAll("{", "");
  stringUser = stringUser.replaceAll("}", "");
  let checkUser = JSON.stringify(USUARIOS).includes(stringUser);
  if (checkUser) {
    console.log("usuario verificado");
    bcrypt.hash(thisUser.password, saltRounds, function (err, hash) {
      myHash = hash;
      res.cookie("rpgambulante-username", thisUser, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send({ res: "ok" });
      console.log(thisUser);
    });
  } else {
    let posta = "a";
    console.log("usuario invalido");
    res.send({ posta });
  }
}

async function getQr(req, res) {
  let url = req.query.url;
  const qr = qrcode(0, "M");
  qr.addData(url);
  //qr.addData("https://castelo-arcano.itch.io/");
  qr.make();
  const d = qr.createDataURL();
  res.send({ res: "ok qr", url: d });
}

async function getEvents(req, res) {
  res.send(EVENTOS);
}

async function sendCookie(req, res) {
  if (myHash != undefined) {
    let username = req.cookies["rpgambulante-username"];
    console.log(username);

    let myPassword = username.password;
    bcrypt.compare(myPassword, myHash).then(function (result) {
      if (result) {
        res.send(username);
        return true;
      }
      res.send([]);
    });
  } else {
    res.send([]);
  }
}

async function addUser(req, res) {
  console.log("Adicionando usuario!");
  let novoUsuario = req.body;
  let invoices = JSON.parse(fs.readFileSync("components/user.json", "utf8"));
  invoices.push(novoUsuario);
  console.log(invoices);
  fs.writeFile("components/user.json", JSON.stringify(invoices), (err) => {
    if (err === null) {
      res.send({ res: "ok user" });
    }
    if (err) console.log(err);
  });
}

async function addEvent(req, res) {
  console.log("Adicionando evento!");
  let novoEvento = req.body;
  let invoices = JSON.parse(fs.readFileSync("components/eventos.json", "utf8"));
  invoices.push(novoEvento);
  console.log(invoices);
  fs.writeFile("components/eventos.json", JSON.stringify(invoices), (err) => {
    if (err === null) {
      res.send({ res: "ok event" });
    }
    if (err) console.log(err);
  });
}

async function addPass(req, res) {
  console.log("Adicionando ingresso!");
  let novoEvento = req.body;
  let ingressoCheck = {};
  ingressoCheck.user = novoEvento.user;
  ingressoCheck.evento = novoEvento.evento;
  ingressoCheck = JSON.stringify(ingressoCheck);
  ingressoCheck = ingressoCheck.replaceAll("{", "");
  ingressoCheck = ingressoCheck.replaceAll("}", "");
  let checkPass = JSON.stringify(INGRESSOS).includes(ingressoCheck);
  console.log(ingressoCheck);
  console.log(checkPass);
  let cryptoUrl = crypto
    .createHmac("sha256", "url")
    .update(novoEvento.user)
    .digest("hex");

  if (checkPass) {
    res.send({ res: "ingresso já cadastrado!", url: cryptoUrl });
    return false;
  }
  novoEvento.query = cryptoUrl;
  novoEvento.passUsed = false;
  let invoices = JSON.parse(
    fs.readFileSync("components/ingressos.json", "utf8")
  );
  invoices.push(novoEvento);
  console.log(invoices);
  fs.writeFile("components/ingressos.json", JSON.stringify(invoices), (err) => {
    if (err === null) {
      res.send({ res: "ok ing", url: cryptoUrl });
    }
    if (err) console.log(err);
  });
}

module.exports.validateUser = validateUser;
module.exports.validateAdm = validateADM;
module.exports.cookie = sendCookie;
module.exports.genQr = getQr;
module.exports.addUser = addUser;
module.exports.addEvent = addEvent;
module.exports.getEvent = getEvents;
module.exports.addPass = addPass;
