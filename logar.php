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
            <a href="./criarConta.php"><button class="creat" id="creat">CRIAR CONTA</button></a>
        </div>

        <div id="login1" class="login1">
            <h1 class="title">FAZER LOGIN</h1>
            <form action="verificarLogin.php" method="POST">
                <div class="input">
                    <img src="./img/do-utilizador.png">
                    <div></div>
                    <input type="email" name="email" placeholder="E-mail">
                </div>
                <div class="input">
                    <img src="./img/cadeado.png">
                    <div></div>
                    <input type="password" name="senha" placeholder="Senha">
                </div>
                <div class="botao">
                    <input type="submit" name="submit" id="submit" value="ENTRAR">
                </div>
            </form>
        </div>
    </section>

</body>
</html>