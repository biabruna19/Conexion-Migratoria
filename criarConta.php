<?php
if(isset($_POST['submit'])){
    include_once('config.php');

    // Captura os valores dos campos do formulário
    $nome = $_POST['nome'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $nacionalidade = $_POST['nacionalidade'];
    $senha = $_POST['senha'];
    $conf_senha = $_POST['conf_senha'];

    // Verifica se algum campo está vazio
    if(empty($nome) || empty($telefone) || empty($email) || empty($nacionalidade) || empty($senha) || empty($conf_senha)) {
        echo "<script>
                alert('Todos os campos são obrigatórios!');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit; // Interrompe a execução do script caso algum campo esteja vazio
    }

    // Verifica se a senha e a confirmação de senha são iguais
    if($senha !== $conf_senha) {
        echo "<script>
                alert('As senhas não coincidem!');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit;
    }

    // Valida o formato do e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>
                alert('O e-mail fornecido não é válido!');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit;
    }

    // Normaliza o telefone removendo qualquer caractere não numérico
    $telefone = preg_replace('/\D/', '', $telefone);

    // Valida o telefone (exemplo para um número de telefone brasileiro)
    if (strlen($telefone) < 10 || strlen($telefone) > 11) {
        echo "<script>
                alert('O telefone fornecido não é válido! Utilize um número de telefone com 10 ou 11 dígitos.');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit;
    }

    // Verifica se o email ou telefone já estão registrados
    $result_email = mysqli_query($conexao, "SELECT * FROM tbUsuarios WHERE emailUsuario = '$email'");
    $result_telefone = mysqli_query($conexao, "SELECT * FROM tbUsuarios WHERE telefoneUsuario = '$telefone'");

    if(mysqli_num_rows($result_email) > 0) {
        echo "<script>
                alert('Este email já está registrado!');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit; // Impede a execução se o email já existir
    }

    if(mysqli_num_rows($result_telefone) > 0) {
        echo "<script>
                alert('Este telefone já está registrado!');
                window.location.href = 'criarConta.php'; 
              </script>";
        exit; // Impede a execução se o telefone já existir
    }

    // Insere os dados no banco de dados
    $result = mysqli_query($conexao, "INSERT INTO tbUsuarios (nomeUsuario, emailUsuario, telefoneUsuario, nacionalidadeUsuario, senhaUsuario, conf_senha)
    VALUES ('$nome', '$email', '$telefone', '$nacionalidade', '$senha', '$conf_senha')");

    // Redireciona para a página de login após a inserção
    echo "<script>
            window.location.href = 'logar.php';
          </script>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexión Migratoria - Login</title>

    <link rel="stylesheet" href="./css/login.css">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="icon" type="image/x-icon" href="./img/ico-CM.ico">

</head>

    
<body>
    <section>
        <div class="infos">
            <h1>BEM VINDO!</h1>
            <img src="./img/logo-branca Conexión Migratoria.png" alt="">
        </div>

        <div id="login2" class="login2">
            <h1 class="title">CRIAR CONTA</h1>
            <form action="criarConta.php" method="POST">
                <div class="alinhar">
                    <div class="input">
                        <img src="./img/do-utilizador.png">
                        <div></div>
                        <input type="name" name="nome" placeholder="Nome">
                    </div>
                    <div class="input">
                        <img src="./img/o-email.png">
                        <div></div>
                        <input type="email" name="email" placeholder="E-mail">
                    </div>
                </div>

                <div class="alinhar">
                    <div class="input">
                        <img src="./img/telefone.png">
                        <div></div>
                        <input type="tel" name="telefone" placeholder="Telefone">
                    </div>
                    <div class="input">
                        <img src="./img/cidadania.png">
                        <div></div>
                        <input type="text" name="nacionalidade" placeholder="Nacionalidade">
                    </div>
                </div>

                <div class="alinhar">
                    <div class="input">
                        <img src="./img/cadeado.png">
                        <div></div>
                        <input type="password" name="senha" placeholder="Senha">
                    </div>
                    <div class="input">
                        <img src="./img/cadeado.png">
                        <div></div>
                        <input type="password" name="conf_senha" placeholder="Confirmar senha">
                    </div>
                </div>

                <div class="botao">
                    <input type="submit" name="submit" id="submit" value="CRIAR">
                </div>
            </form>
        </div>
    </section>

    <!--<section class="login-mobile">
        <div id="login1mobile" class="login1">
            <img class="logo-mobile" src="./img/logo-branca Conexión Migratoria.png">
            <h1 class="title">FAZER LOGIN</h1>
            <div class="input">
                <img src="./img/do-utilizador.png">
                <div></div>
                <input type="email" placeholder="E-mail">
            </div>
            <div class="input">
                <img src="./img/cadeado.png">
                <div></div>
                <input type="password" placeholder="Senha">
            </div>
            <div class="teste">
                <a href="./home.html"><button class="botao-link">ENTRAR</button></a>
                <a href=""><button class="botao-link" id="creat2">CRIAR CONTA</button></a>
            </div>
        </div>
    </section>-->
















<!---<script>
        document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o link "criar conta"
    var criarContaLink = document.getElementById("creat");

    // Seleciona as divs de inputs
    var entrar = document.querySelector(".login1");
    var criar = document.querySelector(".login2");

    // Esconde a div "inputs2" inicialmente
    criar.style.display = "none";

    // Adiciona um evento de clique ao link "criar conta"
    criarContaLink.addEventListener("click", function(event) {
        // Impede o comportamento padrão de um link (neste caso, ir para uma página em branco)

        // Esconde a div "inputs"
        entrar.style.display = "none";

        // Mostra a div "inputs2"
        criar.style.display = "flex";
    });
});
</script>-->
</body>
</html>