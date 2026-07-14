async function listarAssinaturas() {
    const { data, error } = await supabaseClient
        .from("assinaturas")
        .select(`
            *,
            clientes (
                id,
                nome,
                telefone
            ),
            planos (
                id,
                nome,
                valor,
                quantidade_cortes,
                validade_dias
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao listar assinaturas:", error);
        return [];
    }

    return data || [];
}

async function cadastrarAssinatura(assinatura) {
    const { data, error } = await supabaseClient
        .from("assinaturas")
        .insert([assinatura])
        .select()
        .single();

    if (error) {
        console.error("Erro ao cadastrar assinatura:", error);
        return null;
    }

    return data;
}

async function buscarAssinaturaPorId(id) {
    const { data, error } = await supabaseClient
        .from("assinaturas")
        .select(`
            *,
            clientes (
                id,
                nome,
                telefone
            ),
            planos (
                id,
                nome,
                valor,
                quantidade_cortes,
                validade_dias
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar assinatura:", error);
        return null;
    }

    return data;
}

async function atualizarAssinatura(id, alteracoes) {
    const { data, error } = await supabaseClient
        .from("assinaturas")
        .update(alteracoes)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Erro ao atualizar assinatura:", error);
        return false;
    }

    console.log("Assinatura atualizada:", data);
    return true;
}

async function excluirAssinatura(id) {
    const { error } = await supabaseClient
        .from("assinaturas")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir assinatura:", error);
        return false;
    }

    return true;
}

async function registrarCorte(id, cortesRestantes) {

    if (cortesRestantes <= 0) {
        return false;
    }

    const { error } = await supabaseClient
        .from("assinaturas")
        .update({
            cortes_restantes: cortesRestantes - 1
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}