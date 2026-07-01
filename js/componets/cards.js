function criarCard(titulo, valor, descricao) {
    return `
        <div class="card">
            <p>${titulo}</p>
            <h2>${valor}</h2>
            <small>${descricao}</small>
        </div>
    `;
}