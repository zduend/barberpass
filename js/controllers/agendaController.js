async function prepararFormularioAgendamento() {
    const clienteSelect = document.getElementById(
        "agendamentoCliente"
    );

    const barbeiroSelect = document.getElementById(
        "agendamentoBarbeiro"
    );

    const dataInput = document.getElementById(
        "agendamentoData"
    );

    const assinaturaSelect = document.getElementById(
        "agendamentoAssinatura"
    );

    if (!clienteSelect || !dataInput) return;

    const [clientes, barbeiros] = await Promise.all([
        listarClientes(),
        listarBarbeiros()
    ]);

    clienteSelect.innerHTML = `
        <option value="">Selecione um cliente</option>

        ${clientes.map(cliente => `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `).join("")}
    `;

    if (barbeiroSelect) {
        barbeiroSelect.innerHTML = `
            <option value="">Selecione um barbeiro</option>

            ${barbeiros.map(barbeiro => `
                <option value="${barbeiro.id}">
                    ${barbeiro.nome}
                </option>
            `).join("")}
        `;
    }

    const dataSelecionada =
        document.getElementById("agendaData")?.value ||
        new Date().toISOString().split("T")[0];

    dataInput.value = dataSelecionada;

    if (assinaturaSelect) {
        assinaturaSelect.disabled = true;

        assinaturaSelect.innerHTML = `
            <option value="">Selecione um cliente</option>
        `;
    }

    alternarCamposPagamentoAgendamento(false);
}

const barbeiroSelect = document.getElementById("agendamentoBarbeiro");

if (barbeiroSelect) {

    barbeiroSelect.innerHTML = `
        <option value="">Selecione um barbeiro</option>

        ${barbeiros.map(barbeiro => `
            <option value="${barbeiro.id}">
                ${barbeiro.nome}
            </option>
        `).join("")}
    `;

}

async function carregarAssinaturaDoCliente() {
    const clienteId = document.getElementById(
        "agendamentoCliente"
    )?.value;

    const assinaturaSelect = document.getElementById(
        "agendamentoAssinatura"
    );

    const mensagem = document.getElementById(
        "mensagemAssinaturaAgenda"
    );

    if (!assinaturaSelect) return;

    assinaturaSelect.disabled = true;
    assinaturaSelect.innerHTML = `
        <option value="">Selecione um cliente</option>
    `;

    if (mensagem) {
        mensagem.textContent = "";
        mensagem.className = "agenda-field-message";
    }

    if (!clienteId) {
        alternarCamposPagamentoAgendamento(false);
        return;
    }

    const assinaturas = await listarAssinaturas();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    /*
     * Procura uma assinatura:
     * - pertencente ao cliente;
     * - ativa;
     * - dentro da validade;
     * - com cortes restantes.
     */
    const assinaturaDisponivel = assinaturas.find(assinatura => {
        if (assinatura.cliente_id !== clienteId) {
            return false;
        }

        if (assinatura.status !== "ativo") {
            return false;
        }

        if (Number(assinatura.cortes_restantes) <= 0) {
            return false;
        }

        if (assinatura.data_vencimento) {
            const [ano, mes, dia] = assinatura.data_vencimento
                .split("-")
                .map(Number);

            const vencimento = new Date(ano, mes - 1, dia);
            vencimento.setHours(0, 0, 0, 0);

            if (vencimento < hoje) {
                return false;
            }
        }

        return true;
    });

    /*
     * Se o cliente possui cortes:
     * seleciona automaticamente o plano
     * e esconde valor e pagamento.
     */
    if (assinaturaDisponivel) {
        assinaturaSelect.innerHTML = `
            <option value="${assinaturaDisponivel.id}">
                ${assinaturaDisponivel.planos?.nome || "Plano"} —
                ${assinaturaDisponivel.cortes_restantes}/
                ${assinaturaDisponivel.cortes_totais} cortes
            </option>
        `;

        assinaturaSelect.value = assinaturaDisponivel.id;
        assinaturaSelect.disabled = true;

        if (mensagem) {
            mensagem.textContent =
                "Este atendimento utilizará um corte da assinatura.";
        }

        alternarCamposPagamentoAgendamento(false);
        return;
    }

    /*
     * Se não possui assinatura ou os cortes acabaram:
     * transforma automaticamente em atendimento avulso
     * e mostra os campos de pagamento.
     */
    assinaturaSelect.innerHTML = `
        <option value="">Atendimento avulso</option>
    `;

    assinaturaSelect.value = "";
    assinaturaSelect.disabled = true;

    if (mensagem) {
        mensagem.textContent =
            "O cliente não possui cortes disponíveis. Informe o valor e a forma de pagamento.";

        mensagem.classList.add("aviso");
    }

    alternarCamposPagamentoAgendamento(true);
}

