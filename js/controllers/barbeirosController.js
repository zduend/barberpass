let barbeiroEditandoId = null;

async function salvarBarbeiro() {
    const barbeiro = {
        nome: document.getElementById("barbeiroNome")?.value.trim(),
        telefone: document.getElementById("barbeiroTelefone")?.value.trim(),
        email: document.getElementById("barbeiroEmail")?.value.trim(),
        cargo: document.getElementById("barbeiroCargo")?.value,
        comissao: Number(
            document.getElementById("barbeiroComissao")?.value
        ),
        status: document.getElementById("barbeiroStatus")?.value
    };

    if (!barbeiro.nome) {
        alert("Informe o nome do barbeiro.");
        return;
    }

    if (
        Number.isNaN(barbeiro.comissao) ||
        barbeiro.comissao < 0 ||
        barbeiro.comissao > 100
    ) {
        alert("Informe uma comissão entre 0 e 100.");
        return;
    }

    const resultado = barbeiroEditandoId
        ? await atualizarBarbeiro(barbeiroEditandoId, barbeiro)
        : await cadastrarBarbeiro(barbeiro);

    if (!resultado) {
        alert("Não foi possível salvar o barbeiro.");
        return;
    }

    fecharFormularioBarbeiro();
    await mostrarSecao("barbeiros");
}

async function atualizarListaBarbeiros() {
    const lista = document.getElementById("listaBarbeiros");

    if (!lista) return;

    lista.innerHTML = `
        <p class="empty-state">
            Carregando barbeiros...
        </p>
    `;

    const barbeiros = await listarTodosBarbeiros();

    if (barbeiros.length === 0) {
        lista.innerHTML = `
            <p class="empty-state">
                Nenhum barbeiro cadastrado.
            </p>
        `;

        return;
    }

    const barbeirosComResumo = await Promise.all(
    barbeiros.map(async barbeiro => {
        const resumo = await obterResumoBarbeiroMes(
            barbeiro.id
        );

        return {
            ...barbeiro,
            resumo
        };
    })
);

lista.innerHTML = barbeirosComResumo
    .map(barbeiro =>
        criarCardBarbeiro(barbeiro)
    )
    .join("");
}

function criarCardBarbeiro(barbeiro) {
    const inicial = barbeiro.nome?.charAt(0).toUpperCase() || "?";

    const cargoFormatado =
        barbeiro.cargo === "dono"
            ? "Dono"
            : "Barbeiro";

    const comissao = Number(
        barbeiro.comissao || 0
    ).toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

const atendimentos =
    barbeiro.resumo?.atendimentos || 0;

const receita =
    barbeiro.resumo?.receita || 0;

const comissaoEstimada =
    receita * (Number(barbeiro.comissao || 0) / 100);

const receitaFormatada = receita.toLocaleString(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
);

const comissaoEstimadaFormatada =
    comissaoEstimada.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    return `
        <article class="barbeiro-card">
            <div class="barbeiro-card-header">
                <div class="barbeiro-identidade">
                    <div class="barbeiro-avatar">
                        ${inicial}
                    </div>

                    <div>
                        <h3>${barbeiro.nome}</h3>
                        <span>${cargoFormatado}</span>
                    </div>
                </div>

                <span class="dashboard-status ${barbeiro.status}">
                    ${barbeiro.status}
                </span>
            </div>

<div class="barbeiro-metricas">
    <div>
        <span>Atendimentos</span>
        <strong>${atendimentos}</strong>
    </div>

    <div>
        <span>Receita</span>
        <strong>${receitaFormatada}</strong>
    </div>

    <div>
        <span>Comissão estimada</span>
        <strong>${comissaoEstimadaFormatada}</strong>
    </div>
</div>

            <div class="barbeiro-dados">
                <div>
                    <span>Telefone</span>
                    <strong>${barbeiro.telefone || "-"}</strong>
                </div>

                <div>
                    <span>E-mail</span>
                    <strong>${barbeiro.email || "-"}</strong>
                </div>

                <div>
                    <span>Comissão</span>
                    <strong>${comissao}%</strong>
                </div>
            </div>

            <div class="barbeiro-actions">
                <button
                    type="button"
                    class="btn-small"
                    onclick="editarBarbeiro('${barbeiro.id}')"
                >
                    <i class="fa-solid fa-pen"></i>
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-small btn-delete"
                    onclick="removerBarbeiro('${barbeiro.id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                    Excluir
                </button>
            </div>
        </article>
    `;
}

async function editarBarbeiro(id) {
    const barbeiro = await buscarBarbeiroPorId(id);

    if (!barbeiro) {
        alert("Barbeiro não encontrado.");
        return;
    }

    barbeiroEditandoId = id;

    abrirFormularioBarbeiro();

    document.getElementById("barbeiroNome").value =
        barbeiro.nome || "";

    document.getElementById("barbeiroTelefone").value =
        barbeiro.telefone || "";

    document.getElementById("barbeiroEmail").value =
        barbeiro.email || "";

    document.getElementById("barbeiroCargo").value =
        barbeiro.cargo || "barbeiro";

    document.getElementById("barbeiroComissao").value =
        barbeiro.comissao ?? 0;

    document.getElementById("barbeiroStatus").value =
        barbeiro.status || "ativo";
}

async function removerBarbeiro(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este barbeiro?"
    );

    if (!confirmar) return;

    const sucesso = await excluirBarbeiro(id);

    if (!sucesso) {
        alert(
            "Não foi possível excluir o barbeiro. Ele pode possuir agendamentos vinculados."
        );
        return;
    }

    await atualizarListaBarbeiros();
}