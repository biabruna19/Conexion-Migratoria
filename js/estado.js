/*
 * Página de cada estado (pg-estados.html?uf=SP)
 * O conteúdo vem de data/estados.js (recuperado do banco original).
 */
(function () {
    const ESTADOS = window.ESTADOS || {};
    const uf = (new URLSearchParams(location.search).get('uf') || '').toUpperCase();
    const estado = ESTADOS[uf];
    const campo = (nome) => document.querySelector(`[data-campo="${nome}"]`);
    const REGIOES = {
        norte: { pt: 'Região Norte', es: 'Región Norte' },
        nordeste: { pt: 'Região Nordeste', es: 'Región Noreste' },
        'centro-oeste': { pt: 'Região Centro-Oeste', es: 'Región Centro-Oeste' },
        sudeste: { pt: 'Região Sudeste', es: 'Región Sureste' },
        sul: { pt: 'Região Sul', es: 'Región Sur' },
    };

    if (!estado) {
        document.getElementById('conteudo').innerHTML = `
            <section class="estado-vazio"><div>
                <span class="icone-redondo">${icone('mapa')}</span>
                <h1 style="font-size:2.4rem">${I18N.t({ pt: 'Estado não encontrado', es: 'Estado no encontrado' })}</h1>
                <p>${I18N.t({ pt: 'Escolha um estado no mapa interativo da página inicial.', es: 'Elige un estado en el mapa interactivo de la página de inicio.' })}</p>
                <a class="botao botao-primario" href="./index.html#mapa">${I18N.t({ pt: 'Voltar ao mapa', es: 'Volver al mapa' })}</a>
            </div></section>`;
        return;
    }

    const preencherLista = (el, itens, tag) => {
        el.innerHTML = '';
        itens.filter(Boolean).forEach(t => {
            const item = document.createElement(tag);
            item.textContent = t;
            el.appendChild(item);
        });
    };

    function textosIdioma() {
        const titulo = estado.titulo;
        document.title = `${titulo} · Conexión Migratoria`;
        campo('regiao').textContent = I18N.t(REGIOES[estado.regiao]);
        campo('resumo').textContent = I18N.t(estado.resumo);
    }

    // Topo
    campo('imagem').src = estado.imagem;
    campo('imagem').alt = estado.titulo;
    campo('titulo').textContent = estado.titulo;
    campo('titulo-trilha').textContent = estado.titulo;
    textosIdioma();
    I18N.aoTrocar(textosIdioma);

    // Cultura
    preencherLista(campo('cultura'), estado.cultura.textos, 'p');
    campo('imagemCultura').src = estado.cultura.imagem;
    campo('imagemCultura').alt = estado.titulo;

    // Pontos turísticos: lista à esquerda, destaque à direita
    const lista = campo('pontosLista');
    function mostrarPonto(i, focar) {
        const ponto = estado.pontosTuristicos[i];
        campo('pontoImagem').src = ponto.imagem;
        campo('pontoImagem').alt = ponto.nome;
        campo('pontoNome').textContent = ponto.nome;
        campo('pontoDescricao').textContent = ponto.descricao;
        lista.querySelectorAll('[role="tab"]').forEach((b, j) => {
            b.setAttribute('aria-selected', i === j);
            b.tabIndex = i === j ? 0 : -1;
            if (i === j && focar) b.focus();
        });
        const destaque = document.getElementById('pontoDestaque');
        destaque.style.animation = 'none';
        void destaque.offsetWidth;
        destaque.style.animation = 'aparecer .35s ease';
    }
    estado.pontosTuristicos.forEach((ponto, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ponto-botao';
        b.id = `imgponto${i + 1}`;
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-controls', 'pontoDestaque');
        b.innerHTML = `<img src="${ponto.imagem}" alt="" loading="lazy"><span></span>`;
        b.querySelector('span').textContent = ponto.nome;
        b.addEventListener('click', () => mostrarPonto(i));
        b.addEventListener('keydown', (e) => {
            const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
            if (passo) { e.preventDefault(); mostrarPonto((i + passo + 4) % 4, true); }
        });
        lista.appendChild(b);
    });
    mostrarPonto(0);

    // Saúde, ensino e cidades (as imagens reaproveitam fotos do próprio estado)
    preencherLista(campo('saude'), estado.saude, 'p');
    preencherLista(campo('ensino'), [estado.ensino.texto], 'p');
    preencherLista(campo('escolas'), estado.ensino.escolas, 'li');
    preencherLista(campo('cidades'), estado.cidades, 'li');
    campo('imagemSaude').src = estado.pontosTuristicos[1].imagem;
    campo('imagemEnsino').src = estado.pontosTuristicos[2].imagem;
    campo('imagemCidades').src = estado.pontosTuristicos[3].imagem;

    // Abas de mais informações
    const abas = [...document.querySelectorAll('#informacoes [role="tab"]')];
    abas.forEach((aba, i) => {
        aba.addEventListener('click', () => ativar(aba));
        aba.addEventListener('keydown', (e) => {
            const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (passo) { e.preventDefault(); ativar(abas[(i + passo + abas.length) % abas.length], true); }
        });
    });
    function ativar(aba, focar) {
        abas.forEach(a => {
            const ativa = a === aba;
            a.setAttribute('aria-selected', ativa);
            a.tabIndex = ativa ? 0 : -1;
            document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
        });
        if (focar) aba.focus();
    }
    ativar(abas[0]);

    // Ver outro estado
    const seletor = document.getElementById('outroEstado');
    Object.keys(ESTADOS)
        .sort((a, b) => ESTADOS[a].titulo.localeCompare(ESTADOS[b].titulo))
        .forEach(sigla => seletor.add(new Option(ESTADOS[sigla].titulo, sigla, false, sigla === uf)));
    seletor.addEventListener('change', () => { location.href = `./pg-estados.html?uf=${seletor.value}`; });
})();
