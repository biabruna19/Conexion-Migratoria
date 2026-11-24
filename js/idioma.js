/*
 * Idiomas do site
 *
 * - Português (pt) e espanhol (es) têm textos escritos à mão. O HTML traz os
 *   dois lado a lado (<span lang="pt">…</span><span lang="es">…</span>) e o
 *   CSS mostra só o idioma ativo (html[data-idioma]).
 * - Os outros idiomas do globo usam o Tradutor do Google, a partir do português.
 *
 * Carregado no <head> para escolher o idioma antes de a página aparecer.
 * Atributos usam data-pt-placeholder / data-es-placeholder (também aria-label, title, alt).
 * O seletor (globo) é montado em qualquer elemento com [data-seletor-idioma].
 */
(function () {
    const CHAVE = 'cm_idioma';
    const ATRIBUTOS = ['placeholder', 'aria-label', 'title', 'alt'];
    const ouvintes = [];

    // Idiomas do globo: nomes em português (ou em espanhol, quando o site está em espanhol)
    const IDIOMAS = [
        { cod: 'pt', pt: 'Português', es: 'Portugués', sigla: 'PT' },
        { cod: 'es', pt: 'Espanhol', es: 'Español', sigla: 'ES' },
        { cod: 'en', pt: 'Inglês', es: 'Inglés', sigla: 'EN' },
        { cod: 'fr', pt: 'Francês', es: 'Francés', sigla: 'FR' },
        { cod: 'ht', pt: 'Crioulo haitiano', es: 'Criollo haitiano', sigla: 'HT' },
        { cod: 'ar', pt: 'Árabe', es: 'Árabe', sigla: 'AR' },
        { cod: 'fa', pt: 'Persa', es: 'Persa', sigla: 'FA' },
        { cod: 'ru', pt: 'Russo', es: 'Ruso', sigla: 'RU' },
        { cod: 'uk', pt: 'Ucraniano', es: 'Ucraniano', sigla: 'UK' },
        { cod: 'zh-CN', pt: 'Chinês', es: 'Chino', sigla: 'ZH' },
        { cod: 'hi', pt: 'Hindi', es: 'Hindi', sigla: 'HI' },
        { cod: 'it', pt: 'Italiano', es: 'Italiano', sigla: 'IT' },
        { cod: 'de', pt: 'Alemão', es: 'Alemán', sigla: 'DE' },
        { cod: 'tr', pt: 'Turco', es: 'Turco', sigla: 'TR' },
        { cod: 'sw', pt: 'Suaíli', es: 'Suajili', sigla: 'SW' },
        { cod: 'ln', pt: 'Lingala', es: 'Lingala', sigla: 'LN' },
        { cod: 'qu', pt: 'Quíchua', es: 'Quechua', sigla: 'QU' },
        { cod: 'gn', pt: 'Guarani', es: 'Guaraní', sigla: 'GN' },
    ];
    const MANUAIS = ['pt', 'es'];
    const raiz = document.documentElement;

    // ---------- Escolha inicial ----------
    function escolhaSalva() {
        const salvo = localStorage.getItem(CHAVE);
        if (IDIOMAS.some(i => i.cod === salvo)) return salvo;
        const nav = (navigator.language || 'pt').toLowerCase();
        if (nav.startsWith('es')) return 'es';
        return 'pt';
    }
    const escolha = escolhaSalva();
    let escolhaAtual = escolha; // muda sem recarregar só entre PT e ES
    const automatico = !MANUAIS.includes(escolha);
    raiz.dataset.idioma = automatico ? 'pt' : escolha; // a tradução automática parte do português
    // Na tradução automática a página continua marcada como português:
    // o tradutor do Google lê esse atributo para saber de qual língua traduzir.
    raiz.lang = escolha === 'es' ? 'es' : 'pt-BR';
    if (automatico) raiz.classList.add('traducao-automatica');

    // ---------- Tradutor do Google (idiomas que não são PT/ES) ----------
    function cookieTraducao(cod) {
        const dominios = ['', `; domain=${location.hostname}`, `; domain=.${location.hostname}`];
        dominios.forEach(d => {
            document.cookie = cod
                ? `googtrans=/pt/${cod}; path=/${d}`
                : `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
        });
    }
    if (automatico) {
        cookieTraducao(escolha);
        window.cmIniciarTradutor = function () {
            new google.translate.TranslateElement({ pageLanguage: 'pt', autoDisplay: false }, 'cm-tradutor');
            // Além do cookie, escolhe o idioma na caixa do próprio tradutor
            let tentativas = 0;
            const escolherNaCaixa = setInterval(() => {
                const caixa = document.querySelector('select.goog-te-combo');
                if (caixa && caixa.options.length > 1) {
                    clearInterval(escolherNaCaixa);
                    if (caixa.value !== escolha) {
                        caixa.value = escolha;
                        caixa.dispatchEvent(new Event('change'));
                    }
                } else if (++tentativas > 40) {
                    clearInterval(escolherNaCaixa);
                }
            }, 250);
        };
        document.addEventListener('DOMContentLoaded', () => {
            const caixa = document.createElement('div');
            caixa.id = 'cm-tradutor';
            caixa.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
            document.body.appendChild(caixa);
            const s = document.createElement('script');
            s.src = 'https://translate.google.com/translate_a/element.js?cb=cmIniciarTradutor';
            s.onerror = avisarFalha;
            document.body.appendChild(s);
            // Se em 10 segundos o tradutor não aparecer, avisa a pessoa
            setTimeout(() => { if (!document.querySelector('select.goog-te-combo')) avisarFalha(); }, 10000);
        });
    }
    function avisarFalha() {
        if (document.getElementById('cm-aviso-traducao')) return;
        const aviso = document.createElement('div');
        aviso.id = 'cm-aviso-traducao';
        aviso.className = 'aviso-traducao notranslate';
        aviso.setAttribute('role', 'alert');
        aviso.innerHTML = `<span>Não foi possível carregar a tradução automática. Verifique a conexão ou escolha Português ou Espanhol.<br><small>Automatic translation could not be loaded.</small></span>
            <button type="button" class="voltar-pt">Português</button>
            <button type="button" class="fechar-aviso" aria-label="Fechar">✕</button>`;
        aviso.querySelector('.voltar-pt').addEventListener('click', () => window.I18N.definir('pt'));
        aviso.querySelector('.fechar-aviso').addEventListener('click', () => aviso.remove());
        document.body.appendChild(aviso);
    }
    if (!automatico && document.cookie.includes('googtrans=')) {
        cookieTraducao(null);
    }

    // ---------- Aplicar textos e atributos ----------
    function aplicar(escopo) {
        const idioma = raiz.dataset.idioma;
        (escopo || document).querySelectorAll(ATRIBUTOS.map(a => `[data-${idioma}-${a}]`).join(',')).forEach(el => {
            ATRIBUTOS.forEach(a => {
                const v = el.getAttribute(`data-${idioma}-${a}`);
                if (v !== null) el.setAttribute(a, v);
            });
        });
        const titulo = raiz.getAttribute(`data-titulo-${idioma}`);
        if (titulo) document.title = titulo;
        atualizarSeletores();
    }

    // ---------- Globo de idiomas ----------
    const ICONE_GLOBO = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>';
    let contador = 0;

    function montarSeletor(alvo) {
        const id = 'cm-idiomas-' + (++contador);
        alvo.classList.add('globo', 'notranslate');
        alvo.setAttribute('translate', 'no');
        alvo.innerHTML = `
            <button type="button" class="globo-botao" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}" title="Idioma · Language · Langue">
                ${ICONE_GLOBO}<span class="globo-sigla"></span>
            </button>
            <ul class="globo-lista" id="${id}" role="listbox" aria-label="Idioma · Language" hidden>
                ${IDIOMAS.map(i => `<li role="option" tabindex="-1" data-cod="${i.cod}" aria-selected="false">
                    <span class="globo-nome">${i.pt}</span>${MANUAIS.includes(i.cod) ? '' : '<small>auto</small>'}
                </li>`).join('')}
            </ul>`;
        const botao = alvo.querySelector('.globo-botao');
        const lista = alvo.querySelector('.globo-lista');
        const itens = [...lista.querySelectorAll('li')];
        const abrir = (sim) => {
            lista.hidden = !sim;
            botao.setAttribute('aria-expanded', sim);
            if (sim) (itens.find(li => li.getAttribute('aria-selected') === 'true') || itens[0]).focus();
        };
        botao.addEventListener('click', (e) => { e.stopPropagation(); abrir(lista.hidden); });
        lista.addEventListener('click', (e) => {
            const li = e.target.closest('li[data-cod]');
            if (li) { abrir(false); window.I18N.definir(li.dataset.cod); }
        });
        lista.addEventListener('keydown', (e) => {
            const i = itens.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); itens[(i + 1) % itens.length].focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); itens[(i - 1 + itens.length) % itens.length].focus(); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); }
            else if (e.key === 'Escape') { abrir(false); botao.focus(); }
        });
        document.addEventListener('click', (e) => { if (!alvo.contains(e.target)) abrir(false); });
        atualizarSeletores();
    }

    function atualizarSeletores() {
        const atual = IDIOMAS.find(i => i.cod === escolhaAtual) || IDIOMAS[0];
        document.querySelectorAll('.globo').forEach(g => {
            const sigla = g.querySelector('.globo-sigla');
            if (sigla) sigla.textContent = atual.sigla;
            g.querySelectorAll('li[data-cod]').forEach(li => {
                li.setAttribute('aria-selected', li.dataset.cod === escolhaAtual);
                const idioma = IDIOMAS.find(i => i.cod === li.dataset.cod);
                li.querySelector('.globo-nome').textContent = raiz.dataset.idioma === 'es' ? idioma.es : idioma.pt;
            });
        });
    }

    window.I18N = {
        idioma: () => raiz.dataset.idioma,   // 'pt' ou 'es' (textos escritos à mão)
        escolha: () => escolhaAtual,         // qualquer idioma do globo
        idiomas: IDIOMAS,
        // t({ pt: '...', es: '...' }) devolve o texto no idioma ativo
        t: (textos) => textos[raiz.dataset.idioma] ?? textos.pt,
        definir(cod) {
            if (!IDIOMAS.some(i => i.cod === cod) || cod === escolhaAtual) return;
            localStorage.setItem(CHAVE, cod);
            // Entrar ou sair da tradução automática exige recarregar a página
            if (automatico || !MANUAIS.includes(cod)) {
                cookieTraducao(MANUAIS.includes(cod) ? null : cod);
                location.reload();
                return;
            }
            escolhaAtual = cod;
            raiz.dataset.idioma = cod;
            raiz.lang = cod === 'es' ? 'es' : 'pt-BR';
            aplicar();
            ouvintes.forEach(fn => fn(cod));
        },
        aoTrocar: (fn) => ouvintes.push(fn),
        aplicar,
        montarSeletor,
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-seletor-idioma]').forEach(montarSeletor);
        aplicar();
    });
})();
