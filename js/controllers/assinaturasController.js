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

    const assinaturaCriada = await cadastrarAssinatura(assinatura);

if (!assinaturaCriada) {
    alert("Não foi possível criar a assinatura.");
    return;
}

const receitaCriada = await registrarReceita({
    data: dataInicio,
    categoria: "plano",
    descricao: `Assinatura do plano ${plano.nome}`,
    valor: Number(plano.valor),
    clienteId,
    assinaturaId: assinaturaCriada.id
});

if (!receitaCriada) {
    console.error(
        "A assinatura foi criada, mas não foi possível registrar a receita."
    );

    const assinaturaRemovida = await excluirAssinatura(
        assinaturaCriada.id
    );

    if (!assinaturaRemovida) {
        alert(
            "A assinatura foi criada, mas houve erro ao registrar a receita. Verifique o Financeiro."
        );
        return;
    }

    alert(
        "Não foi possível registrar a receita. A assinatura não foi concluída."
    );
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

async function consumirCorte(id, restantes) {

    if (restantes <= 0) {

        alert("Este plano não possui mais cortes.");

        return;

    }

    const confirmar = confirm(
        "Registrar um corte para este cliente?"
    );

    if (!confirmar) return;

    const sucesso = await registrarCorte(id, restantes);

    if (!sucesso) {

        alert("Erro ao registrar corte.");

        return;

    }

    atualizarListaAssinaturas();

}