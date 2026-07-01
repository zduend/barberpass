async function fazerLogin() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");
    const botao = document.querySelector(".login-btn");

    // Estado de carregamento
    mensagem.textContent = "";
    botao.disabled = true;
    botao.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Entrando...
    `;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {

        mensagem.textContent = "E-mail ou senha inválidos.";

        botao.disabled = false;
        botao.innerHTML = `
            <i class="fa-solid fa-lock"></i>
            Entrar
        `;

        return;
    }

    mensagem.textContent = "Login realizado com sucesso!";

    window.location.href = "admin.html";
}