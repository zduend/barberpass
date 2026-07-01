async function fazerLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  mensagem.textContent = "Entrando...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    mensagem.textContent = "E-mail ou senha inválidos.";
    return;
  }

  window.location.href = "admin.html";
}