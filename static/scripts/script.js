const formulario = document.getElementById("cadastroForm");
const nome = document.getElementById("name");
const email = document.getElementById("email");
const senha = document.getElementById("password");
const ConSenha = document.getElementById("cpassword");
const Celular = document.getElementById("tel");
const CPF = document.getElementById("cpf");
const RG = document.getElementById("rg");
const msgError = document.getElementsByClassName("msgError");

const createDisplayMsgError = (mensagem) => {
  msgError[0].textContent = mensagem;
};

function checkPasswordMatch() {
  return senha.value === ConSenha.value ? true : false;
}

const maskPhoneNumber = (event) => {
  let telefone = event.target.value;

  if (/[A-Za-zÀ-ÿ]/.test(telefone)) {
    createDisplayMsgError("O celular deve conter apenas números");
    telefone = telefone.replace(/[A-Za-zÀ-ÿ]/g, "");
  }

  telefone = telefone.replace(/\D/g, "");

  telefone = telefone.substring(0, 11);

  if (telefone.length > 10) {
    telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length > 6) {
    telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (telefone.length > 2) {
    telefone = telefone.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else if (telefone.length > 0) {
    telefone = telefone.replace(/(\d{0,2})/, "($1");
  }

  event.target.value = telefone;
};

const maskCpfNumber = (event) => {
  let cpf = event.target.value;

  if (/[A-Za-zÀ-ÿ]/.test(cpf)) {
    createDisplayMsgError("O CPF deve conter apenas números");
    cpf = cpf.replace(/[A-Za-zÀ-ÿ]/g, "");
  }

  cpf = cpf.replace(/\D/g, "");

  cpf = cpf.substring(0, 11);

  if (cpf.length > 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cpf.length > 6) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  } else if (cpf.length > 3) {
    cpf = cpf.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  }

  event.target.value = cpf;
};

const maskRgNumber = (event) => {
  let rg = event.target.value;

  if (/[A-Za-zÀ-ÿ]/.test(rg)) {
    createDisplayMsgError("O RG deve conter apenas números");
    rg = rg.replace(/[A-Za-zÀ-ÿ]/g, "");
  }

  rg = rg.replace(/\D/g, "");

  rg = rg.substring(0, 9);

  if (rg.length > 8) {
    rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
  } else if (rg.length > 5) {
    rg = rg.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
  } else if (rg.length > 2) {
    rg = rg.replace(/(\d{2})(\d{0,3})/, "$1.$2");
  }

  event.target.value = rg;
};

const checkNome = () => {
  const nomeRegex = /^[A-Za-zÁ-ÿ\s]+$/;
  return nomeRegex.test(nome.value);
};

const checkEmail = (email) => {
  const partesEmail = email.split("@");

  if (
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "gmail.com") ||
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "outlook.com") ||
    (partesEmail.length === 2 && partesEmail[1].toLowerCase() === "hotmail.com")
  ) {
    return true;
  } else {
    return false;
  }
};

function checkPasswordStrength(senha) {
  if (!/[a-z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra minúscula!";
  }
  if (!/[A-Z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra maiúscula!";
  }
  if (!/[W_]/.test(senha)) {
    return "A senha deve ter pelo menos um caracter especial!";
  }
  if (!/\d/.test(senha)) {
    return "A senha deve ter pelo menos um numero!";
  }
  if (senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres!";
  }

  return null;
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(nome.value);
  console.log(email.value);
  console.log(senha.value);
  console.log(ConSenha.value);
  console.log(Celular.value);
  console.log(CPF.value);
  console.log(RG.value);
  console.log(msgError.value);
});

nome.addEventListener("input", () => {
  if (nome.value && !checkNome()) {
    createDisplayMsgError(
      "O nome não pode conter numeros ou caracteres especiais!"
    );
  } else {
    createDisplayMsgError("");
  }
});

email.addEventListener("input", () => {
  if (email.value && !checkEmail(email.value)) {
    createDisplayMsgError("O email digitado não e valido!");
  } else {
    createDisplayMsgError("");
  }
});

senha.addEventListener("input", () => {
  if (senha.value && checkPasswordStrength(senha.value)) {
    createDisplayMsgError(checkPasswordStrength(senha.value));
  } else {
    createDisplayMsgError("");
  }
});

Celular.addEventListener("input", maskPhoneNumber);

CPF.addEventListener("input", maskCpfNumber);

RG.addEventListener("input", maskRgNumber);
