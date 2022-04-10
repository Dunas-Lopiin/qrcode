$(document).ready(function () {
  $("#event-info").hide();
  $("#ingresso-info").hide();
  let apiUrl = "http://localhost:8080/eventos";
  let eventos;
  let eventoKey;
  let user;
  const getPass = document.getElementById("get-pass");
  const eventSelect = document.getElementById("eventos");
  getPass.addEventListener("click", cadastrarIngresso);
  eventSelect.addEventListener("change", preencherInfo);

  function cadastrarIngresso() {
    let eventoVal = document.getElementById("eventos").value;
    eventoKey = eventoVal;
    let novoIngresso = {};
    novoIngresso.user = user;
    novoIngresso.evento = eventos[eventoVal].title + eventos[eventoVal].system;
    console.log(novoIngresso);

    fetch("http://localhost:8080/eventos/add-pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoIngresso),
    }).then(function (response) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        if (data.res === "ok ing") {
          alert("Ingresso cadastrado com sucesso!");
          pegarQr(data.url);
        } else {
          alert("ingresso já cadastrado! Mostrando ingresso atual.");
          pegarQr(data.url);
        }
      });
    });
  }

  function pegarQr(_hash) {
    fetch(`http://localhost:8080/usuarios/qr?url=${_hash}`).then(function (
      response
    ) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        if (data.res === "ok qr") {
          $("#qrcode").attr("src", data.url);
          preencherForm();
        } else {
          alert("Um erro ocorreu! Operação cancelada!");
        }
      });
    });
  }

  function preencherForm() {
    let thisData = eventos[eventoKey].data.split("-");
    $("#event-info").hide();
    $("#ingresso-info").show();
    $("#ingresso-user").html(`Usuário: ${user}`);
    $("#ingresso-title").html(`Evento: ${eventos[eventoKey].title}`);
    $("#ingresso-local").html("Onde: " + eventos[eventoKey].end);
    $("#ingresso-date").html(
      `${thisData[2]}/${thisData[1]}/${thisData[0]} ás ${eventos[eventoKey].time}`
    );
    $("#ingresso-system").html(eventos[eventoKey].system);
    $("#ingresso-desc").html(eventos[eventoKey].desc);
    return true;
  }

  function preencherInfo() {
    let eventValue = document.getElementById("eventos").value;
    if (eventValue === "none") {
      $("#event-info").hide();
      return false;
    }
    let thisData = eventos[eventValue].data.split("-");
    $("#event-info").show();
    $("#ingresso-info").hide();
    $("#event-title").html(eventos[eventValue].title);
    $("#event-local").html("Onde: " + eventos[eventValue].end);
    $("#event-date").html(
      `${thisData[2]}/${thisData[1]}/${thisData[0]} ás ${eventos[eventValue].time}`
    );
    $("#event-system").html(eventos[eventValue].system);
    $("#event-desc").html(eventos[eventValue].desc);
    return true;
  }

  function changePage(_usuario) {
    alert("token inválido, voltando para a tela de login!");
    location.assign("index.html");
  }

  function acessarBack() {
    fetch(apiUrl).then(function (response) {
      if (response.status !== 200) {
        console.log("Temos problemas: Código  " + response.status);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        eventos = data;
        fillSelect(data);
      });
    });
  }

  function fillSelect(_data) {
    for (let i = 0; i < _data.length; i++) {
      console.log(_data[i].title);
      $("#eventos").append(
        `<option value="${i}" id="opt-${i}">${_data[i].title} ${_data[i].system}</option>`
      );
    }
  }

  function checkCookie() {
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
          user = data.login;
          acessarBack();
          return true;
        }
      });
    });
  }
  checkCookie();
});
