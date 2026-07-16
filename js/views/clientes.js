function carregarClientes() {
    return `
        <section class="page-header">
            <div>
                <h2>Clientes</h2>
                <p>Gerencie os clientes cadastrados na barbearia.</p>
            </div>

            <button
                type="button"
                class="btn-primary"
                onclick="abrirFormularioCliente()"
            >
                <i class="fa-solid fa-plus"></i>
                Novo Cliente
            </button>
        </section>

        <section class="panel">
            <div class="toolbar">
                <input
                    type="text"
                    placeholder="Pesquisar cliente..."
                    oninput="filtrarClientesTabela(this.value)"
                >
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
                        <td colspan="5">
                            Nenhum cliente carregado ainda.
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function abrirFormularioCliente() {
    abrirModal(
        clienteEditandoId
            ? "Editar Cliente"
            : "Novo Cliente",
        `
            <div class="cliente-form">

                <p class="modal-description">
                    ${
                        clienteEditandoId
                            ? "Atualize os dados do cliente."
                            : "Cadastre um novo cliente da sua barbearia."
                    }
                </p>

                <div class="form-group">
                    <label for="clienteNome">Nome</label>

                    <input
                        id="clienteNome"
                        type="text"
                        placeholder="Nome completo"
                    >
                </div>

                <div class="form-group">
                    <label for="clienteTelefone">Telefone</label>

                    <input
                        id="clienteTelefone"
                        type="text"
                        placeholder="(61) 99999-9999"
                    >
                </div>

                <div class="form-group">
                    <label for="clienteEmail">E-mail</label>

                    <input
                        id="clienteEmail"
                        type="email"
                        placeholder="cliente@email.com"
                    >
                </div>

                <div class="form-group">
                    <label for="clienteCpf">CPF</label>

                    <input
                        id="clienteCpf"
                        type="text"
                        placeholder="000.000.000-00"
                    >
                </div>

                <div class="form-actions cliente-form-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharFormularioCliente()"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn-primary"
                        onclick="salvarCliente()"
                    >
                        <i class="fa-solid fa-check"></i>

                        ${
                            clienteEditandoId
                                ? "Salvar alterações"
                                : "Salvar cliente"
                        }
                    </button>
                </div>

            </div>
        `
    );
}

function fecharFormularioCliente() {
    clienteEditandoId = null;
    fecharModal();
}

function limparFormularioCliente() {
    const campos = [
        "clienteNome",
        "clienteTelefone",
        "clienteEmail",
        "clienteCpf"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });
}

function filtrarClientesTabela(texto) {
    const busca = texto.trim().toLowerCase();

    const linhas = document.querySelectorAll(
        "#listaClientes tr"
    );

    linhas.forEach(linha => {
        linha.style.display = linha.innerText
            .toLowerCase()
            .includes(busca)
                ? ""
                : "none";
    });
}