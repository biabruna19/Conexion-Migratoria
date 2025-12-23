<?php
session_start(); // Certifique-se de iniciar a sessão
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifique se o ID do usuário está definido na sessão
    if (!isset($_SESSION['user_id'])) {
        die("Erro: Usuário não autenticado.");
    }

    $userId = $_SESSION['user_id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $nacionalidade = $_POST['nacionalidade'];
    $senha = $_POST['senha']; // Senha sem hash

    // Atualizar os dados no banco de dados
    $sql = "UPDATE tbUsuarios SET nomeUsuario = ?, emailUsuario = ?, telefoneUsuario = ?, nacionalidadeUsuario = ?, senhaUsuario = ? WHERE idUsuario = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("sssssi", $nome, $email, $telefone, $nacionalidade, $senha, $userId);

    if ($stmt->execute()) {
        // Exibe um alerta e redireciona para a página de perfil
        echo "<script>
            alert('Alterações feitas com sucesso!');
            window.location.href = 'pg-perfil.php';
        </script>";
    } else {
        echo "<script>
            alert('Erro ao atualizar os dados. Por favor, tente novamente.');
            window.location.href = 'perfil.php';
        </script>";
    }

    $stmt->close();
    $conexao->close();
}
?>