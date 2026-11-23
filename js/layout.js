/*
 * Estrutura compartilhada por todas as páginas: ícones, topo, menu mobile,
 * rodapé, seletor de idioma e aviso de demonstração.
 *
 * Uso no HTML:
 *   <div id="cm-topo"></div><script src="./js/layout.js"></script>   (logo após <body>)
 *   <div id="cm-rodape"></div>                                       (antes de </body>)
 * Depende de idioma.js e demo-store.js (carregados no <head>).
 */
(function () {
    const usuario = window.CM ? CM.usuarioAtual() : null;
    const pagina = location.pathname.split('/').pop() || 'index.html';
    const naHome = pagina === 'index.html';
    const pt = (p, e) => `<span lang="pt">${p}</span><span lang="es">${e}</span>`;
    const escapar = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---------- Ícones (SVG em linha, sem depender de CDN) ----------
    const ICONES = {
        mapa: '<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
        documento: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
        maleta: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
        capelo: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
        telefone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
        busca: '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
        seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
        setaEsquerda: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
        externo: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        globo: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
        coracao: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
        pino: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
        escudo: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        predio: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M12 3l9 5H3z"/>',
        menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
        fechar: '<path d="M18 6 6 18M6 6l12 12"/>',
        jornal: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
        sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
        camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
        lixeira: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
        lapis: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
        play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
        livro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
        alerta: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
        balanca: '<path d="M12 3v18M5 21h14M3 7h18M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
        maos: '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.9l-4.2 3.9M2 15l6 6"/>',
        linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        som: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
        aleatorio: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
        girar: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
        chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    };
    window.icone = (nome, classe = '') => `<svg class="icone ${classe}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ''}</svg>`;

    // Logotipo original do projeto (versão branca, sobre fundo azul-escuro)
    const MARCA = `<img src="./img/logo-branca-conexion-migratoria.png" alt="Conexión Migratoria">`;

    const LINKS = [
        { href: naHome ? '#mapa' : './index.html#mapa', pt: 'Mapa', es: 'Mapa' },
        { href: './leis.html', pt: 'Leis e documentos', es: 'Leyes y documentos' },
        { href: './pg-empregos.html', pt: 'Empregabilidade', es: 'Empleo' },
        { href: './pg-cursos.html', pt: 'Cursos', es: 'Cursos' },
        { href: './contatos.html', pt: 'Contatos úteis', es: 'Contactos útiles' },
        { href: naHome ? '#noticias' : './index.html#noticias', pt: 'Notícias', es: 'Noticias' },
    ];
    const atual = (href) => href.replace('./', '') === pagina ? ' aria-current="page"' : '';
    const linksHtml = LINKS.map(l => `<a href="${l.href}"${atual(l.href)}>${pt(l.pt, l.es)}</a>`).join('');

    const iniciais = usuario ? usuario.nome.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase() : '';
    const avatar = usuario
        ? (usuario.foto ? `<img class="avatar" src="${usuario.foto}" alt="">` : `<span class="avatar">${escapar(iniciais)}</span>`)
        : '';
    const conta = usuario
        ? `<a class="conta-topo" href="./pg-perfil.html" data-pt-aria-label="Minha conta" data-es-aria-label="Mi cuenta">${avatar}<span class="nome-conta">${escapar(usuario.nome.split(' ')[0])}</span></a>`
        : `<a class="conta-topo sem-login" href="./logar.html">${pt('Entrar', 'Iniciar sesión')}</a>`;
    const seletor = `
        <div class="seletor-idioma" role="group" data-pt-aria-label="Idioma" data-es-aria-label="Idioma">
            <button type="button" data-idioma-botao="pt" aria-pressed="false" title="Português">PT</button>
            <button type="button" data-idioma-botao="es" aria-pressed="false" title="Español">ES</button>
        </div>`;

    const topo = `
<a class="visualmente-oculto" href="#conteudo">${pt('Pular para o conteúdo', 'Ir al contenido')}</a>
<header class="topo" id="topo">
    <div class="container">
        <a class="marca" href="./index.html" aria-label="Conexión Migratoria">${MARCA}</a>
        <nav class="menu-principal" data-pt-aria-label="Menu principal" data-es-aria-label="Menú principal">${linksHtml}</nav>
        <div class="acoes-topo">
            ${seletor}
            ${conta}
            <button type="button" class="botao-menu" id="botaoMenu" aria-expanded="false" aria-controls="gaveta" data-pt-aria-label="Abrir menu" data-es-aria-label="Abrir menú">${icone('menu')}</button>
        </div>
    </div>
</header>
<div class="gaveta" id="gaveta">
    <nav>${linksHtml}</nav>
    <div class="acoes-gaveta">
        ${seletor}
        ${usuario
            ? `<button type="button" class="botao botao-contorno botao-pequeno" data-sair>${icone('sair')}${pt('Sair', 'Salir')}</button>`
            : `<a class="botao botao-mar botao-pequeno" href="./criarConta.html">${pt('Criar conta', 'Crear cuenta')}</a>`}
    </div>
</div>
<div class="aviso-demo" role="note">
    <span class="ponto"></span>
    <div>
        <strong>${pt('Versão de demonstração', 'Versión de demostración')}</strong>
        ${pt('Contas e fotos ficam salvas apenas neste navegador. Nenhum dado é enviado.', 'Las cuentas y fotos se guardan solo en este navegador. No se envía ningún dato.')}
    </div>
    <button type="button" data-pt-aria-label="Fechar aviso" data-es-aria-label="Cerrar aviso">${icone('fechar')}</button>
</div>`;

    const rodape = `
<footer class="rodape">
    <div class="container">
        <div class="rodape-grade">
            <div>
                <a class="marca" href="./index.html" aria-label="Conexión Migratoria">${MARCA}</a>
                <p>${pt('Informação confiável para quem está começando uma nova vida no Brasil.', 'Información confiable para quienes empiezan una nueva vida en Brasil.')}</p>
            </div>
            <div>
                <h3>${pt('Explorar', 'Explorar')}</h3>
                <ul>
                    <li><a href="./index.html#mapa">${pt('Mapa interativo', 'Mapa interactivo')}</a></li>
                    <li><a href="./leis.html">${pt('Leis e documentos', 'Leyes y documentos')}</a></li>
                    <li><a href="./pg-empregos.html">${pt('Empregabilidade', 'Empleo')}</a></li>
                    <li><a href="./pg-cursos.html">${pt('Cursos', 'Cursos')}</a></li>
                </ul>
            </div>
            <div>
                <h3>${pt('Ajuda', 'Ayuda')}</h3>
                <ul>
                    <li><a href="./contatos.html">${pt('Contatos úteis', 'Contactos útiles')}</a></li>
                    <li><a href="./contatos.html#emergencia">${pt('Emergências', 'Emergencias')}</a></li>
                    <li><a href="https://help.unhcr.org/brazil/" target="_blank" rel="noopener">ACNUR Brasil</a></li>
                </ul>
            </div>
            <div>
                <h3>${pt('Sua conta', 'Tu cuenta')}</h3>
                <ul>
                    ${usuario
                        ? `<li><a href="./pg-perfil.html">${pt('Meu perfil', 'Mi perfil')}</a></li><li><a href="#" data-sair>${pt('Sair', 'Salir')}</a></li>`
                        : `<li><a href="./logar.html">${pt('Entrar', 'Iniciar sesión')}</a></li><li><a href="./criarConta.html">${pt('Criar conta', 'Crear cuenta')}</a></li>`}
                </ul>
            </div>
        </div>
        <div class="rodape-base">
            <span>© 2026 Conexión Migratoria</span>
            <span>${pt('Projeto educacional · as informações não substituem a orientação dos órgãos oficiais.', 'Proyecto educativo · la información no sustituye la orientación de los organismos oficiales.')}</span>
        </div>
    </div>
</footer>`;

    const alvoTopo = document.getElementById('cm-topo');
    if (alvoTopo) alvoTopo.outerHTML = topo;

    document.addEventListener('DOMContentLoaded', () => {
        const alvoRodape = document.getElementById('cm-rodape');
        if (alvoRodape) alvoRodape.outerHTML = rodape;
        I18N.aplicar();
        iniciarRevelar();
    });


    // Sombra no topo ao rolar
    const elTopo = document.getElementById('topo');
    const aoRolar = () => elTopo && elTopo.classList.toggle('rolou', scrollY > 8);
    addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();

    // Menu mobile
    const botao = document.getElementById('botaoMenu');
    const gaveta = document.getElementById('gaveta');
    const fecharGaveta = () => {
        gaveta.classList.remove('aberta');
        botao.setAttribute('aria-expanded', 'false');
        botao.innerHTML = icone('menu');
    };
    if (botao && gaveta) {
        botao.addEventListener('click', () => {
            const aberta = gaveta.classList.toggle('aberta');
            botao.setAttribute('aria-expanded', aberta);
            botao.innerHTML = icone(aberta ? 'fechar' : 'menu');
        });
        gaveta.querySelectorAll('a').forEach(a => a.addEventListener('click', fecharGaveta));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharGaveta(); });
    }

    // Aviso de demonstração (fica fechado durante a visita)
    const aviso = document.querySelector('.aviso-demo');
    if (aviso) {
        if (sessionStorage.getItem('cm_aviso_fechado')) aviso.remove();
        else aviso.querySelector('button').addEventListener('click', () => {
            sessionStorage.setItem('cm_aviso_fechado', '1');
            aviso.remove();
        });
    }

    // Sair da conta
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-sair]')) return;
        e.preventDefault();
        CM.sair();
        location.href = './index.html';
    });

    // Elementos com .revelar aparecem suavemente ao entrar na tela
    function iniciarRevelar() {
        const itens = document.querySelectorAll('.revelar');
        if (!('IntersectionObserver' in window)) { itens.forEach(el => el.classList.add('visivel')); return; }
        const obs = new IntersectionObserver((entradas) => {
            entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visivel'); obs.unobserve(en.target); } });
        }, { rootMargin: '0px 0px -60px 0px' });
        itens.forEach(el => obs.observe(el));
    }
})();
