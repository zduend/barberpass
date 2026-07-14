async function carregarDashboard() {
    const hoje = new Date();
    const dataHoje = formatarDataISO(hoje);

    const [
        totalClientes,
        ultimosClientes,
        receitaMes,
        assinaturas,
        agendamentosHoje
    ] = await Promise.all([
        contarClientes(),
        listarUltimosClientes(),
        obterReceitaMes(),
        listarAssinaturas(),
        listarAgendamentosPorData(dataHoje)
    ]);

    const cortesHoje = agendamentosHoje.filter(
        agendamento => agendamento.status === "concluido"
    ).length;

    const planosAtivos = assinaturas.filter(
        assinatura => assinatura.status === "ativo"
    ).length;

    const receitaMesFormatada = Number(receitaMes || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    const hora = hoje.getHours();

    let saudacao = "";

    if (hora < 12) saudacao = "Bom dia";
    else if (hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    const nomeUsuario = "Samuel";

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
                valor: cortesHoje,
                descricao:
                    cortesHoje === 1
                        ? "Atendimento concluído"
                        : "Atendimentos concluídos"
            })}

            ${criarCard({
                icone: "fa-solid fa-wallet",
                titulo: "Receita do mês",
                valor: receitaMesFormatada,
                descricao: "Receitas registradas"
            })}

            ${criarCard({
                icone: "fa-solid fa-crown",
                titulo: "Planos ativos",
                valor: planosAtivos,
                descricao:
                    planosAtivos === 1
                        ? "Assinatura ativa"
                        : "Assinaturas ativas"
            })}
        </section>

        <div class="dashboard-main-grid">
            <section class="clientes-dashboard-card">
                <div class="dashboard-card-header">
                    <h2>Últimos Clientes</h2>

                    <button
                        type="button"
                        class="btn-outline-dashboard"
                        onclick="mostrarSecao('clientes')"
                    >
                        Ver todos
                    </button>
                </div>

                <div class="clientes-lista-dashboard">
                    ${
                        ultimosClientes.length > 0
                            ? ultimosClientes
                                .map(cliente =>
                                    criarLinhaClienteDashboard(cliente)
                                )
                                .join("")
                            : criarEstadoVazioDashboard(
                                "Nenhum cliente cadastrado."
                            )
                    }
                </div>

                <button
                    type="button"
                    class="btn-full-dashboard"
                    onclick="mostrarSecao('clientes')"
                >
                    <i class="fa-solid fa-users"></i>
                    Ver todos os clientes
                </button>
            </section>

            <section class="agenda-dashboard-card">
                <div class="dashboard-card-header">
                    <h2>Agenda do Dia</h2>

                    <button
                        type="button"
                        class="btn-outline-dashboard"
                        onclick="mostrarSecao('agenda')"
                    >
                        Ver agenda completa
                    </button>
                </div>

                <div class="agenda-dashboard-list">
                    ${criarAgendaDashboard(agendamentosHoje)}
                </div>

                <button
                    type="button"
                    class="btn-full-dashboard"
                    onclick="mostrarSecao('agenda')"
                >
                    <i class="fa-regular fa-calendar"></i>
                    Ver todos os horários
                </button>
            </section>
        </div>
    `;
}

function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function criarLinhaClienteDashboard(cliente) {
    const nome = cliente.nome || "Cliente";
    const inicial = nome.charAt(0).toUpperCase();

    return `
        <div class="cliente-dashboard-row">
            <div class="cliente-dashboard-info">
                <div class="dashboard-avatar">
                    ${inicial}
                </div>

                <div class="cliente-dashboard-texto">
                    <strong>${nome}</strong>
                    <span>${cliente.telefone || "-"}</span>
                </div>
            </div>

            <span class="dashboard-status ${cliente.status || "ativo"}">
                ${cliente.status || "ativo"}
            </span>
        </div>
    `;
}

function criarAgendaDashboard(agendamentos) {
    if (!agendamentos || agendamentos.length === 0) {
        return criarEstadoVazioDashboard(
            "Nenhum agendamento para hoje."
        );
    }

    return agendamentos
        .slice(0, 6)
        .map(agendamento => criarLinhaAgendaDashboard(agendamento))
        .join("");
}

function criarLinhaAgendaDashboard(agendamento) {
    const horario = String(agendamento.horario || "").slice(0, 5);
    const cliente = agendamento.clientes;
    const assinatura = agendamento.assinaturas;

    const nomeCliente = cliente?.nome || "Cliente não encontrado";
    const plano = assinatura?.planos?.nome || "Atendimento avulso";

    return `
        <div class="agenda-dashboard-row agenda-dashboard-agendada">
            <strong class="agenda-hora">
                ${horario}
            </strong>

            <div class="agenda-cliente-dashboard">
                <div class="agenda-avatar-dashboard">
                    ${nomeCliente.charAt(0).toUpperCase()}
                </div>

                <div>
                    <strong>${nomeCliente}</strong>

                    <span>
                        ${agendamento.servico || "Serviço"} · ${plano}
                    </span>
                </div>
            </div>

            <span class="agendamento-status ${agendamento.status}">
                ${formatarStatusAgendamento(agendamento.status)}
            </span>
        </div>
    `;
}

function criarEstadoVazioDashboard(mensagem) {
    return `
        <div class="dashboard-empty-state">
            <i class="fa-regular fa-folder-open"></i>
            <span>${mensagem}</span>
        </div>
    `;
}