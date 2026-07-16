function carregarPlanos() {
    return `
        <section class="planos-page">

            <div class="page-header">
                <div>
                    <h2>Planos</h2>
                    <p>Gerencie os planos e assinaturas da sua barbearia.</p>
                </div>

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirFormularioPlano()"
                >
                    <i class="fa-solid fa-plus"></i>
                    Novo Plano
                </button>
            </div>

            <div id="listaPlanos" class="planos-grid"></div>

        </section>
    `;
}

function abrirFormularioPlano() {
    abrirModal(
        planoEditandoId
            ? "Editar Plano"
            : "Novo Plano",
        `
            <div class="plano-form">

                <p class="modal-description">
                    ${
                        planoEditandoId
                            ? "Atualize as informações deste plano."
                            : "Crie um novo plano de assinatura para seus clientes."
                    }
                </p>

                <div class="form-group">
                    <label for="planoNome">Nome do plano</label>

                    <input
                        id="planoNome"
                        type="text"
                        placeholder="Ex.: Plano Premium"
                    >
                </div>

                <div class="form-group">
                    <label for="planoDescricao">Descrição</label>

                    <textarea
                        id="planoDescricao"
                        rows="3"
                        placeholder="Descreva os benefícios do plano..."
                    ></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="planoValor">Valor mensal</label>

                        <input
                            id="planoValor"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex.: 89,90"
                        >
                    </div>

                    <div class="form-group">
                        <label for="planoCortes">Quantidade de cortes</label>

                        <input
                            id="planoCortes"
                            type="number"
                            min="1"
                            placeholder="Ex.: 4"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="planoValidade">Validade em dias</label>

                    <input
                        id="planoValidade"
                        type="number"
                        min="1"
                        value="30"
                        placeholder="Ex.: 30"
                    >
                </div>

                <div class="form-actions plano-form-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharFormularioPlano()"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn-primary"
                        onclick="salvarPlano()"
                    >
                        <i class="fa-solid fa-check"></i>

                        ${
                            planoEditandoId
                                ? "Salvar alterações"
                                : "Salvar plano"
                        }
                    </button>
                </div>

            </div>
        `
    );
}

function fecharFormularioPlano() {
    planoEditandoId = null;
    fecharModal();
}

function limparFormularioPlano() {
    const campos = [
        "planoNome",
        "planoDescricao",
        "planoValor",
        "planoCortes"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });

    const validade = document.getElementById("planoValidade");

    if (validade) {
        validade.value = "30";
    }
}