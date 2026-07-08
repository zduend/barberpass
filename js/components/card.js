function criarCard(config){

    return `
        <div class="stat-card">

            <div class="card-icon">
                <i class="${config.icone}"></i>
            </div>

            <div class="card-info">

                <span class="card-title">
                    ${config.titulo}
                </span>

                <h2>
                    ${config.valor}
                </h2>

                <small>
                    ${config.descricao}
                </small>

            </div>

        </div>
    `;

}