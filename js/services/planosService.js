async function listarPlanos() {
    const { data, error } = await supabaseClient
        .from("planos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao listar planos:", error);
        return [];
    }

    return data;
}

async function cadastrarPlano(plano) {
    const { error } = await supabaseClient
        .from("planos")
        .insert([plano]);

    if (error) {
        console.error("Erro ao cadastrar plano:", error);
        return false;
    }

    return true;
}

async function buscarPlanoPorId(id) {
    const { data, error } = await supabaseClient
        .from("planos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar plano:", error);
        return null;
    }

    return data;
}

async function atualizarPlano(id, plano) {
    const { error } = await supabaseClient
        .from("planos")
        .update(plano)
        .eq("id", id);

    if (error) {
        console.error("Erro ao atualizar plano:", error);
        return false;
    }

    return true;
}

async function excluirPlano(id) {
    const { error } = await supabaseClient
        .from("planos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir plano:", error);
        return false;
    }

    return true;
}