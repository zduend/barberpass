async function carregarDashboard() {
    const totalClientes = await contarClientes();
    const ultimosClientes = await listarUltimosClientes();

    const hora = new Date().getHours();

    let saudacao = "";

    if (hora < 12) saudacao = "Bom dia";
    else if (hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    const nomeUsuario = "Samuel";

    const hoje = new Date();

    const dataAtual = hoje.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long"
    });

    return `
        <section class="dashboard-hero">
            <div class="hero-text">
                <span class="hero-badge">
                    <i class="fa-solid fa-chart-line"></i>
                    Painel administrativo
                </span>

                <h1>${saudacao}, ${nomeUsuario} 👋</h1>

                <p>
                    Bem-vindo ao BarberPass. Aqui está um resumo da sua barbearia hoje.
                </p>
            </div>

            <div class="hero-date">
                <i class="fa-regular fa-calendar"></i>

                <div>
                    <strong>${dataAtual}</strong>
                    <span>Resumo diário</span>
                </div>
            </div>
        </section>

        <section class="stats-grid">
            ${criarCard({
                icone: "fa-solid fa-users",
                titulo: "Clientes cadastrados",
                valor: totalClientes,
                descricao: "Total no sistema"
            })}

            ${criarCard({
                icone: "fa-solid fa-scissors",
                titulo: "Cortes hoje",
                valor: 0,
                descricao: "Em breve"
            })}

            ${criarCard({
                icone: "fa-solid fa-wallet",
                titulo: "Receita do mês",
                valor: "R$ 0,00",
                descricao: "Em breve"
            })}

            ${criarCard({
                icone: "fa-solid fa-crown",
                titulo: "Planos ativos",
                valor: 0,
                descricao: "Em breve"
            })}
        </section>

        <div class="dashboard-main-grid">
            <section class="clientes-dashboard-card">
                <div class="dashboard-card-header">
                    <h2>Últimos Clientes</h2>

                    <a class="btn-outline-dashboard" href="javascript:void(0)">
                        Ver todos
                    </a>
                </div>

                <div class="clientes-lista-dashboard">
                    ${ultimosClientes.map(cliente => criarLinhaClienteDashboard(cliente)).join("")}
                </div>

                <a class="btn-full-dashboard" href="javascript:void(0)">
                    <i class="fa-solid fa-users"></i>
                    Ver todos os clientes
                </a>
            </section>

            <section class="agenda-dashboard-card">
                <div class="dashboard-card-header">
                    <h2>Agenda do Dia</h2>

                    <a class="btn-outline-dashboard" href="javascript:void(0)">
                        Ver agenda completa
                    </a>
                </div>

                <div class="agenda-dashboard-list">
                    ${criarHorarioLivre("09:00")}
                    ${criarHorarioLivre("09:40")}
                    ${criarHorarioLivre("10:20")}
                    ${criarHorarioLivre("11:00")}
                    ${criarHorarioLivre("11:40")}
                    ${criarHorarioLivre("13:00")}
                </div>

                <a class="btn-full-dashboard" href="javascript:void(0)">
                    <i class="fa-regular fa-calendar"></i>
                    Ver todos os horários
                </a>
            </section>
        </div>
    `;
}

function criarLinhaClienteDashboard(cliente) {
    const inicial = cliente.nome.charAt(0).toUpperCase();

    return `
        <div class="cliente-dashboard-row">
            <div class="cliente-dashboard-info">
                <div class="dashboard-avatar">
                    ${inicial}
                </div>

                <div class="cliente-dashboard-texto">
                    <strong>${cliente.nome}</strong>
                    <span>${cliente.telefone}</span>
                </div>
            </div>

            <span class="dashboard-status ativo">
                ${cliente.status}
            </span>
        </div>
    `;
}

function criarHorarioLivre(horario) {
    return `
        <div class="agenda-dashboard-row">
            <strong class="agenda-hora">${horario}</strong>

            <div class="agenda-livre-info">
                <div class="agenda-plus">
                    <i class="fa-solid fa-plus"></i>
                </div>

                <span>Horário livre</span>
            </div>

            <a class="btn-agendar" href="javascript:void(0)">
                Agendar
            </a>
        </div>
    `;
}