<?php
session_start();

// Verifica se o formulário foi submetido
if (isset($_POST['submit'])) {
    // Verifica se os campos 'email' e 'senha' não estão vazios
    if (!empty($_POST['email']) && !empty($_POST['senha'])) {
        // Inclui o arquivo de configuração do banco de dados
        include_once('config.php');
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        // Usar prepared statements para evitar SQL Injection
        $stmt = $conexao->prepare("SELECT idUsuario, senhaUsuario FROM tbUsuarios WHERE emailUsuario = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // Verifica se o usuário existe no banco de dados
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verificar a senha (use hash para segurança, se aplicável)
            if ($user['senhaUsuario'] === $senha) {
                // Usuário autenticado, armazena o ID do usuário na sessão
                $_SESSION['user_id'] = $user['idUsuario'];
                header('Location: homeLogada.php'); // Redireciona para a página de perfil
                exit();
            } else {
                // Senha inválida
                echo "<script>alert('Senha incorreta!'); window.location.href = 'logar.php';</script>";
                exit();
            }
        } else {
            // Usuário não encontrado
            echo "<script>alert('Usuário não encontrado!'); window.location.href = 'logar.php';</script>";
            exit();
        }
    } else {
        // Campos vazios, redireciona para a página de login
        header('Location: logar.php');
        exit();
    }
}
?>
