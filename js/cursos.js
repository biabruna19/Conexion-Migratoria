/*
 * Quiz "Qual é o seu nível?": 3 perguntas rápidas que indicam por qual
 * nível de videoaula começar e destacam o cartão recomendado.
 */
(function () {
    const PERGUNTAS = [
        { pt: 'Você consegue se apresentar em português (nome, país, idade)?', es: '¿Puedes presentarte en portugués (nombre, país, edad)?' },
        { pt: 'Você entende uma conversa simples no dia a dia, como no mercado?', es: '¿Entiendes una conversación simple del día a día, como en el mercado?' },
        { pt: 'Você conseguiria fazer uma entrevista de emprego em português?', es: '¿Podrías hacer una entrevista de trabajo en portugués?' },
    ];
    const PONTOS = { sim: 2, 'mais-ou-menos': 1, nao: 0 };
    const pergunta = document.getElementById('quizPergunta');
    const opcoes = document.getElementById('quizOpcoes');
    const passos = document.querySelectorAll('.quiz-passos span');
    let atual = 0;
    let pontos = 0;

    function mostrar(soIdioma) {
        if (atual < PERGUNTAS.length) {
            pergunta.textContent = I18N.t(PERGUNTAS[atual]);
            passos.forEach((p, i) => p.classList.toggle('ativo', i <= atual));
            return;
        }
        const nivel = pontos <= 2 ? 'basico' : pontos <= 4 ? 'intermediario' : 'avancado';
        const nomes = {
            basico: { pt: 'básico', es: 'básico' },
            intermediario: { pt: 'intermediário', es: 'intermedio' },
            avancado: { pt: 'avançado', es: 'avanzado' },
        };
        pergunta.textContent = I18N.t({
            pt: `Sugestão: comece pelo nível ${nomes[nivel].pt}.`,
            es: `Sugerencia: empieza por el nivel ${nomes[nivel].es}.`,
        });
        opcoes.innerHTML = `<button type="button" id="quizRefazer">${I18N.t({ pt: 'Refazer o teste', es: 'Rehacer el test' })}</button>`;
        document.getElementById('quizRefazer').addEventListener('click', reiniciar);
        document.querySelectorAll('.nivel').forEach(n => n.classList.toggle('recomendado', n.id === 'nivel-' + nivel));
        if (soIdioma === true) return; // só trocou o idioma: não rola nem comemora de novo
        document.getElementById('nivel-' + nivel).scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (window.CMInteracoes) CMInteracoes.confete(document.getElementById('nivel-' + nivel));
    }

    const botoesOriginais = opcoes.innerHTML;
    function reiniciar() {
        atual = 0; pontos = 0;
        opcoes.innerHTML = botoesOriginais;
        I18N.aplicar(opcoes);
        document.querySelectorAll('.nivel').forEach(n => n.classList.remove('recomendado'));
        mostrar();
    }

    opcoes.addEventListener('click', (e) => {
        const b = e.target.closest('[data-resposta]');
        if (!b) return;
        pontos += PONTOS[b.dataset.resposta];
        atual++;
        mostrar();
    });
    I18N.aoTrocar(() => mostrar(true));
    mostrar();
})();
