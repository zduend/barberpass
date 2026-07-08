async function listarClientes() {

    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*")
        .order("nome");

    if (error) {
        console.error(error);
        return [];
    }

    return data;

}

async function cadastrarCliente(cliente) {

    const { error } = await supabaseClient
        .from("clientes")
        .insert([cliente]);

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}

async function buscarClientePorId(id) {
    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

async function atualizarCliente(id, cliente) {
    const { error } = await supabaseClient
        .from("clientes")
        .update(cliente)
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

async function excluirCliente(id) {

    const { error } = await supabaseClient
        .from("clientes")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

async function contarClientes() {
    const { count, error } = await supabaseClient
        .from("clientes")
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error(error);
        return 0;
    }

    return count;
}

async function listarUltimosClientes() {

    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*")
        .order("id", { ascending: false })
        .limit(5);

    if (error) {
        console.error(error);
        return [];
    }

    return data;

}