function alternarCamposPagamentoAgendamento(mostrarPagamento) {
    const camposPagamento = document.getElementById(
        "dadosPagamentoAvulso"
    );

    const valorInput = document.getElementById(
        "agendamentoValor"
    );

    const formaPagamentoSelect = document.getElementById(
        "agendamentoFormaPagamento"
    );

    if (!camposPagamento) return;

    camposPagamento.classList.toggle(
        "hidden",
        !mostrarPagamento
    );

    /*
     * Quando o atendimento usa assinatura,
     * remove valores avulsos que possam ter sido digitados.
     */
    if (!mostrarPagamento) {
        if (valorInput) {
            valorInput.value = "";
        }

        if (formaPagamentoSelect) {
            formaPagamentoSelect.value = "";
        }
    }
}

async function salvarAgendamento() {
    const clienteId = document.getElementById(
        "agendamentoCliente"
    )?.value;

    const barbeiroId = document.getElementById(
        "agendamentoBarbeiro"
    )?.value;

    const assinaturaId = document.getElementById(
        "agendamentoAssinatura"
    )?.value;

    const data = document.getElementById(
        "agendamentoData"
    )?.value;

    const horario = document.getElementById(
        "agendamentoHorario"
    )?.value;

    const servico = document.getElementById(
        "agendamentoServico"
    )?.value;

    const observacoes = document
        .getElementById("agendamentoObservacoes")
        ?.value
        .trim();

    const valorServico = Number(
        document.getElementById("agendamentoValor")?.value
    );

    const formaPagamento = document.getElementById(
        "agendamentoFormaPagamento"
    )?.value;

    if (
        !clienteId ||
        !barbeiroId ||
        !data ||
        !horario ||
        !servico
    ) {
        alert(
            "Preencha cliente, barbeiro, data, horário e serviço."
        );
        return;
    }

    if (assinaturaId) {
        const assinaturaSelecionada =
            await buscarAssinaturaPorId(assinaturaId);

        if (!assinaturaSelecionada) {
            alert("A assinatura selecionada não foi encontrada.");
            return;
        }

        if (assinaturaSelecionada.cliente_id !== clienteId) {
            alert(
                "Esta assinatura não pertence ao cliente selecionado."
            );
            return;
        }

        if (assinaturaSelecionada.status !== "ativo") {
            alert(
                "A assinatura não está ativa. O atendimento deverá ser avulso."
            );

            document.getElementById(
                "agendamentoAssinatura"
            ).value = "";

            alternarCamposPagamentoAgendamento(true);
            return;
        }

        if (
            Number(assinaturaSelecionada.cortes_restantes) <= 0
        ) {
            alert(
                "O cliente já utilizou todos os cortes do plano. O atendimento deverá ser avulso."
            );

            document.getElementById(
                "agendamentoAssinatura"
            ).value = "";

            alternarCamposPagamentoAgendamento(true);
            return;
        }

        if (assinaturaSelecionada.data_vencimento) {
            const [ano, mes, dia] =
                assinaturaSelecionada.data_vencimento
                    .split("-")
                    .map(Number);

            const vencimento = new Date(ano, mes - 1, dia);
            vencimento.setHours(0, 0, 0, 0);

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (vencimento < hoje) {
                alert(
                    "A assinatura está vencida. O atendimento deverá ser avulso."
                );

                document.getElementById(
                    "agendamentoAssinatura"
                ).value = "";

                alternarCamposPagamentoAgendamento(true);
                return;
            }
        }
    }

    if (!assinaturaId) {
        if (!valorServico || valorServico <= 0) {
            alert("Informe o valor do atendimento avulso.");
            return;
        }

        if (!formaPagamento) {
            alert("Selecione a forma de pagamento.");
            return;
        }
    }

    const agendamento = {
        cliente_id: clienteId,
        barbeiro_id: barbeiroId,
        assinatura_id: assinaturaId || null,
        data,
        horario,
        servico,
        observacoes: observacoes || null,

        valor_servico: assinaturaId
            ? 0
            : valorServico,

        forma_pagamento: assinaturaId
            ? null
            : formaPagamento,

        status: "agendado"
    };

    console.log("Agendamento enviado:", agendamento);

    const resultado = await cadastrarAgendamento(agendamento);

    if (!resultado) {
        alert("Não foi possível salvar o agendamento.");
        return;
    }

    fecharModal();

    const filtroData = document.getElementById(
        "agendaData"
    );

    if (filtroData) {
        filtroData.value = data;
    }

    await atualizarAgenda();
}

