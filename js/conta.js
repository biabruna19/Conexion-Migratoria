/*
 * Login, cadastro e recuperação de senha (modo demonstração).
 * Mesmo fluxo da versão original, com os dados salvos no navegador.
 */
(function () {
    const pagina = location.pathname.split('/').pop();
    const valor = (form, nome) => form.querySelector(`[name="${nome}"]`).value;

    // Quem já está logado não precisa ver login/cadastro
    if ((pagina === 'logar.html' || pagina === 'criarConta.html') && CM.estaLogado()) {
        location.replace(CM.destinoAposLogin());
        return;
    }

    // Mantém o destino (?voltar=) ao alternar entre login e cadastro
    const voltar = new URLSearchParams(location.search).get('voltar');
    if (voltar) {
        document.querySelectorAll('a[href="./criarConta.html"], a[href="./logar.html"]').forEach(a => {
            a.href += '?voltar=' + encodeURIComponent(voltar);
        });
    }

    const login = document.getElementById('loginForm');
    if (login) {
        login.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await CM.entrar(valor(login, 'email'), valor(login, 'senha'));
                location.href = CM.destinoAposLogin();
            } catch (err) {
                alert(err.message);
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
            if (valor(cadastro, 'senha') !== valor(cadastro, 'conf_senha')) {
                alert('As senhas não coincidem!');
                return;
            }
            try {
                await CM.cadastrar({
                    nome: valor(cadastro, 'nome'),
                    email: valor(cadastro, 'email'),
                    telefone: valor(cadastro, 'telefone'),
                    nacionalidade: valor(cadastro, 'nacionalidade'),
                    senha: valor(cadastro, 'senha'),
                });
                alert('Conta criada com sucesso!');
                location.href = './logar.html' + (voltar ? '?voltar=' + encodeURIComponent(voltar) : '');
            } catch (err) {
                alert(err.message);
            }
        });
    }

    const recuperar = document.getElementById('recoverForm');
    if (recuperar) {
        recuperar.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                CM.iniciarRecuperacao(valor(recuperar, 'email'));
                location.href = './redefinirSenha.html';
            } catch (err) {
                alert(err.message);
            }
        });
    }

    const redefinir = document.getElementById('resetForm');
    if (redefinir) {
        if (!CM.emailEmRecuperacao()) {
            location.replace('./recuperarSenha.html');
            return;
        }
        redefinir.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (valor(redefinir, 'nova_senha') !== valor(redefinir, 'conf_senha')) {
                alert('As senhas não coincidem!');
                return;
            }
            try {
                await CM.redefinirSenha(valor(redefinir, 'nova_senha'));
                alert('Senha redefinida com sucesso!');
                location.href = './logar.html';
            } catch (err) {
                alert(err.message);
            }
        });
    }
})();
