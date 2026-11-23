/*
 * Página de perfil: ver/editar dados, trocar senha, enviar/excluir foto e sair.
 * Mesmas funções da versão PHP, salvando no navegador (modo demonstração).
 */
(function () {
    const usuario = CM.usuarioAtual();
    if (!usuario) {
        // Nenhuma página exige login: aqui só convidamos a pessoa a entrar
        const t2 = (pt, es) => I18N.t({ pt, es });
        document.querySelector('.perfil-grade').outerHTML = `
            <div class="convite-conta">
                <span class="icone-redondo">${icone('usuario')}</span>
                <h2 style="font-size:1.8rem">${t2('Você ainda não entrou', 'Todavía no has iniciado sesión')}</h2>
                <p>${t2('Com uma conta você salva seu perfil e sua foto neste navegador. Todo o resto do site funciona sem login.', 'Con una cuenta guardas tu perfil y tu foto en este navegador. Todo lo demás del sitio funciona sin iniciar sesión.')}</p>
                <div class="acoes">
                    <a class="botao botao-primario" href="./logar.html">${t2('Entrar', 'Iniciar sesión')}</a>
                    <a class="botao botao-contorno" href="./criarConta.html">${t2('Criar conta', 'Crear cuenta')}</a>
                    <button type="button" class="botao botao-fantasma" id="perfilVisitante">${t2('Entrar como visitante', 'Entrar como visitante')}</button>
                </div>
            </div>`;
        document.getElementById('perfilVisitante').addEventListener('click', async () => {
            await CM.entrarComoVisitante();
            location.reload();
        });
        return;
    }

    const t = (pt, es) => I18N.t({ pt, es });
    const campos = {
        nome: document.getElementById('nomeInput'),
        email: document.getElementById('emailInput'),
        telefone: document.getElementById('telefoneInput'),
        nacionalidade: document.getElementById('nacionalidadeInput'),
        senha: document.getElementById('senhaInput'),
    };
    const form = document.getElementById('formDados');
    const foto = document.getElementById('fotoPerfil');
    const botaoEditar = document.getElementById('botaoEditar');
    const salvar = document.getElementById('salvarButton');
    const mensagem = form.querySelector('.mensagem-form');
    const FOTO_PADRAO = './img/perfil-de-usuario.png';
    let editando = false;

    function avisar(texto, sucesso) {
        mensagem.textContent = texto;
        mensagem.classList.toggle('sucesso', !!sucesso);
        mensagem.hidden = !texto;
    }

    function atualizarMenu(u) {
        const conta = document.querySelector('.conta-topo');
        if (!conta) return;
        const atual = conta.querySelector('.avatar');
        const novo = u.foto ? Object.assign(document.createElement('img'), { className: 'avatar', src: u.foto, alt: '' }) : null;
        if (novo) atual.replaceWith(novo);
        else if (atual.tagName === 'IMG') {
            const span = document.createElement('span');
            span.className = 'avatar';
            span.textContent = u.nome.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
            atual.replaceWith(span);
        }
        const nome = conta.querySelector('.nome-conta');
        if (nome) nome.textContent = u.nome.split(' ')[0];
    }

    function preencher(u) {
        document.getElementById('nomeTitulo').textContent = u.nome;
        document.getElementById('nacionalidadeTitulo').textContent = u.nacionalidade;
        campos.nome.value = u.nome;
        campos.email.value = u.email;
        campos.telefone.value = u.telefone;
        campos.nacionalidade.value = u.nacionalidade;
        campos.senha.value = '';
        foto.src = u.foto || FOTO_PADRAO;
        document.getElementById('excluirFoto').hidden = !u.foto;
        atualizarMenu(u);
    }

    function rotuloEditar() {
        document.getElementById('editarTexto').textContent = editando ? t('Cancelar', 'Cancelar') : t('Editar', 'Editar');
        campos.senha.placeholder = editando ? t('Nova senha (opcional)', 'Nueva contraseña (opcional)') : '••••••••';
    }

    function modoEdicao(sim) {
        editando = sim;
        Object.values(campos).forEach(i => { i.readOnly = !sim; });
        salvar.disabled = !sim;
        botaoEditar.classList.toggle('editing', sim);
        rotuloEditar();
        if (sim) campos.nome.focus();
    }

    botaoEditar.addEventListener('click', () => {
        if (editando) preencher(CM.usuarioAtual()); // cancelar restaura os valores
        avisar('');
        modoEdicao(!editando);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!campos.nome.value.trim() || !campos.email.checkValidity() || !campos.email.value.trim()) {
            avisar(t('Informe nome e e-mail válidos.', 'Ingresa un nombre y un correo válidos.'));
            return;
        }
        if (campos.senha.value && campos.senha.value.length < 4) {
            avisar(t('A nova senha precisa ter pelo menos 4 caracteres.', 'La nueva contraseña debe tener al menos 4 caracteres.'));
            return;
        }
        try {
            const atualizado = await CM.atualizarPerfil({
                nome: campos.nome.value,
                email: campos.email.value,
                telefone: campos.telefone.value,
                nacionalidade: campos.nacionalidade.value,
                senha: campos.senha.value || undefined,
            });
            preencher(atualizado);
            modoEdicao(false);
            avisar(t('Dados atualizados com sucesso!', '¡Datos actualizados con éxito!'), true);
        } catch (err) {
            avisar(err.message);
        }
    });

    document.getElementById('profile_picture').addEventListener('change', async (e) => {
        const arquivo = e.target.files[0];
        e.target.value = '';
        if (!arquivo) return;
        try {
            preencher(await CM.atualizarPerfil({ foto: await CM.redimensionarFoto(arquivo) }));
            avisar(t('Foto atualizada!', '¡Foto actualizada!'), true);
        } catch (err) {
            avisar(err.message);
        }
    });

    document.getElementById('excluirFoto').addEventListener('click', async () => {
        if (!CM.usuarioAtual().foto) return;
        if (confirm(t('Excluir sua foto de perfil?', '¿Eliminar tu foto de perfil?'))) {
            preencher(await CM.atualizarPerfil({ foto: null }));
        }
    });

    I18N.aoTrocar(rotuloEditar);
    preencher(usuario);
    rotuloEditar();
})();
