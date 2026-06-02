<?php
require 'config.php';

$sql = "INSERT INTO tbusuarios (nomeUsuario, emailUsuario, telefoneUsuario, nacionalidadeUsuario, senhaUsuario, conf_senha) 
        VALUES ('Felipe', 'fsantosrei@gmail.com', '11914780524', 'Brasileiro', '123', '123')";

try {
    $conexao->exec($sql);
    echo "Usuário inserido com sucesso no Supabase!\n";
} catch (PDOException $e) {
    echo "Erro ao inserir usuário: " . $e->getMessage() . "\n";
}
?>
