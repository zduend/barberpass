function calcularDiasRestantesAssinatura(dataVencimento) {
    if (!dataVencimento) return 0;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = dataVencimento.split("-").map(Number);
    const vencimento = new Date(ano, mes - 1, dia);
    vencimento.setHours(0, 0, 0, 0);

    const diferenca = vencimento.getTime() - hoje.getTime();

    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

function obterStatusVisualAssinatura(assinatura) {
    const cortesRestantes = Number(assinatura.cortes_restantes);
    const diasRestantes = calcularDiasRestantesAssinatura(
        assinatura.data_vencimento
    );

    if (assinatura.status === "pausado") {
        return {
            classe: "pausado",
            texto: "Pausado",
            mensagem: "Assinatura temporariamente pausada"
        };
    }

    if (cortesRestantes <= 0) {
        return {
            classe: "esgotado",
            texto: "Esgotado",
            mensagem: "Todos os cortes foram utilizados"
        };
    }

    if (diasRestantes < 0) {
        return {
            classe: "vencido",
            texto: "Vencido",
            mensagem: `Vencido há ${Math.abs(diasRestantes)} dia(s)`
        };
    }

    if (diasRestantes === 0) {
        return {
            classe: "vence-hoje",
            texto: "Vence hoje",
            mensagem: "A assinatura vence hoje"
        };
    }

    if (diasRestantes === 1) {
        return {
            classe: "vencendo",
            texto: "Vence amanhã",
            mensagem: "Falta 1 dia para o vencimento"
        };
    }

    if (diasRestantes <= 7) {
        return {
            classe: "vencendo",
            texto: "Vencendo",
            mensagem: `Vence em ${diasRestantes} dias`
        };
    }

    return {
        classe: "ativo",
        texto: "Ativo",
        mensagem: `Vence em ${diasRestantes} dias`
    };
}

function criarCardAssinatura(assinatura) {
    const cliente = assinatura.clientes;
    const plano = assinatura.planos;

    const cortesTotais = Number(assinatura.cortes_totais);
    const cortesRestantes = Number(assinatura.cortes_restantes);

    const percentual = cortesTotais > 0
        ? Math.max(
            0,
            Math.min(100, (cortesRestantes / cortesTotais) * 100)
        )
        : 0;

    const statusVisual = obterStatusVisualAssinatura(assinatura);

    const podeRegistrarCorte =
        cortesRestantes > 0 &&
        statusVisual.classe !== "vencido" &&
        statusVisual.classe !== "pausado";

    return `
        <article class="assinatura-card ${statusVisual.classe}">

            <div class="assinatura-card-header">
                <div class="assinatura-cliente">
                    <div class="assinatura-avatar">
                        ${cliente?.nome?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div>
                        <h3>${cliente?.nome || "Cliente não encontrado"}</h3>
                        <span>${cliente?.telefone || "-"}</span>
                    </div>
                </div>

                <span class="dashboard-status ${statusVisual.classe}">
                    ${statusVisual.texto}
                </span>
            </div>

            <div class="assinatura-plano">
                <i class="fa-solid fa-crown"></i>

                <div>
                    <span>Plano contratado</span>
                    <strong>${plano?.nome || "Plano não encontrado"}</strong>
                </div>
            </div>

            <div class="assinatura-cortes">
                <div class="assinatura-cortes-topo">
                    <span>Cortes restantes</span>

                    <strong>
                        ${cortesRestantes}/${cortesTotais}
                    </strong>
                </div>

                <div class="assinatura-progresso ${statusVisual.classe}">
                    <div style="width:${percentual}%"></div>
                </div>
            </div>

            <div class="assinatura-aviso ${statusVisual.classe}">
                <i class="fa-regular fa-calendar"></i>
                ${statusVisual.mensagem}
            </div>

            <div class="assinatura-datas">
                <div>
                    <span>Início</span>
                    <strong>
                        ${formatarDataAssinatura(assinatura.data_inicio)}
                    </strong>
                </div>

                <div>
                    <span>Vencimento</span>
                    <strong>
                        ${formatarDataAssinatura(assinatura.data_vencimento)}
                    </strong>
                </div>
            </div>

            <div class="assinatura-actions">
                <button
                    class="btn-registrar-corte"
                    onclick="consumirCorte(
                        '${assinatura.id}',
                        ${cortesRestantes}
                    )"
                    ${podeRegistrarCorte ? "" : "disabled"}
                >
                    <i class="fa-solid fa-scissors"></i>

                    ${
                        cortesRestantes <= 0
                            ? "Plano esgotado"
                            : "Registrar corte"
                    }
                </button>

                <button
                    class="btn-assinatura-excluir"
                    onclick="removerAssinatura('${assinatura.id}')"
                    title="Excluir assinatura"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>

        </article>
    `;
}