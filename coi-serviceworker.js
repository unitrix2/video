/*! coi-serviceworker v0.1.7 - Research Optimized for GitHub Pages */
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
                    if (response.status === 0) return response;
                    
                    // सुरक्षा हेडर्स को जबरन इंजेक्ट करना जो SharedArrayBuffer अनलॉक करते हैं
                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    });
                })
                .catch(err => console.error("ServiceWorker Fetch Error:", err))
        );
    });
} else {
    (() => {
        // अगर ब्राउज़र पहले से ही आइसोलेटेड है, तो कुछ न करें
        if (window.crossOriginIsolated) return;

        if (navigator.serviceWorker) {
            navigator.serviceWorker.register(window.location.pathname)
                .then(registration => {
                    // नया अपडेट मिलने पर तुरंत रीलोड करें
                    registration.addEventListener("updatefound", () => {
                        window.location.reload();
                    });
                    if (registration.active && !navigator.serviceWorker.controller) {
                        window.location.reload();
                    }
                }).catch(err => console.error("SW Registration Failed:", err));
        }
    })();
}
