(function () {
    "use strict";
    const auth = window.OctarianSupabase;

    function makeLink(text, href, className) {
        const link = document.createElement("a");
        link.textContent = text;
        link.href = href;
        link.className = className;
        return link;
    }

    function renderAccount(target, user) {
        const base = target.dataset.authBase || "";
        target.replaceChildren();
        if (user) {
            const profile = makeLink("Akun", base + "auth/profile.html", "btn btn-sm btn-outline-light");
            profile.setAttribute("aria-label", "Buka profil pengguna");
            const logout = document.createElement("button");
            logout.type = "button";
            logout.className = "btn btn-sm btn-danger";
            logout.textContent = "Keluar";
            logout.addEventListener("click", async function () {
                logout.disabled = true;
                await auth.client.auth.signOut();
                window.location.href = base + "index.html";
            });
            target.append(profile, logout);
            return;
        }
        target.append(
            makeLink("Masuk", base + "auth/login.html", "btn btn-sm btn-outline-light"),
            makeLink("Daftar", base + "auth/register.html", "btn btn-sm btn-danger")
        );
    }

    async function refreshAccount(target) {
        if (!auth || !auth.isConfigured()) {
            renderAccount(target, null);
            return;
        }
        // getUser() memvalidasi user ke Supabase; UI tidak mempercayai localStorage saja.
        const result = await auth.client.auth.getUser();
        renderAccount(target, result.data && result.data.user ? result.data.user : null);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const targets = document.querySelectorAll("[data-octarian-auth-nav]");
        targets.forEach(refreshAccount);
        if (auth && auth.isConfigured()) {
            auth.client.auth.onAuthStateChange(function () { targets.forEach(refreshAccount); });
        }
    });
}());
