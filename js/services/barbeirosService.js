async function listarBarbeiros() {
    const { data, error } = await supabaseClient
        .from("barbeiros")
        .select("*")
        .eq("status", "ativo")
        .order("nome");

    if (error) {
        console.error("Erro ao listar barbeiros ativos:", error);
        return [];
    }

    return data || [];
}

async function listarTodosBarbeiros() {
    const { data, error } = await supabaseClient
        .from("barbeiros")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro ao listar barbeiros:", error);
        return [];
    }

    return data || [];
}

async function buscarBarbeiroPorId(id) {
    const { data, error } = await supabaseClient
        .from("barbeiros")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar barbeiro:", error);
        return null;
    }

    return data;
}

async function cadastrarBarbeiro(barbeiro) {
    const { data, error } = await supabaseClient
        .from("barbeiros")
        .insert([barbeiro])
        .select()
        .single();

    if (error) {
        console.error("Erro ao cadastrar barbeiro:", error);
        return null;
    }

    return data;
}

async function atualizarBarbeiro(id, barbeiro) {
    const { data, error } = await supabaseClient
        .from("barbeiros")
        .update(barbeiro)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Erro ao atualizar barbeiro:", error);
        return null;
    }

    return data;
}

async function excluirBarbeiro(id) {
    const { error } = await supabaseClient
        .from("barbeiros")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir barbeiro:", error);
        return false;
    }

    return true;
}

async function obterResumoBarbeiroMes(barbeiroId) {
    const hoje = new Date();

    const inicioMes =
        `${hoje.getFullYear()}-${String(
            hoje.getMonth() + 1
        ).padStart(2, "0")}-01`;

    const ultimoDia = new Date(
        hoje.getFullYear(),
        hoje.getMonth() + 1,
        0
    ).getDate();

    const fimMes =
        `${hoje.getFullYear()}-${String(
            hoje.getMonth() + 1
        ).padStart(2, "0")}-${String(
            ultimoDia
        ).padStart(2, "0")}`;

    const [
        respostaAgendamentos,
        respostaFinanceiro
    ] = await Promise.all([
        supabaseClient
            .from("agendamentos")
            .select("id", {
                count: "exact",
                head: true
            })
            .eq("barbeiro_id", barbeiroId)
            .eq("status", "concluido")
            .gte("data", inicioMes)
            .lte("data", fimMes),

        supabaseClient
            .from("financeiro")
            .select("valor")
            .eq("barbeiro_id", barbeiroId)
            .eq("tipo", "receita")
            .gte("data", inicioMes)
            .lte("data", fimMes)
    ]);

    if (respostaAgendamentos.error) {
        console.error(
            "Erro ao contar atendimentos do barbeiro:",
            respostaAgendamentos.error
        );
    }

    if (respostaFinanceiro.error) {
        console.error(
            "Erro ao calcular receita do barbeiro:",
            respostaFinanceiro.error
        );
    }

    const atendimentos =
        respostaAgendamentos.count || 0;

    const receita = (
        respostaFinanceiro.data || []
    ).reduce(
        (total, item) =>
            total + Number(item.valor || 0),
        0
    );

    return {
        atendimentos,
        receita
    };
}