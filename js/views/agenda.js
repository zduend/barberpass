function carregarAgenda() {
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split("T")[0];

    return `
        <section class="agenda-page">

            <div class="page-header">
                <div>
                    <h2>Agenda</h2>
                    <p>Gerencie os horários e atendimentos da barbearia.</p>
                </div>

                <button class="btn-primary" onclick="abrirFormularioAgendamento()">
                    <i class="fa-solid fa-plus"></i>
                    Novo Agendamento
                </button>
            </div>

            <div class="agenda-toolbar">
                <div class="agenda-data-filtro">
                    <label for="agendaData">Data</label>

                    <input
                        id="agendaData"
                        type="date"
                        value="${dataHoje}"
                        onchange="atualizarAgenda()"
                    >
                </div>

                <div class="agenda-resumo">
                    <div>
                        <span>Agendados</span>
                        <strong id="totalAgendados">0</strong>
                    </div>

                    <div>
                        <span>Concluídos</span>
                        <strong id="totalConcluidos">0</strong>
                    </div>

                    <div>
                        <span>Cancelados</span>
                        <strong id="totalCancelados">0</strong>
                    </div>
                </div>
            </div>

            <div id="listaAgenda" class="agenda-lista-completa"></div>

        </section>
    `;
}

function abrirFormularioAgendamento() {
    abrirModal(
        "Novo Agendamento",
        `
            <div class="agendamento-form">

                <div class="form-group">
                    <label for="agendamentoCliente">Cliente</label>

                    <select
                        id="agendamentoCliente"
                        onchange="carregarAssinaturaDoCliente()"
                    >
                        <option value="">Carregando clientes...</option>
                    </select>
                </div>

<div class="form-group">

    <label for="agendamentoBarbeiro">
        Barbeiro
    </label>

    <select id="agendamentoBarbeiro">

        <option value="">
            Carregando barbeiros...
        </option>

    </select>

</div>

                <div class="form-group">
                    <label for="agendamentoAssinatura">Assinatura</label>

                    <select 
                    id="agendamentoAssinatura"
                         onchange="alternarCamposPagamentoAgendamento()"
                    >
                        <option value="">Sem assinatura</option>
                    </select>

                    <small id="mensagemAssinaturaAgenda" class="agenda-field-message"></small>
                </div>



                <div class="form-row">
                    <div class="form-group">
                        <label for="agendamentoData">Data</label>
                        <input id="agendamentoData" type="date">
                    </div>

                    <div class="form-group">
                        <label for="agendamentoHorario">Horário</label>
                        <input id="agendamentoHorario" type="time">
                    </div>
                </div>

                <div class="form-group">
                    <label for="agendamentoServico">Serviço</label>

                    <select id="agendamentoServico">
                        <option value="">Selecione um serviço</option>
                        <option value="Corte">Corte</option>
                        <option value="Barba">Barba</option>
                        <option value="Corte + Barba">Corte + Barba</option>
                        <option value="Pigmentação">Pigmentação</option>
                    </select>
                </div>

<div id="dadosPagamentoAvulso" class="form-row hidden">
    <div class="form-group">
        <label for="agendamentoValor">Valor do serviço</label>

        <input
            id="agendamentoValor"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex.: 45,00"
        >
    </div>

    <div class="form-group">
        <label for="agendamentoFormaPagamento">
            Forma de pagamento
        </label>

        <select id="agendamentoFormaPagamento">
            <option value="">Selecione</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">Pix</option>
            <option value="cartao_credito">Cartão de crédito</option>
            <option value="cartao_debito">Cartão de débito</option>
        </select>
    </div>
</div>

                <div class="form-group">
                    <label for="agendamentoObservacoes">Observações</label>

                    <textarea
                        id="agendamentoObservacoes"
                        rows="4"
                        placeholder="Observações do atendimento..."
                    ></textarea>
                </div>

                <div class="form-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharModal()"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn-primary"
                        onclick="salvarAgendamento()"
                    >
                        <i class="fa-solid fa-check"></i>
                        Salvar agendamento
                    </button>
                </div>

            </div>
        `
    );

    prepararFormularioAgendamento();
}