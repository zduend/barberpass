let planosDisponiveisAssinatura = [];

async function carregarSelectsAssinatura() {
    const selectCliente = document.getElementById("assinaturaCliente");
    const selectPlano = document.getElementById("assinaturaPlano");
    const inputInicio = document.getElementById("assinaturaInicio");

    if (!selectCliente || !selectPlano || !inputInicio) return;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    inputInicio.value = `${ano}-${mes}-${dia}`;

    const [clientes, planos] = await Promise.all([
        listarClientes(),
        listarPlanos()
    ]);

    planosDisponiveisAssinatura = planos;

    selectCliente.innerHTML = `
        <option value="">Selecione um cliente</option>

        ${clientes.map(cliente => `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `).join("")}
    `;

    selectPlano.innerHTML = `
        <option value="">Selecione um plano</option>

        ${planos
            .filter(plano => plano.status === "ativo")
            .map(plano => `
                <option value="${plano.id}">
                    ${plano.nome}
                </option>
            `).join("")}
    `;
}

function preencherDadosPlanoAssinatura() {
    const planoId = document.getElementById("assinaturaPlano")?.value;
    const dataInicio = document.getElementById("assinaturaInicio")?.value;
    const resumo = document.getElementById("resumoPlanoAssinatura");

    if (!planoId || !resumo) {
        resumo?.classList.add("hidden");
        return;
    }

    const plano = planosDisponiveisAssinatura.find(
        item => item.id === planoId
    );

    if (!plano) {
        resumo.classList.add("hidden");
        return;
    }

    const validade = Number(plano.validade_dias || 30);
    const vencimento = calcularDataVencimento(dataInicio, validade);

    const valor = Number(plano.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    document.getElementById("assinaturaResumoValor").textContent = valor;

    document.getElementById("assinaturaResumoCortes").textContent =
        plano.quantidade_cortes;

    document.getElementById("assinaturaResumoValidade").textContent =
        `${validade} dias`;

    document.getElementById("assinaturaResumoVencimento").textContent =
        formatarDataAssinatura(vencimento);

    resumo.classList.remove("hidden");
}

async function salvarAssinatura() {
    const clienteId = document.getElementById("assinaturaCliente")?.value;
    const planoId = document.getElementById("assinaturaPlano")?.value;
    const dataInicio = document.getElementById("assinaturaInicio")?.value;

    if (!clienteId || !planoId || !dataInicio) {
        alert("Selecione o cliente, o plano e a data de início.");
        return;
    }

    const plano = planosDisponiveisAssinatura.find(
        item => item.id === planoId
    );

    if (!plano) {
        alert("Plano selecionado não foi encontrado.");
        return;
    }

    const validade = Number(plano.validade_dias || 30);
    const quantidadeCortes = Number(plano.quantidade_cortes);

    const assinatura = {
        cliente_id: clienteId,
        plano_id: planoId,
        data_inicio: dataInicio,
        data_vencimento: calcularDataVencimento(dataInicio, validade),
        cortes_totais: quantidadeCortes,
        cortes_restantes: quantidadeCortes,
        status: "ativo"
    };

    const sucesso = await cadastrarAssinatura(assinatura);

    if (!sucesso) {
        alert("Não foi possível criar a assinatura.");
        return;
    }

    fecharModal();
    await atualizarListaAssinaturas();
}

async function atualizarListaAssinaturas() {
    const lista = document.getElementById("listaAssinaturas");

    if (!lista) return;

    lista.innerHTML = `
        <p class="empty-state">
            Carregando assinaturas...
        </p>
    `;

    const assinaturas = await listarAssinaturas();

    if (assinaturas.length === 0) {
        lista.innerHTML = `
            <p class="empty-state">
                Nenhuma assinatura cadastrada.
            </p>
        `;

        return;
    }

    lista.innerHTML = assinaturas
        .map(assinatura => criarCardAssinatura(assinatura))
        .join("");
}

function criarCardAssinatura(assinatura) {
    const cliente = assinatura.clientes;
    const plano = assinatura.planos;

    const cortesTotais = Number(assinatura.cortes_totais);
    const cortesRestantes = Number(assinatura.cortes_restantes);

    const percentual = cortesTotais > 0
        ? Math.max(
            0,
            Math.min(100, (cortesRestantes / cortesTotais) * 100)
        )
        : 0;

    return `
        <article class="assinatura-card">

            <div class="assinatura-card-header">
                <div class="assinatura-cliente">
                    <div class="assinatura-avatar">
                        ${cliente?.nome?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div>
                        <h3>${cliente?.nome || "Cliente não encontrado"}</h3>
                        <span>${cliente?.telefone || "-"}</span>
                    </div>
                </div>

                <span class="dashboard-status ${assinatura.status}">
                    ${assinatura.status}
                </span>
            </div>

            <div class="assinatura-plano">
                <i class="fa-solid fa-crown"></i>

                <div>
                    <span>Plano contratado</span>
                    <strong>${plano?.nome || "Plano não encontrado"}</strong>
                </div>
            </div>

            <div class="assinatura-cortes">
                <div class="assinatura-cortes-topo">
                    <span>Cortes restantes</span>

                    <strong>
                        ${cortesRestantes}/${cortesTotais}
                    </strong>
                </div>

                <div class="assinatura-progresso">
                    <div style="width:${percentual}%"></div>
                </div>
            </div>

            <div class="assinatura-datas">
                <div>
                    <span>Início</span>
                    <strong>
                        ${formatarDataAssinatura(assinatura.data_inicio)}
                    </strong>
                </div>

                <div>
                    <span>Vencimento</span>
                    <strong>
                        ${formatarDataAssinatura(assinatura.data_vencimento)}
                    </strong>
                </div>
            </div>

            <button
                class="btn-small btn-delete"
                onclick="removerAssinatura('${assinatura.id}')"
            >
                <i class="fa-solid fa-trash"></i>
                Excluir
            </button>

        </article>
    `;
}

async function removerAssinatura(id) {
    const confirmar = confirm(
        "Deseja realmente excluir esta assinatura?"
    );

    if (!confirmar) return;

    const sucesso = await excluirAssinatura(id);

    if (!sucesso) {
        alert("Não foi possível excluir a assinatura.");
        return;
    }

    await atualizarListaAssinaturas();
}