/*
 * Componentes interativos usados nas páginas.
 * Cada um é ativado por um atributo no HTML, então dá para reaproveitar:
 *
 *  [data-saudacao]        palavra que troca sozinha ("Bem-vindo", "Bienvenido", "Welcome"...)
 *  [data-contar="27"]     número que conta de 0 até o valor quando aparece na tela
 *  [data-mosaico]         fotos dos estados que se revezam no topo da página inicial
 *  [data-checklist="id"]  lista de tarefas com progresso salvo no navegador
 *  .flashcard             cartão que vira ao clicar; [data-falar] lê a frase em voz alta
 *  [data-carrossel]       faixa com rolagem horizontal e setas
 *  [data-virar]           cartões de dica que viram ao clicar
 */
(function () {
    const t = (pt, es) => (window.I18N ? I18N.t({ pt, es }) : pt);
    const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const aoAparecer = (el, fn) => {
        if (!('IntersectionObserver' in window)) return fn();
        const obs = new IntersectionObserver((entradas) => {
            if (entradas.some(e => e.isIntersecting)) { obs.disconnect(); fn(); }
        }, { threshold: 0.4 });
        obs.observe(el);
    };

    // ---------- Saudação em vários idiomas ----------
    document.querySelectorAll('[data-saudacao]').forEach(el => {
        const palavras = el.dataset.saudacao.split('|');
        let i = 0;
        if (reduzirMovimento) return;
        setInterval(() => {
            el.classList.add('saindo');
            setTimeout(() => {
                i = (i + 1) % palavras.length;
                el.textContent = palavras[i];
                el.classList.remove('saindo');
            }, 350);
        }, 2200);
    });

    // ---------- Contadores ----------
    document.querySelectorAll('[data-contar]').forEach(el => {
        const alvo = +el.dataset.contar;
        el.textContent = reduzirMovimento ? alvo : '0';
        if (reduzirMovimento) return;
        aoAparecer(el, () => {
            const inicio = performance.now();
            const passo = (agora) => {
                const p = Math.min(1, (agora - inicio) / 1200);
                el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(passo);
            };
            requestAnimationFrame(passo);
        });
    });

    // ---------- Mosaico de estados que se revezam ----------
    document.querySelectorAll('[data-mosaico]').forEach(mosaico => {
        const ESTADOS = window.ESTADOS || {};
        const ordem = mosaico.dataset.mosaico.split(',').filter(uf => ESTADOS[uf]);
        const quadros = [...mosaico.querySelectorAll('figure')];
        if (!ordem.length || !quadros.length) return;
        let proximo = quadros.length;
        const mostrar = (fig, uf) => {
            const e = ESTADOS[uf];
            const img = fig.querySelector('img');
            const link = fig.querySelector('a');
            fig.classList.add('trocando');
            setTimeout(() => {
                img.src = e.imagem;
                img.alt = e.titulo;
                link.href = `./pg-estados.html?uf=${uf}`;
                link.querySelector('span').textContent = e.titulo;
                img.onload = () => fig.classList.remove('trocando');
            }, 450);
        };
        quadros.forEach((fig, i) => mostrar(fig, ordem[i % ordem.length]));
        if (reduzirMovimento) return;
        let q = 0;
        setInterval(() => {
            if (document.hidden) return;
            mostrar(quadros[q], ordem[proximo % ordem.length]);
            proximo++;
            q = (q + 1) % quadros.length;
        }, 3200);
    });

    // ---------- Checklists com progresso ----------
    document.querySelectorAll('[data-checklist]').forEach(lista => {
        const chave = 'cm_check_' + lista.dataset.checklist;
        const caixas = [...lista.querySelectorAll('input[type="checkbox"]')];
        const salvo = new Set(JSON.parse(localStorage.getItem(chave) || '[]'));
        const barra = document.querySelector(`[data-progresso="${lista.dataset.checklist}"]`);
        const atualizar = (comemorar) => {
            const feitos = caixas.filter(c => c.checked).length;
            localStorage.setItem(chave, JSON.stringify(caixas.filter(c => c.checked).map(c => c.value)));
            caixas.forEach(c => c.closest('.item-check, .documento')?.classList.toggle('feito', c.checked));
            if (!barra) return;
            const pct = Math.round((feitos / caixas.length) * 100);
            barra.style.setProperty('--progresso', pct + '%');
            barra.querySelector('[data-feitos]').textContent = feitos;
            barra.querySelector('[data-total]').textContent = caixas.length;
            barra.classList.toggle('completo', feitos === caixas.length);
            if (comemorar && feitos === caixas.length) confete(barra);
        };
        caixas.forEach(c => {
            c.checked = salvo.has(c.value);
            c.addEventListener('change', () => atualizar(true));
        });
        atualizar(false);
    });

    function confete(origem) {
        if (reduzirMovimento) return;
        const caixa = origem.getBoundingClientRect();
        const cores = ['#1AAADF', '#0E5C79', '#053344', '#7FD3F2', '#FFFFFF'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('span');
            p.className = 'confete';
            p.style.left = (caixa.left + caixa.width / 2) + 'px';
            p.style.top = (caixa.top + scrollY) + 'px';
            p.style.background = cores[i % cores.length];
            p.style.setProperty('--dx', (Math.random() * 360 - 180) + 'px');
            p.style.setProperty('--dy', (-Math.random() * 220 - 60) + 'px');
            p.style.setProperty('--giro', (Math.random() * 720) + 'deg');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1300);
        }
    }

    // ---------- Flashcards com áudio ----------
    const vozDisponivel = 'speechSynthesis' in window;
    document.querySelectorAll('.flashcard').forEach(card => {
        card.setAttribute('aria-pressed', 'false');
        const virar = () => {
            const virado = card.classList.toggle('virado');
            card.setAttribute('aria-pressed', virado);
        };
        card.addEventListener('click', (e) => { if (!e.target.closest('[data-falar]')) virar(); });
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-falar]')) { e.preventDefault(); virar(); }
        });
    });
    document.querySelectorAll('[data-falar]').forEach(botao => {
        if (!vozDisponivel) { botao.hidden = true; return; }
        botao.addEventListener('click', (e) => {
            e.stopPropagation();
            speechSynthesis.cancel();
            const fala = new SpeechSynthesisUtterance(botao.dataset.falar);
            fala.lang = botao.dataset.idiomaFala || 'pt-BR';
            fala.rate = 0.9;
            const vozes = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').startsWith(fala.lang.slice(0, 2)));
            if (vozes.length) fala.voice = vozes.find(v => v.lang.replace('_', '-') === fala.lang) || vozes[0];
            botao.classList.add('falando');
            fala.onend = fala.onerror = () => botao.classList.remove('falando');
            speechSynthesis.speak(fala);
        });
    });

    // ---------- Carrossel horizontal ----------
    document.querySelectorAll('[data-carrossel]').forEach(bloco => {
        const trilho = bloco.querySelector('.carrossel-trilho');
        const [ant, prox] = bloco.querySelectorAll('.carrossel-seta');
        const passo = () => trilho.clientWidth * 0.8;
        const atualizar = () => {
            ant.disabled = trilho.scrollLeft < 8;
            prox.disabled = trilho.scrollLeft + trilho.clientWidth > trilho.scrollWidth - 8;
        };
        ant.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
        prox.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
        trilho.addEventListener('scroll', atualizar, { passive: true });
        addEventListener('resize', atualizar);
        atualizar();
    });

    // ---------- Cartões de dica que viram ----------
    document.querySelectorAll('[data-virar]').forEach(card => {
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        const virar = () => card.setAttribute('aria-pressed', card.classList.toggle('virado'));
        card.addEventListener('click', virar);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); virar(); } });
    });

    // ---------- "Ler mais" em textos longos ----------
    // [data-ler-mais="3"]: mostra só 3 linhas e um botão para expandir
    document.querySelectorAll('[data-ler-mais]').forEach(el => {
        el.style.setProperty('--linhas', el.dataset.lerMais || 3);
        el.classList.add('texto-recolhido');
        if (el.scrollHeight <= el.clientHeight + 4) { el.classList.remove('texto-recolhido'); return; }
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'ler-mais';
        const rotulo = () => { botao.textContent = el.classList.contains('texto-recolhido') ? t('Ler mais', 'Leer más') : t('Ler menos', 'Leer menos'); };
        botao.addEventListener('click', () => { el.classList.toggle('texto-recolhido'); botao.setAttribute('aria-expanded', !el.classList.contains('texto-recolhido')); rotulo(); });
        botao.setAttribute('aria-expanded', 'false');
        rotulo();
        if (window.I18N) I18N.aoTrocar(rotulo);
        el.after(botao);
    });

    window.CMInteracoes = { confete, t };
})();
