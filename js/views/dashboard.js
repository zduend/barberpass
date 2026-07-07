async function carregarDashboard() {
    const totalClientes = await contarClientes();

    return `
        <section class="dashboard-header">
            <div>
                <h1>Bem-vindo, Samuel 👋</h1>
                <p>Visão geral do BarberPass</p>
            </div>

            <button class="btn-primary" onclick="mostrarSecao('clientes')">
                <i class="fa-solid fa-user-plus"></i>
                Novo Cliente
            </button>
        </section>

        <section class="stats-grid">
            ${criarCard("fa-solid fa-users", "Clientes cadastrados", totalClientes, "Total no sistema")}
            ${criarCard("fa-solid fa-scissors", "Cortes hoje", 0, "Em breve")}
            ${criarCard("fa-solid fa-wallet", "Receita do mês", "R$ 0,00", "Em breve")}
            ${criarCard("fa-solid fa-crown", "Planos ativos", 0, "Em breve")}
        </section>
    `;
}