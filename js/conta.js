/*
 * Login, cadastro e recuperação de senha (modo demonstração).
 * Mesmo fluxo da versão original, com os dados salvos no navegador
 * e mensagens exibidas no próprio formulário, em português ou espanhol.
 */
(function () {
    const pagina = location.pathname.split('/').pop();
    const params = new URLSearchParams(location.search);
    const t = (pt, es) => I18N.t({ pt, es });
    const valor = (form, nome) => form.querySelector(`[name="${nome}"]`).value.trim();

    function avisar(form, texto, sucesso = false) {
        const caixa = form.querySelector('.mensagem-form');
        caixa.textContent = texto;
        caixa.classList.toggle('sucesso', sucesso);
        caixa.hidden = false;
    }
    // Campos obrigatórios vazios: destaca e avisa
    function camposValidos(form) {
        let ok = true;
        form.querySelectorAll('input[required]').forEach(i => {
            const invalido = !i.value.trim() || (i.type === 'email' && !i.checkValidity());
            i.setAttribute('aria-invalid', invalido);
            if (invalido) ok = false;
        });
        if (!ok) avisar(form, t('Preencha todos os campos corretamente.', 'Completa todos los campos correctamente.'));
        return ok;
    }
    function carregando(form, sim) {
        const botao = form.querySelector('[type="submit"]');
        botao.disabled = sim;
    }

    // Quem já está logado não precisa ver login/cadastro
    if ((pagina === 'logar.html' || pagina === 'criarConta.html') && CM.estaLogado()) {
        location.replace(CM.destinoAposLogin());
        return;
    }

    // Mantém o destino (?voltar=) ao alternar entre login e cadastro
    const voltar = params.get('voltar');
    const comVoltar = (url) => url + (voltar ? (url.includes('?') ? '&' : '?') + 'voltar=' + encodeURIComponent(voltar) : '');
    if (voltar) {
        document.querySelectorAll('a[href="./criarConta.html"], a[href="./logar.html"]').forEach(a => { a.href = comVoltar(a.getAttribute('href')); });
    }

    const login = document.getElementById('loginForm');
    if (login) {
        if (params.get('criada')) avisar(login, t('Conta criada com sucesso! Agora é só entrar.', '¡Cuenta creada con éxito! Ahora solo inicia sesión.'), true);
        if (params.get('senha')) avisar(login, t('Senha redefinida com sucesso!', '¡Contraseña restablecida con éxito!'), true);
        if (voltar && !params.get('criada')) avisar(login, t('Entre na sua conta para ver esta página.', 'Inicia sesión para ver esta página.'), true);

        login.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!camposValidos(login)) return;
            carregando(login, true);
            try {
                await CM.entrar(valor(login, 'email'), login.querySelector('[name="senha"]').value);
                location.href = CM.destinoAposLogin();
            } catch (err) {
                avisar(login, err.message);
                carregando(login, false);
            }
        });
        document.getElementById('entrarVisitante').addEventListener('click', async () => {
            await CM.entrarComoVisitante();
            location.href = CM.destinoAposLogin();
        });
    }

    const cadastro = document.getElementById('registerForm');
    if (cadastro) {
        cadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!camposValidos(cadastro)) return;
            const senha = cadastro.querySelector('[name="senha"]').value;
            if (senha.length < 4) { avisar(cadastro, t('A senha precisa ter pelo menos 4 caracteres.', 'La contraseña debe tener al menos 4 caracteres.')); return; }
            if (senha !== cadastro.querySelector('[name="conf_senha"]').value) { avisar(cadastro, t('As senhas não coincidem.', 'Las contraseñas no coinciden.')); return; }
            carregando(cadastro, true);
            try {
                await CM.cadastrar({
                    nome: valor(cadastro, 'nome'),
                    email: valor(cadastro, 'email'),
                    telefone: valor(cadastro, 'telefone'),
                    nacionalidade: valor(cadastro, 'nacionalidade'),
                    senha,
                });
                location.href = comVoltar('./logar.html?criada=1');
            } catch (err) {
                avisar(cadastro, err.message);
                carregando(cadastro, false);
            }
        });
    }

    const recuperar = document.getElementById('recoverForm');
    if (recuperar) {
        recuperar.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!camposValidos(recuperar)) return;
            try {
                CM.iniciarRecuperacao(valor(recuperar, 'email'));
                location.href = './redefinirSenha.html';
            } catch (err) {
                avisar(recuperar, err.message);
            }
        });
    }

    const redefinir = document.getElementById('resetForm');
    if (redefinir) {
        if (!CM.emailEmRecuperacao()) { location.replace('./recuperarSenha.html'); return; }
        redefinir.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!camposValidos(redefinir)) return;
            const nova = redefinir.querySelector('[name="nova_senha"]').value;
            if (nova.length < 4) { avisar(redefinir, t('A senha precisa ter pelo menos 4 caracteres.', 'La contraseña debe tener al menos 4 caracteres.')); return; }
            if (nova !== redefinir.querySelector('[name="conf_senha"]').value) { avisar(redefinir, t('As senhas não coincidem.', 'Las contraseñas no coinciden.')); return; }
            try {
                await CM.redefinirSenha(nova);
                location.href = './logar.html?senha=1';
            } catch (err) {
                avisar(redefinir, err.message);
            }
        });
    }
})();
