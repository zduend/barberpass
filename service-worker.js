const CACHE_NAME = "barberpass-v1";

const ARQUIVOS_ESTATICOS = [
    "/",
    "/index.html",
    "/login.html",
    "/admin.html",
    "/manifest.webmanifest",

    "/assets/icons/icon-192.png",
    "/assets/icons/icon-512.png"
];

/*
 * Instala o Service Worker e guarda os arquivos básicos.
 */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARQUIVOS_ESTATICOS))
    );
});

/*
 * Remove versões antigas do cache.
 */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(nomesCaches => {
            return Promise.all(
                nomesCaches
                    .filter(nome => nome !== CACHE_NAME)
                    .map(nome => caches.delete(nome))
            );
        })
    );
});

/*
 * Para páginas e arquivos do BarberPass:
 * tenta buscar a versão atualizada na internet.
 * Se não conseguir, procura no cache.
 */
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    /*
     * Não tenta armazenar chamadas externas ou do Supabase.
     */
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copiaResposta = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, copiaResposta);
                });

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});