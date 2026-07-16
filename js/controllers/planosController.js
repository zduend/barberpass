let planoEditandoId = null;

async function salvarPlano() {
    const plano = {
        nome: document.getElementById("planoNome").value.trim(),
        descricao: document.getElementById("planoDescricao").value.trim(),
        valor: Number(document.getElementById("planoValor").value),
        quantidade_cortes: Number(document.getElementById("planoCortes").value),
        validade_dias: Number(document.getElementById("planoValidade").value),
        status: "ativo"
    };

    if (!plano.nome || !plano.valor || !plano.quantidade_cortes) {
        alert("Preencha nome, valor e quantidade de cortes.");
        return;
    }

    const sucesso = planoEditandoId
        ? await atualizarPlano(planoEditandoId, plano)
        : await cadastrarPlano(plano);

    if (!sucesso) {
        alert("Erro ao salvar plano.");
        return;
    }

    planoEditandoId = null;

    fecharFormularioPlano();
    mostrarSecao("planos");
    await mostrarSecao("planos");
}

async function atualizarListaPlanos() {
    const lista = document.getElementById("listaPlanos");

    if (!lista) return;

    lista.innerHTML = `<p class="empty-state">Carregando planos...</p>`;

    const planos = await listarPlanos();

    if (planos.length === 0) {
        lista.innerHTML = `<p class="empty-state">Nenhum plano cadastrado.</p>`;
        return;
    }

    lista.innerHTML = planos.map(plano => criarCardPlano(plano)).join("");
}

function criarCardPlano(plano) {
    const valorFormatado = Number(plano.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return `
        <div class="plano-card">
            <div class="plano-card-top">
                <div class="plano-icon">
                    <i class="fa-solid fa-crown"></i>
                </div>

                <span class="dashboard-status ativo">
                    ${plano.status}
                </span>
            </div>

            <h3>${plano.nome}</h3>

            <p>${plano.descricao || "Sem descrição"}</p>

            <div class="plano-preco">
                ${valorFormatado}
                <small>/ mês</small>
            </div>

            <div class="plano-info">
                <span>
                    <i class="fa-solid fa-scissors"></i>
                    ${plano.quantidade_cortes} cortes
                </span>

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${plano.validade_dias || 30} dias
                </span>
            </div>

            <div class="plano-actions">
                <button class="btn-small" onclick="editarPlano('${plano.id}')">
                    Editar
                </button>

                <button class="btn-small btn-delete" onclick="removerPlano('${plano.id}')">
                    Excluir
                </button>
            </div>
        </div>
    `;
}

async function editarPlano(id) {
    const plano = await buscarPlanoPorId(id);

    if (!plano) {
        alert("Plano não encontrado.");
        return;
    }

    planoEditandoId = id;

    abrirFormularioPlano();

    document.getElementById("planoNome").value =
        plano.nome || "";

    document.getElementById("planoDescricao").value =
        plano.descricao || "";

    document.getElementById("planoValor").value =
        plano.valor || "";

    document.getElementById("planoCortes").value =
        plano.quantidade_cortes || "";

    document.getElementById("planoValidade").value =
        plano.validade_dias || 30;
}