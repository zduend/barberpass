function abrirModal(titulo, conteudo) {

    const modal = document.getElementById("globalModal");

    modal.querySelector(".modal-title").innerHTML = titulo;

    modal.querySelector(".modal-body").innerHTML = conteudo;

    modal.classList.add("show");
}

function fecharModal() {
    document.getElementById("globalModal")
        .classList.remove("show");
}