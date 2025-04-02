const formulario = document.getElementById("cadastroForm");
const nome = document.getElementById("name");
const email = document.getElementById("email");
const senha = document.getElementById("password");
const ConSenha = document.getElementById("cpassword");
const Celular = document.getElementById("tel");
const CPF = document.getElementById("cpf");
const RG = document.getElementById("rg");
const msgError = document.getElementsByClassName("msgError");

async function sendrequesty(nome, email, senha, consenha, celular, cpf, rg) {
  await fetch("http://localhost:3000/cadastro", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      rg: rg,
      cpf: cpf,
      senha: senha,
      consenha: consenha,
      celular: celular,
      email: email,
    }),
  });
}

const createDisplayMsgError = (mensagem) => {
  if (msgError.length > 0) {
    msgError[0].textContent = mensagem;
  }
};

const checkPasswordMatch = () => senha.value === ConSenha.value;
const checkNome = () => /^[A-Za-zÁ-ÿ\s]+$/.test(nome.value);
const checkEmail = (email) =>
  ["gmail.com", "outlook.com", "hotmail.com"].includes(
    email.split("@")[1]?.toLowerCase()
  );

const checkPasswordStrength = (senha) => {
  if (!/[a-z]/.test(senha))
    return "A senha deve ter pelo menos uma letra minúscula!";
  if (!/[A-Z]/.test(senha))
    return "A senha deve ter pelo menos uma letra maiúscula!";
  if (!/[\W_]/.test(senha))
    return "A senha deve ter pelo menos um caractere especial!";
  if (!/\d/.test(senha)) return "A senha deve ter pelo menos um número!";
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres!";
  return null;
};

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

nome.addEventListener("input", () =>
  createDisplayMsgError(
    checkNome() ? "" : "O nome não pode conter números ou caracteres especiais!"
  )
);
email.addEventListener("input", () =>
  createDisplayMsgError(
    checkEmail(email.value) ? "" : "O email digitado não é válido!"
  )
);
senha.addEventListener("input", () =>
  createDisplayMsgError(checkPasswordStrength(senha.value) || "")
);

Celular.addEventListener("input", maskPhoneNumber);
CPF.addEventListener("input", maskCpfNumber);
RG.addEventListener("input", maskRgNumber);

const fetchDatas = (event) => {
  event.preventDefault();

  if (!checkNome())
    return createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
  if (!checkEmail(email.value))
    return createDisplayMsgError("O email digitado não é válido!");
  if (!checkPasswordMatch())
    return createDisplayMsgError("As senhas digitadas não coincidem!");

  const senhaError = checkPasswordStrength(senha.value);
  if (senhaError) return createDisplayMsgError(senhaError);

  sendrequesty(
    nome.value,
    email.value,
    senha.value,
    ConSenha.value,
    Celular.value,
    CPF.value,
    RG.value
  );

  console.log(
    JSON.stringify({
      nome: nome.value,
      rg: RG.value,
      cpf: CPF.value,
      senha: senha.value,
      consenha: ConSenha.value,
      celular: Celular.value,
      email: email.value,
    })
  );
};

formulario.addEventListener("submit", fetchDatas);
