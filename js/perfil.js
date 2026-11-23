/*
 * Página de perfil: ver/editar dados, enviar/excluir foto e sair.
 * Mesmas funções da versão PHP, salvando no navegador (modo demonstração).
 */
(function () {
    const usuario = CM.usuarioAtual();
    if (!usuario) return; // exigirLogin() já redirecionou

    const campos = {
        nome: document.getElementById('nomeInput'),
        email: document.getElementById('emailInput'),
        telefone: document.getElementById('telefoneInput'),
        nacionalidade: document.getElementById('nacionalidadeInput'),
        senha: document.getElementById('senhaInput'),
    };
    const foto = document.getElementById('fotoPerfil');
    const fotoPadrao = './img/perfil-de-usuario.png';
    const botaoEditar = document.getElementById('botaoEditar');
    const salvar = document.getElementById('salvarButton');

    function preencher(u) {
        document.getElementById('nomeTitulo').textContent = u.nome;
        campos.nome.value = u.nome;
        campos.email.value = u.email;
        campos.telefone.value = u.telefone;
        campos.nacionalidade.value = u.nacionalidade;
        campos.senha.value = '';
        foto.src = u.foto || fotoPadrao;
        // Atualiza a foto do menu também
        const fotoMenu = document.querySelector('.user img');
        if (fotoMenu) {
            fotoMenu.src = u.foto || './img/do-utilizador.png';
            fotoMenu.classList.toggle('foto-usuario', !!u.foto);
        }
    }

    function modoEdicao(editando) {
        Object.values(campos).forEach(input => {
            input.readOnly = !editando;
            input.style.borderColor = editando ? '#1AAADF' : '';
        });
        campos.senha.placeholder = editando ? 'Nova senha (opcional)' : '••••••••';
        salvar.disabled = !editando;
        botaoEditar.classList.toggle('editing', editando);
        document.getElementById('editarIcone').src = editando ? './img/fechar.png' : './img/editar.png';
        document.getElementById('editarTexto').textContent = editando ? 'Cancelar' : 'Editar';
        if (editando) campos.nome.focus();
    }

    botaoEditar.addEventListener('click', () => {
        const editando = botaoEditar.classList.contains('editing');
        if (editando) preencher(CM.usuarioAtual()); // cancelar restaura os valores
        modoEdicao(!editando);
    });

    document.getElementById('formDados').addEventListener('submit', async (e) => {
        e.preventDefault();
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
            alert('Dados atualizados com sucesso!');
        } catch (err) {
            alert(err.message);
        }
    });

    document.getElementById('profile_picture').addEventListener('change', async (e) => {
        const arquivo = e.target.files[0];
        e.target.value = '';
        if (!arquivo) return;
        try {
            preencher(await CM.atualizarPerfil({ foto: await CM.redimensionarFoto(arquivo) }));
        } catch (err) {
            alert(err.message);
        }
    });

    document.getElementById('excluirFoto').addEventListener('click', async () => {
        if (!CM.usuarioAtual().foto) return;
        if (confirm('Excluir sua foto de perfil?')) preencher(await CM.atualizarPerfil({ foto: null }));
    });

    preencher(usuario);
})();
