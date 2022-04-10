$(document).ready(function () {
  let apiUrl;
  let userBtn = document.getElementById("submit-user");
  let eventBtn = document.getElementById("submit-event");
  userBtn.addEventListener("click", registrarUsuario);
  eventBtn.addEventListener("click", registrarEvento);
  let envioAtual;

  function limparUsuario() {
    document.getElementById("fullname").value = "";
    document.getElementById("login").value = "";
    document.getElementById("password").value = "";
  }

  function limparEvento() {
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("end").value = "";
    document.getElementById("sist").value = "";
    document.getElementById("data").value = "";
    document.getElementById("time-hour").value = "";
    document.getElementById("time-minute").value = "";
  }

  function changePage(_usuario) {
    alert("token inválido, voltando para a tela de login!");
    location.assign("index.html");
  }

  function registrarUsuario() {
    let novoUsuario = {};
    novoUsuario.fullname = document.getElementById("fullname").value;
    novoUsuario.login = document.getElementById("login").value;
    novoUsuario.password = document.getElementById("password").value;
    novoUsuario.tipo = "usuario";
    limparUsuario();
    acessarBack(novoUsuario, 1);
  }

  function registrarEvento() {
    let novoEvento = {};
    novoEvento.title = document.getElementById("title").value;
    novoEvento.end = document.getElementById("end").value;
    novoEvento.system = document.getElementById("sist").value;
    novoEvento.desc = document.getElementById("desc").value;
    novoEvento.data = document.getElementById("data").value;
    novoEvento.time =
      document.getElementById("time-hour").value +
      ":" +
      document.getElementById("time-minute").value;
    limparEvento();
    acessarBack(novoEvento, 2);
  }

  async function acessarBack(_envio, _rota) {
    envioAtual = _envio;
    if (_rota === 1) {
      apiUrl = "http://localhost:8080/adminstrator/add-user/";
    } else {
      apiUrl = "http://localhost:8080/adminstrator/add-event/";
    }
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_envio),
    }).then(function (response) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        if (data.res === "ok user") {
          alert("Usuário cadastrado com sucesso!");
        } else if (data.res === "ok event") {
          alert("Evento cadastrado com sucesso!");
        } else {
          alert("Um erro ocorreu! Operação cancelada!");
        }
      });
    });
  }

  async function checkCookie() {
    fetch("http://localhost:8080/usuarios/cookie/").then(function (response) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        if (data.login === undefined) {
          changePage(data);
        } else {
          console.log("Token aceito!");
          return true;
        }
      });
    });
  }
  checkCookie();
});
