let clienteEditandoId = null;

async function verificarLogin() {
    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }

    carregarNomeUsuario();
}

async function carregarNomeUsuario() {
    const { data } = await supabaseClient.auth.getUser();

    if (!data.user) return;

    const nomeTopo = document.querySelector(".user-profile strong");

    if (nomeTopo) {
        nomeTopo.textContent = "Samuel";
    }
}

async function sair() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
}

async function mostrarSecao(secao) {
    const conteudo = document.getElementById("conteudo");

    if (typeof atualizarTopbar === "function") {
        atualizarTopbar(secao);
    }

    marcarMenuAtivo(secao);

    switch (secao) {
        
        case "agenda":
            conteudo.innerHTML = carregarAgenda();
            atualizarAgenda();
            break;
        
        case "assinaturas":
            conteudo.innerHTML = carregarAssinaturas();
            atualizarListaAssinaturas();
            break;

        case "dashboard":
            conteudo.innerHTML = await carregarDashboard();
            break;

        case "clientes":
            conteudo.innerHTML = carregarClientes();
            atualizarTabelaClientes();
            break;

        case "planos":
            conteudo.innerHTML = carregarPlanos();
            atualizarListaPlanos();
            break;

        case "cortes":
            conteudo.innerHTML = "<h2>Cortes</h2><p>Tela de cortes em construção.</p>";
            break;

        case "financeiro":
            conteudo.innerHTML = "<h2>Financeiro</h2><p>Tela financeira em construção.</p>";
            break;

        case "relatorios":
            conteudo.innerHTML = "<h2>Relatórios</h2><p>Tela de relatórios em construção.</p>";
            break;

        case "configuracoes":
            conteudo.innerHTML = "<h2>Configurações</h2><p>Tela de configurações em construção.</p>";
            break;

        default:
            conteudo.innerHTML = "<h2>Página em construção</h2>";
    }
}

/* CLIENTES */

async function salvarCliente() {
    const cliente = {
        nome: document.getElementById("clienteNome").value.trim(),
        telefone: document.getElementById("clienteTelefone").value.trim(),
        email: document.getElementById("clienteEmail").value.trim(),
        cpf: document.getElementById("clienteCpf").value.trim(),
        status: "ativo"
    };

    if (!cliente.nome || !cliente.telefone) {
        alert("Preencha Nome e Telefone.");
        return;
    }

    const sucesso = clienteEditandoId
        ? await atualizarCliente(clienteEditandoId, cliente)
        : await cadastrarCliente(cliente);

    if (!sucesso) {
        alert("Erro ao salvar cliente.");
        return;
    }

    clienteEditandoId = null;

    limparFormularioCliente();
    fecharFormularioCliente();
    mostrarSecao("clientes");
}

async function atualizarTabelaClientes() {
    const lista = document.getElementById("listaClientes");

    if (!lista) return;

    lista.innerHTML = `
        <tr>
            <td colspan="5">Carregando clientes...</td>
        </tr>
    `;

    const clientes = await listarClientes();

    if (clientes.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="5">Nenhum cliente cadastrado.</td>
            </tr>
        `;
        return;
    }

    lista.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.email || "-"}</td>
            <td><span class="status ativo">${cliente.status}</span></td>
            <td>
                <button class="btn-small" onclick="editarCliente('${cliente.id}')">✏️</button>
                <button class="btn-small btn-delete" onclick="removerCliente('${cliente.id}')">🗑</button>
            </td>
        </tr>
    `).join("");
}

async function editarCliente(id) {
    const cliente = await buscarClientePorId(id);

    if (!cliente) {
        alert("Cliente não encontrado.");
        return;
    }

    abrirFormularioCliente();

    clienteEditandoId = id;

    document.getElementById("clienteNome").value = cliente.nome;
    document.getElementById("clienteTelefone").value = cliente.telefone;
    document.getElementById("clienteEmail").value = cliente.email || "";
    document.getElementById("clienteCpf").value = cliente.cpf || "";
}

async function removerCliente(id) {
    const confirmar = confirm("Deseja realmente excluir este cliente?");

    if (!confirmar) return;

    const sucesso = await excluirCliente(id);

    if (!sucesso) {
        alert("Erro ao excluir cliente.");
        return;
    }

    mostrarSecao("clientes");
}

/* MENU */

function marcarMenuAtivo(secao) {
    const links = document.querySelectorAll(".sidebar nav a");

    links.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("onclick").includes(secao)) {
            link.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    await verificarLogin();
    await mostrarSecao("dashboard");
});