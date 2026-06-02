document.addEventListener('DOMContentLoaded', () => {

    // Check auth on protected pages
    const protectedPages = ['homeLogada.html', 'pg-perfil.html', 'pg-cursos.html', 'pg-empregos.html', 'leis.html', 'pg-estados.html'];
    const isProtected = protectedPages.some(page => window.location.pathname.includes(page));
    const user = JSON.parse(localStorage.getItem('user'));

    if (isProtected && !user) {
        window.location.href = 'logar.html';
    }

    // Redirect to homeLogada if trying to access logar or criarConta while logged in
    const authPages = ['logar.html', 'criarConta.html'];
    const isAuthPage = authPages.some(page => window.location.pathname.includes(page));
    
    if (isAuthPage && user) {
        window.location.href = 'homeLogada.html';
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[name="email"]').value;
            const senha = loginForm.querySelector('input[name="senha"]').value;

            if (!email || !senha) {
                alert('Preencha todos os campos!');
                return;
            }

            // Query Supabase
            const { data, error } = await supabase
                .from('tbusuarios')
                .select('*')
                .eq('emailusuario', email)
                .single();

            if (error || !data) {
                alert('Usuário não encontrado!');
                return;
            }

            if (data.senhausuario === senha) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'homeLogada.html';
            } else {
                alert('Senha incorreta!');
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = registerForm.querySelector('input[name="nome"]').value;
            const email = registerForm.querySelector('input[name="email"]').value;
            const telefone = registerForm.querySelector('input[name="telefone"]').value.replace(/\D/g, '');
            const nacionalidade = registerForm.querySelector('input[name="nacionalidade"]').value;
            const senha = registerForm.querySelector('input[name="senha"]').value;
            const conf_senha = registerForm.querySelector('input[name="conf_senha"]').value;

            if (!nome || !email || !telefone || !nacionalidade || !senha || !conf_senha) {
                alert('Todos os campos são obrigatórios!');
                return;
            }

            if (senha !== conf_senha) {
                alert('As senhas não coincidem!');
                return;
            }

            // Check if email or phone exists
            const { data: existingUser } = await supabase
                .from('tbusuarios')
                .select('idusuario')
                .or(`emailusuario.eq.${email},telefoneusuario.eq.${telefone}`);

            if (existingUser && existingUser.length > 0) {
                alert('Este email ou telefone já está registrado!');
                return;
            }

            // Insert
            const { error } = await supabase
                .from('tbusuarios')
                .insert([{
                    nomeusuario: nome,
                    emailusuario: email,
                    telefoneusuario: telefone,
                    nacionalidadeusuario: nacionalidade,
                    senhausuario: senha,
                    conf_senha: conf_senha
                }]);

            if (error) {
                alert('Erro ao criar conta: ' + error.message);
                return;
            }

            alert('Conta criada com sucesso!');
            window.location.href = 'logar.html';
        });
    }

    // Logout handling
    const logoutLinks = document.querySelectorAll('a[href="./logout.php"], a[href="logout.php"], a[id="logoutBtn"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    });

    // Replace PHP links dynamically in case we missed some in HTML files
    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.endsWith('.php')) {
            a.setAttribute('href', href.replace('.php', '.html'));
        }
    });
});
