if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registro = await navigator.serviceWorker.register(
                "/service-worker.js"
            );

            console.log(
                "Service Worker registrado com sucesso:",
                registro.scope
            );
        } catch (error) {
            console.error(
                "Erro ao registrar o Service Worker:",
                error
            );
        }
    });
}