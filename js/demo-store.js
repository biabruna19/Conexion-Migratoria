/*
 * Conexión Migratoria — modo demonstração
 * ----------------------------------------
 * Contas, sessão e foto de perfil ficam salvas no navegador de quem está
 * testando (localStorage). Nenhum dado sai do computador do visitante e o
 * site funciona no GitHub Pages sem servidor nem banco de dados.
 *
 * As senhas são guardadas como hash SHA-256, nunca em texto puro.
 */
(function () {
    const CHAVE_USUARIOS = 'cm_usuarios';
    const msg = (pt, es) => (window.I18N ? I18N.t({ pt, es }) : pt);
    const CHAVE_SESSAO = 'cm_sessao';
    const CHAVE_RECUPERACAO = 'cm_recuperacao';

    const ler = (chave, padrao) => {
        try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; }
        catch { return padrao; }
    };
    const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

    const usuarios = () => ler(CHAVE_USUARIOS, []);
    const salvarUsuarios = (lista) => gravar(CHAVE_USUARIOS, lista);
    const normalizarEmail = (email) => String(email || '').trim().toLowerCase();

    async function hash(texto) {
        if (window.crypto && crypto.subtle) {
            const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
            return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Alternativa simples para navegadores sem crypto.subtle
        let h = 0;
        for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0;
        return 'x' + (h >>> 0).toString(16);
    }

    const semSenha = (u) => {
        if (!u) return null;
        const { senhaHash, ...publico } = u;
        return publico;
    };

    const CM = {
        usuarioAtual() {
            const id = ler(CHAVE_SESSAO, null);
            return semSenha(usuarios().find(u => u.id === id));
        },

        estaLogado() {
            return !!CM.usuarioAtual();
        },

        emailCadastrado(email) {
            return usuarios().some(u => u.email === normalizarEmail(email));
        },

        async cadastrar({ nome, email, telefone, nacionalidade, senha }) {
            const lista = usuarios();
            email = normalizarEmail(email);
            telefone = String(telefone || '').replace(/\D/g, '');
            if (lista.some(u => u.email === email || (telefone && u.telefone === telefone))) {
                throw new Error(msg('Este e-mail ou telefone já está cadastrado.', 'Este correo o teléfono ya está registrado.'));
            }
            const usuario = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
                nome: nome.trim(), email, telefone, nacionalidade: nacionalidade.trim(),
                senhaHash: await hash(senha), foto: null,
            };
            lista.push(usuario);
            salvarUsuarios(lista);
            return semSenha(usuario);
        },

        async entrar(email, senha) {
            const usuario = usuarios().find(u => u.email === normalizarEmail(email));
            if (!usuario) throw new Error(msg('Não encontramos uma conta com este e-mail.', 'No encontramos una cuenta con este correo.'));
            if (usuario.senhaHash !== await hash(senha)) throw new Error(msg('Senha incorreta. Tente novamente.', 'Contraseña incorrecta. Inténtalo de nuevo.'));
            gravar(CHAVE_SESSAO, usuario.id);
            return semSenha(usuario);
        },

        async entrarComoVisitante() {
            const email = 'visitante@demo.conexion';
            if (!CM.emailCadastrado(email)) {
                await CM.cadastrar({
                    nome: 'Visitante', email, telefone: '', nacionalidade: msg('Demonstração', 'Demostración'), senha: 'demo1234',
                });
            }
            return CM.entrar(email, 'demo1234');
        },

        sair() {
            localStorage.removeItem(CHAVE_SESSAO);
        },

        async atualizarPerfil(dados) {
            const atual = CM.usuarioAtual();
            if (!atual) throw new Error(msg('Faça login novamente.', 'Inicia sesión de nuevo.'));
            const lista = usuarios();
            const email = normalizarEmail(dados.email ?? atual.email);
            if (lista.some(u => u.id !== atual.id && u.email === email)) {
                throw new Error(msg('Este e-mail já pertence a outra conta.', 'Este correo ya pertenece a otra cuenta.'));
            }
            const usuario = lista.find(u => u.id === atual.id);
            Object.assign(usuario, {
                nome: (dados.nome ?? usuario.nome).trim(),
                email,
                telefone: String(dados.telefone ?? usuario.telefone).replace(/\D/g, ''),
                nacionalidade: (dados.nacionalidade ?? usuario.nacionalidade).trim(),
            });
            if (dados.senha) usuario.senhaHash = await hash(dados.senha);
            if ('foto' in dados) usuario.foto = dados.foto;
            salvarUsuarios(lista);
            return semSenha(usuario);
        },

        // Recuperação de senha em duas etapas (recuperarSenha → redefinirSenha)
        iniciarRecuperacao(email) {
            if (!CM.emailCadastrado(email)) throw new Error(msg('Não encontramos uma conta com este e-mail.', 'No encontramos una cuenta con este correo.'));
            sessionStorage.setItem(CHAVE_RECUPERACAO, normalizarEmail(email));
        },

        emailEmRecuperacao() {
            return sessionStorage.getItem(CHAVE_RECUPERACAO);
        },

        async redefinirSenha(novaSenha) {
            const email = CM.emailEmRecuperacao();
            if (!email) throw new Error(msg('Informe seu e-mail novamente.', 'Ingresa tu correo de nuevo.'));
            const lista = usuarios();
            const usuario = lista.find(u => u.email === email);
            usuario.senhaHash = await hash(novaSenha);
            salvarUsuarios(lista);
            sessionStorage.removeItem(CHAVE_RECUPERACAO);
        },

        // Páginas que exigem login mandam o visitante para o login e voltam depois
        exigirLogin() {
            if (CM.estaLogado()) return true;
            const voltar = location.pathname.split('/').pop() + location.search + location.hash;
            location.replace('logar.html?voltar=' + encodeURIComponent(voltar));
            return false;
        },

        destinoAposLogin() {
            const voltar = new URLSearchParams(location.search).get('voltar');
            // Só aceita páginas internas do próprio site
            return voltar && /^[\w-]+\.html([?#].*)?$/.test(voltar) ? voltar : 'index.html';
        },

        // Reduz a foto para caber no localStorage (máx. 256px)
        redimensionarFoto(arquivo, tamanho = 256) {
            return new Promise((resolve, reject) => {
                if (!/^image\/(png|jpe?g|webp)$/.test(arquivo.type)) {
                    return reject(new Error(msg('Use uma imagem JPG, PNG ou WEBP.', 'Usa una imagen JPG, PNG o WEBP.')));
                }
                if (arquivo.size > 5 * 1024 * 1024) return reject(new Error(msg('A imagem deve ter no máximo 5 MB.', 'La imagen debe tener como máximo 5 MB.')));
                const img = new Image();
                img.onload = () => {
                    const lado = Math.min(img.width, img.height);
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = tamanho;
                    canvas.getContext('2d').drawImage(
                        img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, tamanho, tamanho);
                    URL.revokeObjectURL(img.src);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                img.onerror = () => reject(new Error(msg('Não foi possível ler a imagem.', 'No fue posible leer la imagen.')));
                img.src = URL.createObjectURL(arquivo);
            });
        },
    };

    window.CM = CM;
})();
