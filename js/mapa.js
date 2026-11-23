/*
 * Mapa interativo do Brasil
 * - passar o mouse mostra o nome do estado
 * - clicar (ou Enter/Espaço no teclado) mostra o resumo do estado ao lado
 * - "Ver mais sobre esta região" leva para pg-estados.html?uf=XX
 *
 * Substitui o antigo func-mapa.js (870 linhas com um bloco repetido para
 * cada estado) mantendo exatamente o mesmo comportamento.
 */
(function () {
    const estados = document.querySelectorAll('.container-mapa path');
    const paineis = document.querySelectorAll('.info-mapa');
    const tooltip = document.querySelector('.tooltip');
    const ufDe = (path) => path.id.slice(-2);

    function selecionar(uf, rolar) {
        paineis.forEach(p => { p.style.display = p.id === uf ? 'flex' : 'none'; });
        estados.forEach(p => {
            const ativo = ufDe(p) === uf;
            p.classList.toggle('selecionado', ativo);
            p.setAttribute('aria-pressed', ativo);
        });
        // No celular o painel fica abaixo do mapa: rola até ele
        if (rolar && window.innerWidth <= 1024) {
            document.getElementById(uf)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    estados.forEach(path => {
        const nome = path.getAttribute('title');
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', nome);

        path.addEventListener('click', () => selecionar(ufDe(path), true));
        path.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selecionar(ufDe(path), true); }
        });
        path.addEventListener('mouseover', () => {
            tooltip.textContent = `${nome} (${ufDe(path)})`;
            tooltip.classList.add('active');
        });
        path.addEventListener('mouseout', () => tooltip.classList.remove('active'));
    });

    document.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = (e.pageY - 70) + 'px';
    });

    // São Paulo aparece selecionado ao abrir a página (como no original)
    selecionar('SP', false);
})();
