/*
 * Menu superior, menu mobile e aviso de demonstração, compartilhados por
 * todas as páginas. Antes cada página tinha uma cópia do menu, com links
 * diferentes (e alguns quebrados, apontando para arquivos .php).
 *
 * Uso: <div id="cm-topo"></div><script src="./js/layout.js"></script>
 * (precisa vir depois de demo-store.js)
 */
(function () {
    const usuario = window.CM ? CM.usuarioAtual() : null;
    const pagina = location.pathname.split('/').pop() || 'index.html';
    const naHome = pagina === 'index.html' || pagina === 'homeLogada.html';
    const home = naHome ? '' : './index.html';

    const links = [
        { texto: 'MAPA INTERATIVO', href: home + '#mapa' },
        { texto: 'LEIS E DOCUMENTOS', href: './leis.html' },
        { texto: 'EMPREGABILIDADE', href: './pg-empregos.html' },
        { texto: 'CURSOS', href: './pg-cursos.html' },
        { texto: 'NOTÍCIAS', href: home + '#noticias' },
    ];

    const escapar = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const ativo = (href) => href.replace('./', '') === pagina ? ' class="ativo" aria-current="page"' : '';
    const foto = usuario && usuario.foto ? usuario.foto : './img/do-utilizador.png';
    const contaHref = usuario ? './pg-perfil.html' : './logar.html';
    const contaRotulo = usuario ? 'Minha conta (' + escapar(usuario.nome) + ')' : 'Fazer login';

    const html = `
<div class="aviso-demo" role="note">
    <span><strong>Versão de demonstração:</strong> contas e fotos ficam salvas apenas no seu navegador.</span>
    <button type="button" class="aviso-demo-fechar" aria-label="Fechar aviso">&times;</button>
</div>
<nav>
    <div class="alinhar">
        <div class="logos">
            <a href="./index.html" aria-label="Conexión Migratoria — página inicial"><img src="./img/logo-branca-conexion-migratoria.png" alt="Conexión Migratoria"></a>
        </div>
        <div class="links-nav">
            <ul>
                ${links.map(l => `<li><a href="${l.href}"${ativo(l.href)}>${l.texto}</a></li>`).join('')}
            </ul>
            <div class="traduçao">
                <div class="gtranslate_wrapper"></div>
            </div>
            <div class="user">
                <a href="${contaHref}" title="${contaRotulo}" aria-label="${contaRotulo}">
                    <img src="${foto}" alt=""${usuario && usuario.foto ? ' class="foto-usuario"' : ''}>
                </a>
            </div>
        </div>
        <button type="button" class="menu-hamburguer" id="menuHamburguer" aria-label="Abrir menu" aria-expanded="false" aria-controls="backMenuMobile">
            <div></div><div></div><div></div>
        </button>
    </div>
    <div class="movendo-gradient"></div>
</nav>
<div class="back-menumobile" id="backMenuMobile">
    <div class="menu-mobile">
        <ul class="menu-mobile-links">
            ${links.map(l => `<li><a href="${l.href}">${l.texto}</a></li>`).join('')}
        </ul>
        <h1>TRADUZIR</h1>
        <div>
            <div class="gtranslate_wrapper"></div>
        </div>
        ${usuario
            ? '<a href="./pg-perfil.html">Minha Conta</a><a href="#" data-sair>Sair</a>'
            : '<a href="./logar.html">Fazer Login</a>'}
    </div>
</div>`;

    const alvo = document.getElementById('cm-topo');
    if (alvo) alvo.outerHTML = html;

    // Aviso de demonstração (some depois de fechado)
    const aviso = document.querySelector('.aviso-demo');
    if (aviso) {
        if (sessionStorage.getItem('cm_aviso_fechado')) aviso.remove();
        else aviso.querySelector('button').addEventListener('click', () => {
            sessionStorage.setItem('cm_aviso_fechado', '1');
            aviso.remove();
        });
    }

    // Menu mobile
    const botao = document.getElementById('menuHamburguer');
    const menu = document.getElementById('backMenuMobile');
    if (botao && menu) {
        botao.addEventListener('click', () => {
            const aberto = botao.classList.toggle('active');
            menu.classList.toggle('active', aberto);
            botao.setAttribute('aria-expanded', aberto);
        });
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            botao.classList.remove('active');
            menu.classList.remove('active');
            botao.setAttribute('aria-expanded', 'false');
        }));
    }

    // Sair (menu mobile e qualquer elemento com data-sair)
    document.addEventListener('click', (e) => {
        const sair = e.target.closest('[data-sair]');
        if (!sair) return;
        e.preventDefault();
        CM.sair();
        location.href = './index.html';
    });

    // Tradutor (português/espanhol)
    window.gtranslateSettings = {
        default_language: 'pt', detect_browser_language: true, languages: ['pt', 'es'],
        wrapper_selector: '.gtranslate_wrapper', flag_size: 48, alt_flags: { pt: 'brazil' },
    };
    const gt = document.createElement('script');
    gt.src = 'https://cdn.gtranslate.net/widgets/latest/flags.js';
    gt.defer = true;
    document.body.appendChild(gt);
})();
