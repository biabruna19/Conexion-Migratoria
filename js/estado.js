/*
 * Página de cada estado (pg-estados.html?uf=SP)
 * O conteúdo vem de data/estados.js (recuperado do banco original).
 */
(function () {
    const ESTADOS = window.ESTADOS || {};
    const uf = (new URLSearchParams(location.search).get('uf') || '').toUpperCase();
    const estado = ESTADOS[uf];
    const campo = (nome) => document.querySelector(`[data-campo="${nome}"]`);
    const t = (pt, es) => I18N.t({ pt, es });
    const REGIOES = {
        norte: { pt: 'Região Norte', es: 'Región Norte' },
        nordeste: { pt: 'Região Nordeste', es: 'Región Noreste' },
        'centro-oeste': { pt: 'Região Centro-Oeste', es: 'Región Centro-Oeste' },
        sudeste: { pt: 'Região Sudeste', es: 'Región Sureste' },
        sul: { pt: 'Região Sul', es: 'Región Sur' },
    };
    const CAPITAIS = {
        AC: 'Rio Branco', AL: 'Maceió', AM: 'Manaus', AP: 'Macapá', BA: 'Salvador', CE: 'Fortaleza', DF: 'Brasília',
        ES: 'Vitória', GO: 'Goiânia', MA: 'São Luís', MG: 'Belo Horizonte', MS: 'Campo Grande', MT: 'Cuiabá',
        PA: 'Belém', PB: 'João Pessoa', PE: 'Recife', PI: 'Teresina', PR: 'Curitiba', RJ: 'Rio de Janeiro',
        RN: 'Natal', RO: 'Porto Velho', RR: 'Boa Vista', RS: 'Porto Alegre', SC: 'Florianópolis', SE: 'Aracaju',
        SP: 'São Paulo', TO: 'Palmas',
    };

    if (!estado) {
        document.getElementById('conteudo').innerHTML = `
            <section class="estado-vazio"><div>
                <span class="icone-redondo">${icone('mapa')}</span>
                <h1 style="font-size:2.4rem">${t('Estado não encontrado', 'Estado no encontrado')}</h1>
                <p>${t('Escolha um estado no mapa interativo da página inicial.', 'Elige un estado en el mapa interactivo de la página de inicio.')}</p>
                <a class="botao botao-primario" href="./index.html#mapa">${t('Voltar ao mapa', 'Volver al mapa')}</a>
            </div></section>`;
        return;
    }

    const preencher = (el, itens, tag) => {
        el.innerHTML = '';
        itens.filter(Boolean).forEach(texto => {
            const item = document.createElement(tag);
            item.textContent = texto;
            el.appendChild(item);
        });
    };

    function textosIdioma() {
        document.title = `${estado.titulo} · Conexión Migratoria`;
        campo('regiao').textContent = I18N.t(REGIOES[estado.regiao]);
        campo('resumo').textContent = I18N.t(estado.resumo);
        campo('tituloVizinhos').textContent = t(`Outros estados da ${REGIOES[estado.regiao].pt}`, `Otros estados de la ${REGIOES[estado.regiao].es}`);
    }

    // ---------- Topo ----------
    campo('imagem').src = estado.imagem;
    campo('imagem').alt = estado.titulo;
    campo('titulo').textContent = estado.titulo;
    campo('titulo-trilha').textContent = estado.titulo;
    campo('capital').textContent = CAPITAIS[uf];
    textosIdioma();
    I18N.aoTrocar(textosIdioma);

    // ---------- Cultura ----------
    preencher(campo('cultura'), estado.cultura.textos, 'p');
    campo('imagemCultura').src = estado.cultura.imagem;
    campo('imagemCultura').alt = estado.titulo;

    // ---------- Pontos turísticos: galeria + tela cheia ----------
    const pontos = estado.pontosTuristicos;
    const galeria = campo('galeria');
    pontos.forEach((ponto, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'galeria-item revelar';
        b.id = `imgponto${i + 1}`;
        b.innerHTML = `<img src="${ponto.imagem}" alt="" loading="lazy"><span class="galeria-legenda"><span></span>${icone('seta')}</span>`;
        b.querySelector('.galeria-legenda span').textContent = ponto.nome;
        b.setAttribute('aria-label', ponto.nome);
        b.addEventListener('click', () => abrirLightbox(i));
        galeria.appendChild(b);
    });

    const lightbox = document.getElementById('lightbox');
    let atual = 0;
    let focoAnterior = null;
    function mostrarPonto(i) {
        atual = (i + pontos.length) % pontos.length;
        const p = pontos[atual];
        const img = document.getElementById('lightboxImagem');
        img.classList.remove('entrando'); void img.offsetWidth; img.classList.add('entrando');
        img.src = p.imagem;
        img.alt = p.nome;
        document.getElementById('lightboxNome').textContent = p.nome;
        document.getElementById('lightboxDescricao').textContent = p.descricao;
        document.getElementById('lightboxContador').textContent = `${atual + 1} / ${pontos.length}`;
        lightbox.setAttribute('aria-label', p.nome);
    }
    function abrirLightbox(i) {
        focoAnterior = document.activeElement;
        mostrarPonto(i);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        document.getElementById('lightboxFechar').focus();
    }
    function fecharLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        if (focoAnterior) focoAnterior.focus();
    }
    document.getElementById('lightboxFechar').addEventListener('click', fecharLightbox);
    document.getElementById('lightboxAnterior').addEventListener('click', () => mostrarPonto(atual - 1));
    document.getElementById('lightboxProxima').addEventListener('click', () => mostrarPonto(atual + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) fecharLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') fecharLightbox();
        else if (e.key === 'ArrowLeft') mostrarPonto(atual - 1);
        else if (e.key === 'ArrowRight') mostrarPonto(atual + 1);
        else if (e.key === 'Tab') { // mantém o foco dentro da janela
            const focaveis = [...lightbox.querySelectorAll('button')];
            const i = focaveis.indexOf(document.activeElement);
            e.preventDefault();
            focaveis[(i + (e.shiftKey ? -1 : 1) + focaveis.length) % focaveis.length].focus();
        }
    });
    // Arrastar para o lado no celular
    let toqueX = null;
    lightbox.addEventListener('touchstart', (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (toqueX === null) return;
        const dx = e.changedTouches[0].clientX - toqueX;
        if (Math.abs(dx) > 50) mostrarPonto(atual + (dx < 0 ? 1 : -1));
        toqueX = null;
    });

    // ---------- Saúde, ensino e cidades ----------
    // O cartão mostra uma prévia curta (todos ficam do mesmo tamanho);
    // o texto completo abre numa janela por cima da página.
    const escolas = estado.ensino.escolas.filter(Boolean).map(e => e.replace(/[;.,\s]+$/, ''));
    const INFO = {
        saude: { pt: 'Sistema de saúde', es: 'Sistema de salud', icone: 'coracao', textos: estado.saude, imagem: pontos[1].imagem },
        ensino: { pt: 'Sistema de ensino', es: 'Sistema educativo', icone: 'capelo', textos: [estado.ensino.texto], imagem: pontos[2].imagem, escolas },
        cidades: { pt: 'Cidades bem localizadas', es: 'Ciudades bien ubicadas', icone: 'pino', textos: estado.cidades, imagem: pontos[3].imagem },
    };
    campo('previaSaude').textContent = estado.saude[0];
    campo('previaEnsino').textContent = estado.ensino.texto;
    campo('previaCidades').textContent = estado.cidades[0];
    campo('imagemSaude').src = INFO.saude.imagem;
    campo('imagemEnsino').src = INFO.ensino.imagem;
    campo('imagemCidades').src = INFO.cidades.imagem;
    const contagem = () => { campo('contagemEscolas').textContent = t(`${escolas.length} escolas públicas citadas`, `${escolas.length} escuelas públicas citadas`); };
    contagem();
    I18N.aoTrocar(contagem);

    const janela = document.getElementById('janelaInfo');
    let focoAntesJanela = null;
    function abrirJanela(chave) {
        const info = INFO[chave];
        focoAntesJanela = document.activeElement;
        document.getElementById('janelaTitulo').textContent = t(info.pt, info.es);
        document.getElementById('janelaIcone').innerHTML = icone(info.icone);
        document.getElementById('janelaImagem').src = info.imagem;
        preencher(document.getElementById('janelaTexto'), info.textos, 'p');
        preencher(document.getElementById('janelaEscolas'), info.escolas || [], 'li');
        janela.hidden = false;
        document.body.style.overflow = 'hidden';
        janela.querySelector('.janela-caixa').scrollTop = 0;
        document.getElementById('janelaFechar').focus();
    }
    function fecharJanela() {
        janela.hidden = true;
        document.body.style.overflow = '';
        if (focoAntesJanela) focoAntesJanela.focus();
    }
    document.querySelectorAll('.info-abrir').forEach(b => b.addEventListener('click', () => abrirJanela(b.dataset.info)));
    document.getElementById('janelaFechar').addEventListener('click', fecharJanela);
    janela.addEventListener('click', (e) => { if (e.target === janela) fecharJanela(); });
    document.addEventListener('keydown', (e) => {
        if (janela.hidden) return;
        if (e.key === 'Escape') fecharJanela();
        if (e.key === 'Tab') { e.preventDefault(); document.getElementById('janelaFechar').focus(); }
    });

    // ---------- Outros estados da mesma região ----------
    const ordem = Object.keys(ESTADOS).sort((a, b) => ESTADOS[a].titulo.localeCompare(ESTADOS[b].titulo));
    const vizinhos = ordem.filter(s => s !== uf && ESTADOS[s].regiao === estado.regiao);
    campo('vizinhos').innerHTML = vizinhos.map(s => `
        <a class="vizinho" href="./pg-estados.html?uf=${s}">
            <img src="${ESTADOS[s].imagem}" alt="" loading="lazy">
            <span class="vizinho-nome">${ESTADOS[s].titulo}<small>${CAPITAIS[s]}</small></span>
        </a>`).join('');

    // ---------- Estado anterior / próximo e seletor ----------
    const pos = ordem.indexOf(uf);
    const anterior = ordem[(pos - 1 + ordem.length) % ordem.length];
    const proximo = ordem[(pos + 1) % ordem.length];
    const linkAnt = document.getElementById('estadoAnterior');
    const linkProx = document.getElementById('estadoProximo');
    linkAnt.href = `./pg-estados.html?uf=${anterior}`;
    linkAnt.querySelector('span').textContent = ESTADOS[anterior].titulo;
    linkProx.href = `./pg-estados.html?uf=${proximo}`;
    linkProx.querySelector('span').textContent = ESTADOS[proximo].titulo;

    const seletor = document.getElementById('outroEstado');
    ordem.forEach(sigla => seletor.add(new Option(ESTADOS[sigla].titulo, sigla, false, sigla === uf)));
    seletor.addEventListener('change', () => { location.href = `./pg-estados.html?uf=${seletor.value}`; });
})();
