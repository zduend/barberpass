function criarCard(icone, titulo, valor, descricao) {
    return `
        <div class="stat-card">
            <i class="${icone}"></i>
            <h2>${valor}</h2>
            <span>${titulo}</span>
            <small>${descricao}</small>
        </div>
    `;
}