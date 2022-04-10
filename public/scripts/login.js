$(document).ready(function () {
  //$("#pesquisa").hide();
  $("#resultado").hide();
  let apiUrl = "http://localhost:8080/usuarios/login/";
  const btnLogin = document.getElementById("submit");
  btnLogin.addEventListener("click", registrar);
  let usuarioAtual;
  let tipoPesquisa;

  function limparPesquisa() {
    document.getElementById("login").value = "";
    document.getElementById("password").value = "";
  }

  function changePage(_usuario) {
    let text = `Bem-vindo(a) ${_usuario.login}!`;
    if (confirm(text) == true) {
      if (_usuario.tipo === "administrador") {
        location.assign("painel-adm.html");
      } else {
        location.assign("eventos.html");
      }
    } else {
      alert("cancelado!");
    }
    document.getElementById("demo").innerHTML = text;
  }

  function registrar() {
    let novoUsuario = {};
    novoUsuario.login = document.getElementById("login").value;
    novoUsuario.password = document.getElementById("password").value;
    novoUsuario.tipo = document.getElementById("tipo").value;
    limparPesquisa();
    acessarBack(novoUsuario);
  }

  async function acessarBack(_usuario) {
    usuarioAtual = _usuario;
    tipoPesquisa = $("#tipo").val();
    if (tipoPesquisa === "administrador") {
      apiUrl = "http://localhost:8080/adminstrator/login/";
    } else {
      apiUrl = "http://localhost:8080/usuarios/login/";
    }
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_usuario),
    }).then(function (response) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        if (data.res === "ok") {
          changePage(usuarioAtual);
        } else {
          alert("Usuário ou senhas incorretos!");
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
          $("#pesquisa").hide();
          return console.log("Token inválido!");
        } else {
          console.log("Token aceito!");
          usuarioAtual = data.login;
          changePage(data);
          return true;
        }
      });
    });
  }
  checkCookie();
});
