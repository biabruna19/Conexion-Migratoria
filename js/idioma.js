/*
 * Idiomas do site: português (pt) e espanhol (es), com textos escritos à mão.
 *
 * Carregado no <head> para escolher o idioma antes de a página aparecer
 * (evita "piscar" no idioma errado). O HTML traz os dois idiomas lado a lado:
 *   <span lang="pt">Olá</span><span lang="es">Hola</span>
 * e o CSS mostra só o idioma ativo (html[data-idioma]).
 * Atributos usam data-pt-placeholder / data-es-placeholder (também aria-label, title, alt).
 */
(function () {
    const CHAVE = 'cm_idioma';
    const ATRIBUTOS = ['placeholder', 'aria-label', 'title', 'alt'];
    const ouvintes = [];

    function inicial() {
        const salvo = localStorage.getItem(CHAVE);
        if (salvo === 'pt' || salvo === 'es') return salvo;
        return (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'pt';
    }

    const raiz = document.documentElement;
    raiz.dataset.idioma = inicial();
    raiz.lang = raiz.dataset.idioma === 'es' ? 'es' : 'pt-BR';

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
        document.querySelectorAll('[data-idioma-botao]').forEach(b => {
            b.setAttribute('aria-pressed', b.dataset.idiomaBotao === idioma);
        });
    }

    window.I18N = {
        idioma: () => raiz.dataset.idioma,
        // t({ pt: '...', es: '...' }) devolve o texto no idioma ativo
        t: (textos) => textos[raiz.dataset.idioma] ?? textos.pt,
        definir(idioma) {
            if (idioma !== 'pt' && idioma !== 'es') return;
            localStorage.setItem(CHAVE, idioma);
            raiz.dataset.idioma = idioma;
            raiz.lang = idioma === 'es' ? 'es' : 'pt-BR';
            aplicar();
            ouvintes.forEach(fn => fn(idioma));
        },
        aoTrocar: (fn) => ouvintes.push(fn),
        aplicar,
    };

    document.addEventListener('DOMContentLoaded', () => aplicar());

    // Botões PT/ES (data-idioma-botao="pt" | "es") em qualquer página
    document.addEventListener('click', (e) => {
        const b = e.target.closest('[data-idioma-botao]');
        if (b) window.I18N.definir(b.dataset.idiomaBotao);
    });
})();
