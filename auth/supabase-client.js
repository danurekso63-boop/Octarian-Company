(function () {
    "use strict";

    const config = window.OCTARIAN_SUPABASE_CONFIG || {};
    const missingConfig = !config.url || !config.publishableKey ||
        config.url.includes("YOUR_SUPABASE") || config.publishableKey.includes("YOUR_SUPABASE");
    let client = null;
    let configurationError = null;

    if (missingConfig) {
        configurationError = "Konfigurasi Supabase belum diisi.";
    } else if (!window.supabase || typeof window.supabase.createClient !== "function") {
        configurationError = "Library Supabase tidak dapat dimuat.";
    } else {
        client = window.supabase.createClient(config.url, config.publishableKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
    }

    window.OctarianSupabase = Object.freeze({
        client: client,
        isConfigured: function () { return Boolean(client); },
        configurationError: configurationError
    });
}());
