/*! coi-serviceworker v0.1.7 - MIT License - https://github.com/gzguidoti/coi-serviceworker */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", event => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
        }
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.status === 0) {
                        return response;
                    }
                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    });
                })
                .catch(error => console.error(error))
        );
    });
} else {
    (() => {
        if (window.crossOriginIsolated !== false) return;
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            // Localhost पर वैसे भी काम कर सकता है
        }
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register(window.location.pathname + window.location.search)
                .then(registration => {
                    registration.addEventListener("updatefound", () => {
                        window.location.reload();
                    });
                    if (registration.active && !navigator.serviceWorker.controller) {
                        window.location.reload();
                    }
                });
        }
    })();
}
