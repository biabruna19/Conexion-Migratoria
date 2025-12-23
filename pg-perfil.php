<?php
// Inicia a sessão para armazenar dados temporariamente
session_start();

// Conexão com o banco de dados
$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'dbcm';

$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($conn->connect_error) {
    die("<script>alert('Conexão falhou: " . $conn->connect_error . "');</script>");
}

// Verifica se o ID do usuário está definido na sessão
if (!isset($_SESSION['user_id'])) {
    echo "<script>alert('Erro: Usuário não autenticado.');</script>";
    exit();
}

$idUsuario = $_SESSION['user_id'];

// Diretório de upload
$upload_dir = 'uploads/';

// Verifica se houve um envio de arquivo
if (isset($_FILES['profile_picture'])) {
    $file_name = basename($_FILES['profile_picture']['name']);
    $target_file = $upload_dir . $file_name;
    $upload_ok = true;
    $image_file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Verifica se o arquivo é uma imagem
    $check = getimagesize($_FILES['profile_picture']['tmp_name']);
    if ($check === false) {
        echo "<script>alert('O arquivo não é uma imagem.');</script>";
        $upload_ok = false;
    }

    // Limita o tamanho do arquivo (2MB)
    if ($_FILES['profile_picture']['size'] > 2000000) {
        echo "<script>alert('Desculpe, o arquivo é muito grande.');</script>";
        $upload_ok = false;
    }

    // Permite apenas certos tipos de arquivo
    if ($image_file_type != "jpg" && $image_file_type != "jpeg" && $image_file_type != "png") {
        echo "<script>alert('Desculpe, apenas arquivos JPG, JPEG e PNG são permitidos.');</script>";
        $upload_ok = false;
    }

    // Se tudo estiver correto, tenta fazer o upload
    if ($upload_ok) {
        // Exclui a imagem antiga, se existir
        $query = "SELECT profile_picture_path FROM tbUsuarios WHERE idUsuario = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $stmt->bind_result($old_image);
        if ($stmt->fetch() && file_exists($old_image)) {
            unlink($old_image);
        }
        $stmt->close();

        // Move a nova imagem para o diretório
        if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $target_file)) {
            // Atualiza o caminho da imagem no banco de dados
            $query = "UPDATE tbUsuarios SET profile_picture_path = ? WHERE idUsuario = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("si", $target_file, $idUsuario);
            if ($stmt->execute()) {
                $_SESSION['profile_picture'] = $target_file;
            } else {
                echo "<script>alert('Erro ao salvar a imagem no banco de dados.');</script>";
            }
            $stmt->close();
        } else {
            echo "<script>alert('Desculpe, houve um erro ao enviar seu arquivo.');</script>";
        }
    }
}

// Lógica para excluir a imagem quando solicitado
if (isset($_POST['delete_image'])) {
    $query = "SELECT profile_picture_path FROM tbUsuarios WHERE idUsuario = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->bind_result($image_path);
    if ($stmt->fetch() && file_exists($image_path)) {
        unlink($image_path);
        // Remove o caminho da imagem do banco de dados
        $query = "UPDATE tbUsuarios SET profile_picture_path = NULL WHERE idUsuario = ?";
        $stmt->close();
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        unset($_SESSION['profile_picture']);
    }
    $stmt->close();
}

// Carrega o caminho da imagem do banco de dados na sessão
$query = "SELECT profile_picture_path FROM tbUsuarios WHERE idUsuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$stmt->bind_result($profile_picture);
if ($stmt->fetch()) {
    $_SESSION['profile_picture'] = $profile_picture;
}
$stmt->close();
?>



<?php
include_once('config.php');

// Verifica se o ID do usuário está na sessão
if (!isset($_SESSION['user_id'])) {
    die("Erro: ID do usuário não encontrado na sessão.");
}

$idUsuario = $_SESSION['user_id'];

// Consulta ao banco de dados
$stmt = $conn->prepare("SELECT idUsuario, nomeUsuario, emailUsuario, telefoneUsuario, nacionalidadeUsuario, senhaUsuario FROM tbUsuarios WHERE idUsuario = ?");
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
} else {
    $user = null; // Usuário não encontrado
}

$stmt->close();
$conn->close();
?>



<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexión Migratoria - Perfil</title>

    <link rel="stylesheet" href="./css/perfil.css">
    <link rel="stylesheet" href="./css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="./img/ico-CM.ico">
    <link rel="stylesheet" href="./css/nav-footer.css">

</head>

<body>

    <script>window.gtranslateSettings = {"default_language":"pt","detect_browser_language":true,"languages":["pt","es"],"wrapper_selector":".gtranslate_wrapper","flag_size":48,"alt_flags":{"pt":"brazil"}}</script>
    <script src="https://cdn.gtranslate.net/widgets/latest/flags.js" defer></script>

    <nav>
        <div class="alinhar">
            <div class="logos">
                <a href="./homeLogada.php"><img src="./img/logo-branca Conexión Migratoria.png"></a>
            </div>
            <div class="links-nav">
                <ul>
                    <a href="./homeLogada.php#mapa"><li>MAPA INTERATIVO</li></a>
                    <a href="./homeLogada.php#leis"><li>LEIS E DOCUMENTOS</li></a>
                    <a href="./homeLogada.php#leis"><li>EMPREGABILIDADE</li></a>
                    <a href="./homeLogada.php#leis"><li>CURSOS</li></a>
                    <a href="./homeLogada.php#noticias"><li>NOTÍCIAS</li></a>
                </ul>
        
                <div class="traduçao">
                    <div class="gtranslate_wrapper">
                    </div>
                </div>
        
                <div class="user"> 
                    <a href=""><img src="<?php echo isset($_SESSION['profile_picture']) ? $_SESSION['profile_picture'] : './img/do-utilizador.png'; ?>" alt=""></a>
                </div>
            </div>
    
            <div class="menu-hamburguer"  id="menuHamburguer">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    
    <script>
        document.getElementById('menuHamburguer').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('backMenuMobile').classList.toggle('active');
    });
    </script>
        
        <div class="movendo-gradient"></div>
        
    </nav>

