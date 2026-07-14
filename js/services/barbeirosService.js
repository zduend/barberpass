async function listarBarbeiros() {

    const { data, error } = await supabaseClient
        .from("barbeiros")
        .select("*")
        .eq("status", "ativo")
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
        console.error(error);
        return null;
    }

    return data;

}