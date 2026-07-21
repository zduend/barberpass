function carregarBarbeiros() {
    return `
        <section class="barbeiros-page">

            <div class="page-header">
                <div>
                    <h2>Barbeiros</h2>
                    <p>Gerencie os profissionais da barbearia.</p>
                </div>

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirFormularioBarbeiro()"
                >
                    <i class="fa-solid fa-plus"></i>
                    Novo Barbeiro
                </button>
            </div>

            <div id="listaBarbeiros" class="barbeiros-grid">
                <p class="empty-state">Carregando barbeiros...</p>
            </div>

        </section>
    `;
}

function abrirFormularioBarbeiro() {
    abrirModal(
        barbeiroEditandoId
            ? "Editar Barbeiro"
            : "Novo Barbeiro",
        `
            <div class="barbeiro-form">

                <p class="modal-description">
                    ${
                        barbeiroEditandoId
                            ? "Atualize os dados do profissional."
                            : "Cadastre um novo profissional da barbearia."
                    }
                </p>

                <div class="form-group">
                    <label for="barbeiroNome">Nome</label>

                    <input
                        id="barbeiroNome"
                        type="text"
                        placeholder="Nome completo"
                    >
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="barbeiroTelefone">Telefone</label>

                        <input
                            id="barbeiroTelefone"
                            type="text"
                            placeholder="(61) 99999-9999"
                        >
                    </div>

                    <div class="form-group">
                        <label for="barbeiroEmail">E-mail</label>

                        <input
                            id="barbeiroEmail"
                            type="email"
                            placeholder="barbeiro@email.com"
                        >
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="barbeiroCargo">Cargo</label>

                        <select id="barbeiroCargo">
                            <option value="barbeiro">Barbeiro</option>
                            <option value="dono">Dono</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="barbeiroComissao">Comissão (%)</label>

                        <input
                            id="barbeiroComissao"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value="50"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="barbeiroStatus">Status</label>

                    <select id="barbeiroStatus">
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                <div class="form-actions barbeiro-form-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharFormularioBarbeiro()"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn-primary"
                        onclick="salvarBarbeiro()"
                    >
                        <i class="fa-solid fa-check"></i>

                        ${
                            barbeiroEditandoId
                                ? "Salvar alterações"
                                : "Salvar barbeiro"
                        }
                    </button>
                </div>

            </div>
        `
    );
}

function fecharFormularioBarbeiro() {
    barbeiroEditandoId = null;
    fecharModal();
}