<section>










    <h1>Perfil do Imigrante</h1>

    <div class="container">
        <div class="alinar-1">
            <div class="inputs-image">
                <h1><?php echo htmlspecialchars($user["nomeUsuario"]); ?></h1>
                <div>
                    <form action="" method="post" class="excluir-foto">
                        <button type="submit" name="delete_image" class="">
                            <img src="./img/lixeira-de-reciclagem.png" alt="Excluir Foto">
                        </button>
                    </form>
                    <img class="foto-perfil" src="<?php echo isset($_SESSION['profile_picture']) ? $_SESSION['profile_picture'] : './img/perfil-de-usuario.png'; ?>" alt="Foto de Perfil">
                </div>
                <!-- Formulário de Upload de Imagem -->
                <form action="" method="post" enctype="multipart/form-data" class="upload-ft">
                    <label for="profile_picture" style="display:none;">
                        <input type="file" name="profile_picture" id="profile_picture" onchange="this.form.submit()">
                    </label>
                    <button type="button" onclick="document.getElementById('profile_picture').click()">Upload foto</button>
                </form>
            </div>
        </div>

        <div class="alinar-2">
            <div class="inputs-infos">
                <div class="pt-perfil">
                    <div class="ali-tlt">
                        <div class="titulo-infos-perfil">
                            <h1>Informações de usuário</h1>
                        </div>
                        <div class="editar" onclick="toggleEditMode(this)">
                            <a><img src="./img/editar.png" alt="Editar" id="editarIcone"></a>
                            <p id="editarTexto">Editar</p>
                        </div>
                    </div>
                    <form action="salvar_dados.php" method="POST" id="formDados">
                        <div class="infos-perfil">
                            <div class="infos-perfil-alinhar">
                                <div>
                                    <h2>Nome</h2>
                                    <input type="text" name="nome" id="nomeInput" value="<?php echo htmlspecialchars($user["nomeUsuario"]); ?>" readonly>
                                </div>
                                <div>
                                    <h2>E-mail</h2>
                                    <input type="text" name="email" id="emailInput" value="<?php echo htmlspecialchars($user["emailUsuario"]); ?>" readonly>
                                </div>
                            </div>

                            <div class="infos-perfil-alinhar">
                                <div>
                                    <h2>Telefone</h2>
                                    <input type="text" name="telefone" id="telefoneInput" value="<?php echo htmlspecialchars($user["telefoneUsuario"]); ?>" readonly>
                                </div>
                                <div>
                                    <h2>Nacionalidade</h2>
                                    <input type="text" name="nacionalidade" id="nacionalidadeInput" value="<?php echo htmlspecialchars($user["nacionalidadeUsuario"]); ?>" readonly>
                                </div>
                            </div>

                            <div class="infos-perfil-alinhar">
                                <div>
                                    <h2>Senha</h2>
                                    <input type="text" name="senha" id="senhaInput" value="<?php echo htmlspecialchars($user["senhaUsuario"]); ?>" readonly>
                                </div>
                                <div class="salvar-alt">
                                    <button type="submit" id="salvarButton" disabled>SALVAR ALTERAÇÕES</button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="sair-caonta">
                        <form action="logout.php" method="post"><button>SAIR DA MINHA CONTA</button><img src="" alt=""></form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    let originalValues = {};

    function toggleEditMode(button) {
        const isEditing = button.classList.contains("editing");
        const inputs = ['nomeInput', 'emailInput', 'telefoneInput', 'nacionalidadeInput', 'senhaInput'];
        const salvarButton = document.getElementById('salvarButton');

        if (!isEditing) {
            // Salvar valores originais antes de editar
            inputs.forEach(id => {
                const input = document.getElementById(id);
                originalValues[id] = input.value;
                input.removeAttribute('readonly');
                input.style.borderColor = '#1AAADF';
            });
        } else {
            // Restaurar valores originais e desativar edição
            inputs.forEach(id => {
                const input = document.getElementById(id);
                input.value = originalValues[id];
                input.setAttribute('readonly', true);
                input.style.border = '1px solid #ccc';
            });
        }

        // Alternar o estado do botão de salvar
        salvarButton.disabled = isEditing;

        const icon = document.getElementById("editarIcone");
        const text = document.getElementById("editarTexto");

        if (isEditing) {
            icon.src = "./img/editar.png";
            text.innerText = "Editar";
            button.classList.remove("editing");
        } else {
            icon.src = "./img/fechar.png";
            text.innerText = "Cancelar";
            button.classList.add("editing");
        }
    }
</script>

</section>















</body>
</html>