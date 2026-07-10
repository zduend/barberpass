function carregarAssinaturas() {
    return `
        <section class="assinaturas-page">

            <div class="page-header">
                <div>
                    <h2>Assinaturas</h2>
                    <p>Vincule clientes aos planos e acompanhe a utilização.</p>
                </div>

                <button class="btn-primary" onclick="abrirFormularioAssinatura()">
                    <i class="fa-solid fa-plus"></i>
                    Nova Assinatura
                </button>
            </div>

            <div id="listaAssinaturas" class="assinaturas-grid"></div>

        </section>
    `;
}

function abrirFormularioAssinatura() {
    abrirModal(
        "Nova Assinatura",
        `
            <div class="assinatura-form">

                <div class="form-group">
                    <label for="assinaturaCliente">Cliente</label>

                    <select id="assinaturaCliente">
                        <option value="">Carregando clientes...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="assinaturaPlano">Plano</label>

                    <select
                        id="assinaturaPlano"
                        onchange="preencherDadosPlanoAssinatura()"
                    >
                        <option value="">Carregando planos...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="assinaturaInicio">Data de início</label>

                    <input
                        id="assinaturaInicio"
                        type="date"
                        onchange="preencherDadosPlanoAssinatura()"
                    >
                </div>

                <div id="resumoPlanoAssinatura" class="assinatura-resumo hidden">
                    <div>
                        <span>Valor mensal</span>
                        <strong id="assinaturaResumoValor">R$ 0,00</strong>
                    </div>

                    <div>
                        <span>Cortes incluídos</span>
                        <strong id="assinaturaResumoCortes">0</strong>
                    </div>

                    <div>
                        <span>Validade</span>
                        <strong id="assinaturaResumoValidade">0 dias</strong>
                    </div>

                    <div>
                        <span>Vencimento</span>
                        <strong id="assinaturaResumoVencimento">-</strong>
                    </div>
                </div>

                <div class="form-actions assinatura-form-actions">
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
                        onclick="salvarAssinatura()"
                    >
                        <i class="fa-solid fa-check"></i>
                        Criar assinatura
                    </button>
                </div>

            </div>
        `
    );

    carregarSelectsAssinatura();
}

function calcularDataVencimento(dataInicio, dias) {
    if (!dataInicio) return "";

    const partes = dataInicio.split("-");

    const data = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

    data.setDate(data.getDate() + Number(dias));

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarDataAssinatura(data) {
    if (!data) return "-";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}