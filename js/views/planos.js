function carregarPlanos() {
    return `
        <section class="planos-page">

            <div class="page-header">
                <div>
                    <h2>Planos</h2>
                    <p>Gerencie os planos e assinaturas da sua barbearia.</p>
                </div>

                <button class="btn-primary" onclick="abrirFormularioPlano()">
                    <i class="fa-solid fa-plus"></i>
                    Novo Plano
                </button>
            </div>

            <div id="formPlano" class="form-card hidden">
                <h3>Novo Plano</h3>

                <input id="planoNome" placeholder="Nome do plano">
                <input id="planoDescricao" placeholder="Descrição">
                <input id="planoValor" type="number" step="0.01" placeholder="Valor mensal">
                <input id="planoCortes" type="number" placeholder="Quantidade de cortes">
                <input id="planoValidade" type="number" value="30" placeholder="Validade em dias">

                <div class="form-actions">
                    <button onclick="salvarPlano()">Salvar Plano</button>
                    <button class="btn-secondary" onclick="fecharFormularioPlano()">Cancelar</button>
                </div>
            </div>

            <div id="listaPlanos" class="planos-grid"></div>

        </section>
    `;
}

function abrirFormularioPlano() {
    document.getElementById("formPlano").classList.remove("hidden");
}

function fecharFormularioPlano() {
    document.getElementById("formPlano").classList.add("hidden");
    limparFormularioPlano();
}

function limparFormularioPlano() {
    document.getElementById("planoNome").value = "";
    document.getElementById("planoDescricao").value = "";
    document.getElementById("planoValor").value = "";
    document.getElementById("planoCortes").value = "";
    document.getElementById("planoValidade").value = "30";
}