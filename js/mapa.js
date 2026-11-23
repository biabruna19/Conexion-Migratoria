/*
 * Mapa interativo do Brasil
 * - passar o mouse mostra o nome do estado
 * - clicar (ou Enter/Espaço) mostra o resumo do estado no painel ao lado
 * - busca por nome ou sigla (sem precisar de acento) e filtro por região
 * - "Ver mais sobre este estado" leva para pg-estados.html?uf=XX
 */
(function () {
    const ESTADOS = window.ESTADOS || {};
    const caixa = document.getElementById('mapaSvg');
    const caminhos = [...caixa.querySelectorAll('path[data-uf]')];
    const tooltip = document.getElementById('tooltip');
    const painel = document.getElementById('painelEstado');
    const busca = document.getElementById('buscaEstado');
    const lista = document.getElementById('sugestoes');
    const combobox = busca.closest('[role="combobox"]');

    const REGIOES = {
        norte: { pt: 'Região Norte', es: 'Región Norte' },
        nordeste: { pt: 'Região Nordeste', es: 'Región Noreste' },
        'centro-oeste': { pt: 'Região Centro-Oeste', es: 'Región Centro-Oeste' },
        sudeste: { pt: 'Região Sudeste', es: 'Región Sureste' },
        sul: { pt: 'Região Sul', es: 'Región Sur' },
    };
    const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    let selecionado = 'SP';

    // ---------- Painel ----------
    function mostrarPainel(uf) {
        const e = ESTADOS[uf];
        if (!e) return;
        painel.classList.remove('trocando');
        void painel.offsetWidth; // reinicia a animação
        painel.classList.add('trocando');
        document.getElementById('painelImagem').src = e.imagem;
        document.getElementById('painelImagem').alt = e.titulo;
        document.getElementById('painelRegiao').textContent = I18N.t(REGIOES[e.regiao]);
        document.getElementById('painelNome').textContent = e.titulo;
        document.getElementById('painelResumo').textContent = I18N.t(e.resumo);
        document.getElementById('painelLink').href = `./pg-estados.html?uf=${uf}`;
    }

    function selecionar(uf, rolar) {
        if (!ESTADOS[uf]) return;
        selecionado = uf;
        caminhos.forEach(p => {
            const ativo = p.dataset.uf === uf;
            p.classList.toggle('selecionado', ativo);
            p.setAttribute('aria-pressed', ativo);
        });
        mostrarPainel(uf);
        if (rolar && innerWidth <= 900) painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- Estados no mapa ----------
    caminhos.forEach(p => {
        const uf = p.dataset.uf;
        const nome = ESTADOS[uf]?.titulo || uf;
        p.setAttribute('tabindex', '0');
        p.setAttribute('role', 'button');
        p.setAttribute('aria-label', nome);
        p.addEventListener('click', () => selecionar(uf, true));
        p.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selecionar(uf, true); }
        });
        p.addEventListener('mouseenter', () => {
            tooltip.textContent = `${nome} · ${uf}`;
            tooltip.classList.add('ativo');
        });
        p.addEventListener('mouseleave', () => tooltip.classList.remove('ativo'));
    });
    caixa.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = e.pageY + 'px';
    });
    // O tooltip usa coordenadas da página: precisa estar no <body>
    document.body.appendChild(tooltip);

    // ---------- Filtro por região ----------
    const botoesRegiao = document.querySelectorAll('.regioes button[data-regiao]');
    botoesRegiao.forEach(b => b.addEventListener('click', () => {
        const regiao = b.dataset.regiao;
        botoesRegiao.forEach(x => x.setAttribute('aria-pressed', x === b));
        caixa.classList.toggle('filtrando', !!regiao);
        caminhos.forEach(p => p.classList.toggle('na-regiao', p.dataset.regiao === regiao));
        // Se o estado atual não é da região, seleciona o primeiro da região
        if (regiao && ESTADOS[selecionado].regiao !== regiao) {
            const primeiro = Object.keys(ESTADOS).filter(uf => ESTADOS[uf].regiao === regiao)
                .sort((a, b) => ESTADOS[a].titulo.localeCompare(ESTADOS[b].titulo))[0];
            selecionar(primeiro, false);
        }
    }));

    // ---------- Busca ----------
    const todos = Object.keys(ESTADOS)
        .map(uf => ({ uf, nome: ESTADOS[uf].titulo, chave: semAcento(ESTADOS[uf].titulo) }))
        .sort((a, b) => a.nome.localeCompare(b.nome));
    let resultados = [];
    let ativo = -1;

    function abrirLista(aberta) {
        lista.hidden = !aberta;
        combobox.setAttribute('aria-expanded', aberta);
    }

    function desenharLista() {
        const termo = semAcento(busca.value.trim());
        if (!termo) { abrirLista(false); return; }
        resultados = todos.filter(e => e.chave.includes(termo) || e.uf.toLowerCase() === termo);
        ativo = resultados.length ? 0 : -1;
        lista.innerHTML = resultados.length
            ? resultados.map((e, i) => `<li role="option" id="op-${e.uf}" data-uf="${e.uf}" aria-selected="${i === ativo}">${e.nome}<span>${e.uf}</span></li>`).join('')
            : `<li class="vazio" role="option" aria-disabled="true">${I18N.t({ pt: 'Nenhum estado encontrado', es: 'Ningún estado encontrado' })}</li>`;
        busca.setAttribute('aria-activedescendant', ativo >= 0 ? `op-${resultados[ativo].uf}` : '');
        abrirLista(true);
    }

    function marcar(i) {
        ativo = i;
        lista.querySelectorAll('[data-uf]').forEach((li, j) => li.setAttribute('aria-selected', j === i));
        if (resultados[i]) {
            busca.setAttribute('aria-activedescendant', `op-${resultados[i].uf}`);
            lista.children[i].scrollIntoView({ block: 'nearest' });
        }
    }

    function escolher(uf) {
        busca.value = ESTADOS[uf].titulo;
        abrirLista(false);
        // Limpa o filtro de região, se houver, para o estado aparecer
        document.querySelector('.regioes button[data-regiao=""]').click();
        selecionar(uf, true);
    }

    busca.addEventListener('input', desenharLista);
    busca.addEventListener('focus', () => busca.value && desenharLista());
    busca.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && resultados.length) { e.preventDefault(); marcar((ativo + 1) % resultados.length); }
        else if (e.key === 'ArrowUp' && resultados.length) { e.preventDefault(); marcar((ativo - 1 + resultados.length) % resultados.length); }
        else if (e.key === 'Enter' && resultados[ativo]) { e.preventDefault(); escolher(resultados[ativo].uf); }
        else if (e.key === 'Escape') { abrirLista(false); }
    });
    lista.addEventListener('mousedown', (e) => {
        const li = e.target.closest('[data-uf]');
        if (li) { e.preventDefault(); escolher(li.dataset.uf); }
    });
    busca.addEventListener('blur', () => setTimeout(() => abrirLista(false), 100));

    // "Me surpreenda": escolhe um estado aleatório
    const surpresa = document.getElementById('estadoSurpresa');
    if (surpresa) surpresa.addEventListener('click', () => {
        const opcoes = Object.keys(ESTADOS).filter(uf => uf !== selecionado);
        const uf = opcoes[Math.floor(Math.random() * opcoes.length)];
        document.querySelector('.regioes button[data-regiao=""]').click();
        selecionar(uf, true);
        const p = caixa.querySelector(`path[data-uf="${uf}"]`);
        p.classList.remove('pulso'); void p.getBoundingClientRect(); p.classList.add('pulso');
    });

    // Troca de idioma atualiza o painel
    I18N.aoTrocar(() => { mostrarPainel(selecionado); if (!lista.hidden) desenharLista(); });

    // São Paulo aparece selecionado ao abrir a página (como no original)
    selecionar('SP', false);
})();
