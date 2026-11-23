/*
 * Página de cada estado (pg-estados.html?uf=SP)
 *
 * Antes o conteúdo vinha de um banco MySQL via PHP, que não roda no GitHub
 * Pages, então a página quebrava ao clicar no mapa. Agora os textos e
 * imagens dos 27 estados ficam em data/estados.js (recuperados do banco
 * original) e são preenchidos aqui.
 */
(function () {
    const uf = (new URLSearchParams(location.search).get('uf') || '').toUpperCase();
    const estado = (window.ESTADOS || {})[uf];

    if (!estado) {
        document.querySelector('main').innerHTML = `
            <div class="estado-nao-encontrado">
                <h1>Estado não encontrado</h1>
                <p>Escolha um estado no mapa interativo da página inicial.</p>
                <a href="./index.html#mapa"><button type="button">VOLTAR AO MAPA</button></a>
            </div>`;
        document.querySelectorAll('.sessao2, .sessao3').forEach(el => el.remove());
        return;
    }

    const campo = (nome) => document.querySelector(`[data-campo="${nome}"]`);
    const paragrafo = (texto) => {
        const p = document.createElement('p');
        p.textContent = texto;
        return p;
    };
    const separador = () => document.createElement('div');
    const nomeBonito = estado.nome.replace(/^(DO|DA|DE)\s+/i, '');

    document.title = `Conexión Migratoria - ${nomeBonito}`;

    // Slides: apresentação e cultura
    campo('nome').textContent = estado.nome;
    campo('imagem').src = estado.imagem;
    campo('imagem').alt = `Paisagem do estado ${estado.nome}`;
    estado.cultura.textos.forEach(t => campo('cultura').appendChild(paragrafo(t)));
    campo('imagemCultura').src = estado.cultura.imagem;
    campo('imagemCultura').alt = `Cultura do estado ${estado.nome}`;

    const slides = document.querySelectorAll('.slide-estado');
    let atual = 0;
    const mostrarSlide = (i) => {
        slides[atual].style.display = 'none';
        atual = (i + slides.length) % slides.length;
        slides[atual].style.display = 'flex';
    };
    document.querySelector('.anterior').addEventListener('click', () => mostrarSlide(atual - 1));
    document.querySelector('.proximo').addEventListener('click', () => mostrarSlide(atual + 1));

    // Pontos turísticos: clicar num card troca o texto e o fundo da seção
    const fundo = document.getElementById('imgfundo');
    const cards = campo('pontosCards');
    const infos = campo('pontosInfo');
    const selecionarPonto = (i) => {
        infos.querySelectorAll('.info-ponto').forEach((el, j) => { el.style.display = i === j ? 'grid' : 'none'; });
        cards.querySelectorAll('[role="button"]').forEach((el, j) => el.setAttribute('aria-pressed', i === j));
        fundo.style.backgroundImage = `url('${estado.pontosTuristicos[i].imagem}')`;
    };
    estado.pontosTuristicos.forEach((ponto, i) => {
        const card = document.createElement('div');
        card.id = `imgponto${i + 1}`;
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.style.backgroundImage = `url('${ponto.imagem}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        card.appendChild(paragrafo(ponto.nome));
        card.addEventListener('click', () => selecionarPonto(i));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selecionarPonto(i); }
        });
        cards.appendChild(card);

        const info = document.createElement('div');
        info.className = 'info-ponto';
        info.id = `ponto${i + 1}`;
        const titulo = document.createElement('h1');
        titulo.textContent = ponto.nome;
        const texto = document.createElement('div');
        texto.appendChild(paragrafo(ponto.descricao));
        info.append(titulo, texto);
        infos.appendChild(info);
    });
    selecionarPonto(0);

    // Mais informações: saúde, ensino e cidades
    estado.saude.forEach(t => campo('saude').appendChild(paragrafo(t)));

    campo('ensino').appendChild(paragrafo(estado.ensino.texto));
    campo('ensino').appendChild(separador());
    estado.ensino.escolas.filter(Boolean).forEach(t => campo('ensino').appendChild(paragrafo(t)));

    estado.cidades.forEach((t, i) => {
        if (i > 0) campo('cidades').appendChild(separador());
        campo('cidades').appendChild(paragrafo(t));
    });

    // Botões "Ver mais": abre uma seção por vez; clicar de novo fecha
    const onda = document.getElementById('div-wavefoot');
    const botoes = document.querySelectorAll('.cards-sec3 button[data-alvo]');
    botoes.forEach(botao => {
        botao.setAttribute('aria-expanded', 'false');
        botao.addEventListener('click', () => {
            const alvo = document.getElementById(botao.dataset.alvo);
            const abrir = alvo.style.display !== 'block';
            botoes.forEach(b => {
                document.getElementById(b.dataset.alvo).style.display = 'none';
                b.setAttribute('aria-expanded', 'false');
            });
            if (abrir) {
                alvo.style.display = 'block';
                botao.setAttribute('aria-expanded', 'true');
            }
            if (onda) onda.style.backgroundColor = abrir ? '#053344' : 'white';
        });
    });
})();
