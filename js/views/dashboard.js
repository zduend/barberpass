function carregarDashboard() {
    return `
        <section class="cards">
            <div class="card">
                <p>Clientes Ativos</p>
                <h2>128</h2>
                <small>Clientes com plano ativo</small>
            </div>

            <div class="card">
                <p>Receita do Mês</p>
                <h2>R$ 8.450</h2>
                <small>Total recebido no mês</small>
            </div>

            <div class="card">
                <p>Cortes Hoje</p>
                <h2>19</h2>
                <small>Atendimentos realizados hoje</small>
            </div>

            <div class="card">
                <p>Planos Vencendo</p>
                <h2>7</h2>
                <small>Renovações próximas</small>
            </div>
        </section>
    `;
}