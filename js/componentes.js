/*
 * Componentes reutilizáveis das páginas internas:
 * - Abas acessíveis: [role="tablist"] com botões [role="tab"][aria-controls]
 * - Sumário lateral que destaca a seção visível (.sumario a[href^="#"])
 */
(function () {
    // ---------- Abas ----------
    document.querySelectorAll('[role="tablist"]').forEach(lista => {
        const abas = [...lista.querySelectorAll('[role="tab"]')];
        const ativar = (aba, focar) => {
            abas.forEach(a => {
                const ativa = a === aba;
                a.setAttribute('aria-selected', ativa);
                a.tabIndex = ativa ? 0 : -1;
                document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
            });
            if (focar) aba.focus();
        };
        abas.forEach((aba, i) => {
            aba.addEventListener('click', () => ativar(aba));
            aba.addEventListener('keydown', (e) => {
                const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                if (passo) { e.preventDefault(); ativar(abas[(i + passo + abas.length) % abas.length], true); }
            });
        });
        ativar(abas.find(a => a.getAttribute('aria-selected') === 'true') || abas[0]);
    });

    // ---------- Sumário com seção ativa ----------
    const links = [...document.querySelectorAll('.sumario a[href^="#"]')];
    if (links.length && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entradas) => {
            entradas.forEach(en => {
                if (!en.isIntersecting) return;
                links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === '#' + en.target.id));
            });
        }, { rootMargin: '-30% 0px -60% 0px' });
        links.forEach(l => { const alvo = document.querySelector(l.getAttribute('href')); if (alvo) obs.observe(alvo); });
    }
})();
