<?php
// Inicia a sessão
session_start();

// Remove todas as variáveis de sessão
session_unset();

// Destroi a sessão atual
session_destroy();

// Exibe um alerta e redireciona o usuário para a página inicial
echo "<script>
    alert('Conta desconectada com sucesso!.');
    window.location.href = 'homeDeslog.php'; // Substitua pelo caminho correto da sua página
</script>";
exit();
?>