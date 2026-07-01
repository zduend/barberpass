function carregarClientes() {
    return `
        <section class="page-header">
            <div>
                <h2>Clientes</h2>
                <p>Gerencie os clientes cadastrados na barbearia.</p>
            </div>

            <button class="btn-primary" onclick="abrirFormularioCliente()">
                + Novo Cliente
            </button>
        </section>

        <section class="panel" id="formCliente" style="display:none;">
            <h2>Novo Cliente</h2>

            <input id="clienteNome" type="text" placeholder="Nome do cliente">
            <input id="clienteTelefone" type="text" placeholder="Telefone">
            <input id="clienteEmail" type="email" placeholder="E-mail">
            <input id="clienteCpf" type="text" placeholder="CPF">

            <button class="btn-primary" onclick="salvarCliente()">
                Salvar Cliente
                
            <button class="btn-secondary" onclick="fecharFormularioCliente()">
                Cancelar
            </button>

            </button>
        </section>

        <section class="panel">
            <div class="toolbar">
                <input type="text" placeholder="Pesquisar cliente...">
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>E-mail</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody id="listaClientes">
                    <tr>
                        <td colspan="5">Nenhum cliente carregado ainda.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function abrirFormularioCliente() {
    const form = document.getElementById("formCliente");

    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

function fecharFormularioCliente() {
    document.getElementById("formCliente").style.display = "none";
}

function limparFormularioCliente() {
    document.getElementById("clienteNome").value = "";
    document.getElementById("clienteTelefone").value = "";
    document.getElementById("clienteEmail").value = "";
    document.getElementById("clienteCpf").value = "";
}