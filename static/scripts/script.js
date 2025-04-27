const formulario = document.getElementById("cadastroForm");

const createDisplayMsgError = (mensagem) => {
  const msgError = document.querySelector(".msgError");
  if (msgError) msgError.textContent = mensagem;
};

const checkPasswordStrength = (senha) => {
  if (!/[a-z]/.test(senha)) return "A senha deve ter pelo menos uma letra minúscula!";
  if (!/[A-Z]/.test(senha)) return "A senha deve ter pelo menos uma letra maiúscula!";
  if (!/[\W_]/.test(senha)) return "A senha deve ter pelo menos um caractere especial!";
  if (!/\d/.test(senha)) return "A senha deve ter pelo menos um número!";
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres!";
  return null;
};

const maskInput = (event, regex, format, maxLength) => {
  let value = event.target.value.replace(/\D/g, "");
  if (/[A-Za-zÀ-ÿ]/.test(value)) createDisplayMsgError(`${event.target.id} deve conter apenas números`);
  if (value.length > maxLength) value = value.slice(0, maxLength);
  event.target.value = value.replace(regex, format);
};

const validateFields = () => {
  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;
  const consenha = document.getElementById("cpassword").value;

  if (!/^[A-Za-zÁ-ÿ\s]+$/.test(nome)) return "O nome não pode conter números ou caracteres especiais!";
  if (!["gmail.com", "outlook.com", "hotmail.com"].includes(email.split("@")[1]?.toLowerCase())) return "O email digitado não é válido!";
  if (senha !== consenha) return "As senhas digitadas não coincidem!";
  const senhaError = checkPasswordStrength(senha);
  if (senhaError) return senhaError;
  return null;
};

const sendrequesty = async (dados) => {
  await fetch("http://localhost:3000/cadastro", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(dados),
  });
};

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const errorMsg = validateFields();
  if (errorMsg) return createDisplayMsgError(errorMsg);

  const dados = {
    nome: document.getElementById("name").value,
    rg: document.getElementById("rg").value,
    cpf: document.getElementById("cpf").value,
    senha: document.getElementById("password").value,
    consenha: document.getElementById("cpassword").value,
    celular: document.getElementById("tel").value,
    email: document.getElementById("email").value,
  };

  sendrequesty(dados);
});

document.getElementById("tel").addEventListener("input", (e) => maskInput(e, /(\d{2})(\d{5})(\d{4})/, "($1) $2-$3", 11));
document.getElementById("cpf").addEventListener("input", (e) => maskInput(e, /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4", 11));
document.getElementById("rg").addEventListener("input", (e) => maskInput(e, /(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4", 9));
