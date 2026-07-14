async function listarAgendamentosPorData(data) {
    const { data: agendamentos, error } = await supabaseClient
        .from("agendamentos")
        .select(`
            *,
            clientes (
                id,
                nome,
                telefone
            ),
            barbeiros (
                id,
                nome,
                cargo
            ),
            assinaturas (
                id,
                cortes_totais,
                cortes_restantes,
                status,
                planos (
                    id,
                    nome
                )
            )
        `)
        .eq("data", data)
        .order("horario", { ascending: true });

    if (error) {
        console.error("Erro ao listar agendamentos:", error);
        return [];
    }

    return agendamentos || [];
}

async function cadastrarAgendamento(agendamento) {
    const { data, error } = await supabaseClient
        .from("agendamentos")
        .insert([agendamento])
        .select()
        .single();

    if (error) {
        console.error("Erro ao cadastrar agendamento:", error);
        return null;
    }

    return data;
}

async function atualizarStatusAgendamento(id, status) {
    const { error } = await supabaseClient
        .from("agendamentos")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Erro ao atualizar agendamento:", error);
        return false;
    }

    return true;
}

async function excluirAgendamento(id) {
    const { error } = await supabaseClient
        .from("agendamentos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir agendamento:", error);
        return false;
    }

    return true;
}

async function buscarAgendamentoPorId(id) {
    const { data, error } = await supabaseClient
        .from("agendamentos")
        .select(`
            *,
            clientes (
                id,
                nome,
                telefone
            ),
            assinaturas (
                id,
                cortes_totais,
                cortes_restantes,
                status,
                planos (
                    id,
                    nome
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar agendamento:", error);
        return null;
    }

    return data;
}
