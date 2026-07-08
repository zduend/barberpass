function atualizarTopbar(secao) {
    const titulo = document.getElementById("tituloPagina");
    const subtitulo = document.getElementById("subtituloPagina");

    if (!titulo || !subtitulo) return;

    const paginas = {
        dashboard: {
            titulo: "Dashboard",
            subtitulo: "Bem-vindo novamente 👋"
        },
        clientes: {
            titulo: "Clientes",
            subtitulo: "Gerencie seus clientes cadastrados"
        },
        planos: {
            titulo: "Planos",
            subtitulo: "Gerencie planos e assinaturas"
        },
        cortes: {
            titulo: "Cortes",
            subtitulo: "Histórico e serviços"
        },
        financeiro: {
            titulo: "Financeiro",
            subtitulo: "Controle receitas e despesas"
        },
        relatorios: {
            titulo: "Relatórios",
            subtitulo: "Indicadores da barbearia"
        },
        configuracoes: {
            titulo: "Configurações",
            subtitulo: "Personalize o sistema"
        }
    };

    const paginaAtual = paginas[secao] || paginas.dashboard;

    titulo.textContent = paginaAtual.titulo;
    subtitulo.textContent = paginaAtual.subtitulo;
}