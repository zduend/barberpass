async function listarMovimentacoesFinanceiras() {
    const { data, error } = await supabaseClient
        .from("financeiro")
        .select(`
            *,
            clientes (
                id,
                nome,
                telefone
            ),
            assinaturas (
                id,
                planos (
                    id,
                    nome
                )
            ),
            agendamentos (
                id,
                servico,
                data,
                horario
            )
        `)
        .order("data", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao listar movimentações financeiras:", error);
        return [];
    }

    return data || [];
}

async function cadastrarMovimentacaoFinanceira(movimentacao) {
    const { data, error } = await supabaseClient
        .from("financeiro")
        .insert([movimentacao])
        .select()
        .single();

    if (error) {
        console.error("Erro ao cadastrar movimentação financeira:", error);
        return null;
    }

    return data;
}

async function registrarReceita({
    data,
    categoria,
    descricao,
    valor,
    formaPagamento = null,
    clienteId = null,
    assinaturaId = null,
    agendamentoId = null,
    barbeiroId = null
}) {
    return cadastrarMovimentacaoFinanceira({
        data,
        tipo: "receita",
        categoria,
        descricao: descricao || null,
        valor: Number(valor),
        forma_pagamento: formaPagamento,
        cliente_id: clienteId,
        assinatura_id: assinaturaId,
        agendamento_id: agendamentoId,
        barbeiro_id: barbeiroId
    });
}

async function registrarDespesa({
    data,
    categoria,
    descricao,
    valor,
    formaPagamento = null
}) {
    return cadastrarMovimentacaoFinanceira({
        data,
        tipo: "despesa",
        categoria,
        descricao: descricao || null,
        valor: Number(valor),
        forma_pagamento: formaPagamento,
        cliente_id: null,
        assinatura_id: null,
        agendamento_id: null
    });
}

async function excluirMovimentacaoFinanceira(id) {
    const { error } = await supabaseClient
        .from("financeiro")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir movimentação financeira:", error);
        return false;
    }

    return true;
}

async function listarMovimentacoesPorPeriodo(dataInicial, dataFinal) {
    const { data, error } = await supabaseClient
        .from("financeiro")
        .select("*")
        .gte("data", dataInicial)
        .lte("data", dataFinal)
        .order("data", { ascending: false });

    if (error) {
        console.error("Erro ao listar período financeiro:", error);
        return [];
    }

    return data || [];
}

async function calcularResumoFinanceiro(dataInicial, dataFinal) {
    const movimentacoes = await listarMovimentacoesPorPeriodo(
        dataInicial,
        dataFinal
    );

    const receitas = movimentacoes
        .filter(item => item.tipo === "receita")
        .reduce((total, item) => total + Number(item.valor || 0), 0);

    const despesas = movimentacoes
        .filter(item => item.tipo === "despesa")
        .reduce((total, item) => total + Number(item.valor || 0), 0);

    return {
        receitas,
        despesas,
        saldo: receitas - despesas,
        quantidade: movimentacoes.length
    };
}

async function calcularReceitaDoMes() {
    const hoje = new Date();

    const primeiroDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    );

    const ultimoDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth() + 1,
        0
    );

    const formatarData = data => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    };

    const resumo = await calcularResumoFinanceiro(
        formatarData(primeiroDia),
        formatarData(ultimoDia)
    );

    return resumo.receitas;
}

async function obterReceitaMes() {

    const hoje = new Date();

    const inicioMes =
        `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;

    const ultimoDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth() + 1,
        0
    ).getDate();

    const fimMes =
        `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${ultimoDia}`;

    const { data, error } = await supabaseClient
        .from("financeiro")
        .select("valor")
        .eq("tipo", "receita")
        .gte("data", inicioMes)
        .lte("data", fimMes);

    if (error) {

        console.error(error);

        return 0;

    }

    return data.reduce(
        (total, item) => total + Number(item.valor),
        0
    );

}