async function atualizarAgenda() {
    const lista = document.getElementById("listaAgenda");
    const data = document.getElementById("agendaData")?.value;

    if (!lista || !data) return;

    lista.innerHTML = `
        <p class="empty-state">
            Carregando agenda...
        </p>
    `;

    const agendamentos = await listarAgendamentosPorData(data);

    atualizarResumoAgenda(agendamentos);

    if (agendamentos.length === 0) {
        lista.innerHTML = `
            <p class="empty-state">
                Nenhum agendamento para esta data.
            </p>
        `;

        return;
    }

    lista.innerHTML = agendamentos
        .map(agendamento => criarCardAgendamento(agendamento))
        .join("");
}

function atualizarResumoAgenda(agendamentos) {
    const agendados = agendamentos.filter(
        item =>
            item.status === "agendado" ||
            item.status === "confirmado" ||
            item.status === "em_atendimento"
    ).length;

    const concluidos = agendamentos.filter(
        item => item.status === "concluido"
    ).length;

    const cancelados = agendamentos.filter(
        item => item.status === "cancelado"
    ).length;

    const totalAgendados =
        document.getElementById("totalAgendados");

    const totalConcluidos =
        document.getElementById("totalConcluidos");

    const totalCancelados =
        document.getElementById("totalCancelados");

    if (totalAgendados) {
        totalAgendados.textContent = agendados;
    }

    if (totalConcluidos) {
        totalConcluidos.textContent = concluidos;
    }

    if (totalCancelados) {
        totalCancelados.textContent = cancelados;
    }
}

function criarCardAgendamento(agendamento) {
    const cliente = agendamento.clientes;
    const assinatura = agendamento.assinaturas;
    const barbeiro = agendamento.barbeiros;

    const horario = String(
        agendamento.horario
    ).slice(0, 5);

    return `
        <article class="agendamento-card status-${agendamento.status}">

            <div class="agendamento-horario">
                ${horario}
            </div>

            <div class="agendamento-cliente">
                <div class="agendamento-avatar">
                    ${cliente?.nome?.charAt(0).toUpperCase() || "?"}
                </div>

                <div>
                    <h3>
                        ${cliente?.nome || "Cliente não encontrado"}
                    </h3>

                    <span>
                        ${cliente?.telefone || "-"}
                    </span>
                </div>
            </div>

            <div class="agendamento-servico">
    <span>Serviço</span>
    <strong>${agendamento.servico}</strong>

    <small class="agendamento-barbeiro">
        <i class="fa-solid fa-user-tie"></i>
        ${barbeiro?.nome || "Barbeiro não informado"}
    </small>
</div>

            <div class="agendamento-plano">
                ${
                    assinatura
                        ? `
                            <span>Plano</span>

                            <strong>
                                ${assinatura.planos?.nome || "Plano"}
                            </strong>

                            <small>
                                ${assinatura.cortes_restantes}/
                                ${assinatura.cortes_totais} cortes
                            </small>
                        `
                        : `
                            <span>Pagamento</span>
                            <strong>Avulso</strong>
                        `
                }
            </div>

            <span class="agendamento-status ${agendamento.status}">
                ${formatarStatusAgendamento(agendamento.status)}
            </span>

            <div class="agendamento-actions">
                ${criarAcoesAgendamento(agendamento)}
            </div>

        </article>
    `;
}

function formatarStatusAgendamento(status) {
    const textos = {
        agendado: "Agendado",
        confirmado: "Confirmado",
        em_atendimento: "Em atendimento",
        concluido: "Concluído",
        cancelado: "Cancelado"
    };

    return textos[status] || status;
}

function criarAcoesAgendamento(agendamento) {
    if (agendamento.status === "agendado") {
        return `
            <button
                onclick="alterarStatusAgenda(
                    '${agendamento.id}',
                    'confirmado'
                )"
            >
                Confirmar
            </button>

            <button
                class="btn-danger-outline"
                onclick="alterarStatusAgenda(
                    '${agendamento.id}',
                    'cancelado'
                )"
            >
                Cancelar
            </button>
        `;
    }

    if (agendamento.status === "confirmado") {
        return `
            <button
                onclick="alterarStatusAgenda(
                    '${agendamento.id}',
                    'em_atendimento'
                )"
            >
                Iniciar
            </button>
        `;
    }

    if (agendamento.status === "em_atendimento") {
        return `
            <button
                onclick="concluirAtendimento(
                    '${agendamento.id}',
                    '${agendamento.assinatura_id || ""}'
                )"
            >
                Finalizar
            </button>
        `;
    }

    return "";
}

async function alterarStatusAgenda(id, status) {
    const sucesso = await atualizarStatusAgendamento(
        id,
        status
    );

    if (!sucesso) {
        alert("Não foi possível atualizar o agendamento.");
        return;
    }

    await atualizarAgenda();
}

async function concluirAtendimento(
    agendamentoId,
    assinaturaId
) {
    const confirmar = confirm(
        "Finalizar este atendimento?"
    );

    if (!confirmar) return;

    const agendamento = await buscarAgendamentoPorId(
        agendamentoId
    );

    if (!agendamento) {
        alert("Agendamento não encontrado.");
        return;
    }

    /*
     * Atendimento incluído em assinatura:
     * consome um corte.
     */
    if (assinaturaId) {
        const assinatura = await buscarAssinaturaPorId(
            assinaturaId
        );

        if (
            !assinatura ||
            Number(assinatura.cortes_restantes) <= 0
        ) {
            alert(
                "A assinatura não possui cortes disponíveis."
            );
            return;
        }

        const corteRegistrado = await registrarCorte(
            assinatura.id,
            Number(assinatura.cortes_restantes)
        );

        if (!corteRegistrado) {
            alert(
                "Não foi possível consumir o corte da assinatura."
            );
            return;
        }
    }

    /*
     * Atendimento avulso:
     * registra receita automaticamente.
     */
    if (!assinaturaId) {
        const valor = Number(
            agendamento.valor_servico
        );

        if (!valor || valor <= 0) {
            alert(
                "Este atendimento avulso não possui um valor informado."
            );
            return;
        }

        const receitaCriada = await registrarReceita({
            data: agendamento.data,
            categoria: "corte_avulso",
            descricao:
                `${agendamento.servico} - atendimento avulso`,
            valor,
            formaPagamento:
                agendamento.forma_pagamento,
            clienteId:
                agendamento.cliente_id,
            agendamentoId:
                agendamento.id
        });

        if (!receitaCriada) {
            alert(
                "Não foi possível registrar a receita do atendimento."
            );
            return;
        }
    }

    const statusAtualizado =
        await atualizarStatusAgendamento(
            agendamentoId,
            "concluido"
        );

    if (!statusAtualizado) {
        alert(
            "Não foi possível concluir o atendimento."
        );
        return;
    }

    await atualizarAgenda();
}