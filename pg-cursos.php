<?php

session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    echo "<script>alert('Para acessar esta página conecte-se com uma conta'); window.location.href = 'logar.php';</script>";
    exit(); // Corrigido de "saída();" para "exit();"
}

$logado = $_SESSION['user_id']; // Certifique-se de usar o mesmo nome de chave aqui
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexión Migratoria - Home</title>

    <link rel="stylesheet" href="./css/cursos.css">
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
                <a href="./pg-perfil.php"><img src="<?php echo isset($_SESSION['profile_picture']) ? $_SESSION['profile_picture'] : './img/do-utilizador.png'; ?>" alt=""></a>
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

<div class="back-menumobile" id="backMenuMobile">
    <div class="menu-mobile">
        <h1>TRADUZIR</h1>
        
        <div>
            <div class="gtranslate_wrapper">
            </div>
        </div>

        <a href="./logar.php">Fazer Login</a>
    </div>
</div>

<section class="sec1">
    <div class="titulo-sec1">
        <h1>CURSOS PARA IMIGRANTES</h1>
        <p>Oferecemos uma variedade de videoaulas projetadas especialmente para atender às suas necessidades linguísticas. Com conteúdos que variam desde o básico até níveis mais avançados! E ongs que oferecem uma variedade de cursos para que você possa ampliar seus conhecimentos</p>
        <a href="#planos"><button>Ongs disponiveis</button></a>
    </div>

    <div class="info-sec1">
        <div>
            <img src="./img/image-cursos.png">
        </div>
    </div>
</section>

<section class="sec2">

    <div class="container-cards-aulas">

        <div class="card-aulas">
            <div class="pt1">
                <h1>CURSO BÁSICO</h1>
                <img src="./img/img-videosaulas.png">
            </div>
            <div class="linha-card"></div>
            <div class="pt2">
                <h2>Português Essencial</h2>
                <p>Neste nível básico, você aprenderá as estruturas essenciais do português, incluindo cumprimentos, apresentação pessoal, e vocabulário do dia a dia. Nossa abordagem prática e interativa permitirá que você se familiarize, tornando suas interações cotidianas mais confortáveis e eficazes.</p>
                <a href="https://www.youtube.com/watch?v=zd8_NUqoZH4&list=PLJkrSwK-K9zB_9PoZT5Hwb4w8UF0i0uXh" target="_blank"><button>IR PARA VIDEO AULAS</button></a>
            </div>
        </div>

        <div class="card-aulas">
            <div class="pt1">
                <h1>CURSO INTERMEDIÁRIO</h1>
                <img src="./img/img-videosaulas.png">
            </div>
            <div class="linha-card"></div>
            <div class="pt2">
                <h2>Conectando Culturas</h2>
                <p>Se você já possui um conhecimento básico da língua, vamos explorar tópicos mais complexos, como gramática, conversação fluente, e vocabulário específico relacionado a diversos contextos, como trabalho e lazer. Este nível é projetado para fortalecer suas habilidades de comunicação.</p>
                <a href="https://www.youtube.com/watch?v=Rxo6xTWgZGI&list=PLJkrSwK-K9zBj7U-DmdVhZ7kkLdtaK5br" target="_blank"><button>VER MAIS DETALHES</button></a>
            </div>
        </div>

        <div class="card-aulas">
            <div class="pt1">
                <h1>CURSO AVANÇADO</h1>
                <img src="./img/img-videosaulas.png">
            </div>
            <div class="linha-card"></div>
            <div class="pt2">
                <h2>Fluência e Profundidade</h2>
                <p>Neste estágio, nossa missão é aperfeiçoar suas habilidades linguísticas e prepará-lo(a) para situações mais desafiadoras e complexas,Vamos ampliar seu vocabulário e suas capacidades de argumentação.  Além disso, pode praticar e refinar sua habilidade de compreender e responder em diferentes contextos.</p>
                <a href="https://www.youtube.com/watch?v=oziOOkwah2E&list=PLJkrSwK-K9zC0KWa5loqHPm9WpbEV0lQM" target="_blank"><button>VER MAIS DETALHES</button></a>
                <div id="planos"></div>
            </div>
        </div>

    </div>

</section>

<section class="sec3">
    <div class="titulo-sec3">
        <h1>AMPLIE SEUS CONHECIMENTOS!</h1>
        <div></div>
    </div>

    <div class="text-ongs">
        <p>Nesta sessão vamos conctar você a ONGs que oferecem cursos para imigrantes, promovendo inclusão e desenvolvimento por meio de aulas de idiomas, capacitação técnica e workshops culturais. Descubra como participar ou contribuir para essas iniciativas que ajudam a construir uma sociedade mais inclusiva e solidária.</p>
    </div>

    <div class="cards-sec3">
        <div class="card-sec3">
            <div class="valor-card">
                <span>INSTITUO ADUS</span>
                <h1>UNIDOS EM PROL DOS REFUGIADOS NO BRASIL</h1>
            </div>
            <div class="info-card-sec3">
                <div><h1>CURSOS OFRECIDOS</h1></div>
                <div><p>• COSTURA E MODELAGEM</p></div>
                <div><p>• ESTAMPARIA</p></div>
                <div><p>• OFICINA DE PORTUGUÊS</p></div>
                <div><p>• OUTRAS CAPITAÇÕES</p></div>
                <div><p>• EMPREENDEDORISMO</p></div>
                <div class="btns">
                    <a href="https://adus.org.br/programas/cursos-de-idiomas/"><button>VER MAIS</button></a>
                </div>
            </div>
        </div>

        <div class="card-sec3">
            <div class="valor-card">
                <span>CERZINDO</span>
                <h1>ACOLHENDO HISTÓRIAS E TRANSFORMANDO VIDAS¢</h1>
            </div>
            <div class="info-card-sec3">
                <div><h1>CURSOS OFERECIDOS</h1></div>
                <div><p>AULAS DE PORTUGUÊS:</p></div>
                <div><p>• MÓDULO BÁSICO</p></div>
                <div><p>• MÓDULO INTERMEDIÁRIO</p></div>
                <div><p>• MÓDULO AVANÇADO</p></div>
                <div><p>• CURSOS DE IDIOMA</p></div>
                <div class="btns">
                    <a href="https://www.cerzindo.org.br"><button>VER MAIS</button></a>
                </div>
            </div>
        </div>
    </div>
</section>


<div class="div-wavefoot" style="background-color: white;">
    <div class="wave-foot wave1"></div> 
    <div class="wave-foot wave2"></div> 
    <div class="wave-foot wave3"></div> 
    <div class="wave-foot wave4"></div> 
</div>

<footer>

    <div class="cont-foot">
    
        <div class="cont-1-foot">
            <h1>INFORMAÇÕES</h1>
            <div class="infos-footer">
                <div>
                    <h1>Instituição:</h1>
                    <p>Centro Paula Souza | Etec De Carapicuiba - Desenvolvimento de Sistemas</p>
                </div>
    
                <div>
                    <h1>Orientadores:</h1>
                    <p>Wesley Castanha, Luiz Fernando, Luiz Ricardo, Sabrina Cristiana.</p>
                </div>
            </div>
        </div>
    
        <h1>DESENVOLVEDORES</h1>
        <div class="container">
            <div class="container-cards">
            <div class="card-footer">
                <div class="div-img">
                    <img src="./img/Alexia-card.png">
                </div>
                <div class="info-card">
                    <h1>Alexia Vitoria</h1>
                    <p>Redatora de Conteúdo</p>
                </div>
                <div class="rede-socias">
                        <a href="https://www.instagram.com/aalexiav_/" class="insta"><img src="./img/instagram.png"></a>
                        <a href="https://www.instagram.com/aalexiav_/"><p>@aalexiav_</p></a>
                </div>
            </div>
    
            <div class="card-footer">
                <div class="div-img">
                    <img src="./img/Beatriz-card.png">
                </div>
                <div class="info-card">
                    <h1>Beatriz Bruna</h1>
                    <p>Designer</p>
                </div>
                <div class="rede-socias">
                        <a href="https://www.instagram.com/biabruna_/" class="insta"><img src="./img/instagram.png"></a>
                        <a href="https://www.instagram.com/biabruna_/"><p>@biabruna_</p></a>
                </div>
            </div>
    
            <div class="card-footer">
                <div class="div-img">
                    <img src="./img/Evellyn-card2.png">
                </div>
                <div class="info-card">
                    <h1>Evellyn Silva</h1>
                    <p>Redatora de Conteúdo</p>
                </div>
                <div class="rede-socias">
                        <a href="https://www.instagram.com/evee.ws/" class="insta"><img src="./img/instagram.png"></a>
                        <a href="https://www.instagram.com/evee.ws_/"><p>@evee.ws</p></a>
                </div>
            </div>
    
            <div class="card-footer">
                <div class="div-img">
                    <img src="./img/Felipe-card.png">
                </div>
                <div class="info-card">
                    <h1>Felipe Reis</h1>
                    <p>Programador</p>
                </div>
                <div class="rede-socias">
                        <a href="https://www.instagram.com/s4ntk_/" class="insta"><img src="./img/instagram.png"></a>
                        <a href="https://www.instagram.com/s4ntk_/"><p>@s4ntk_</p></a>
                </div>
            </div>
    
            <div class="card-footer">
                <div class="div-img">
                    <img src="./img/Guilherme-card.png">
                </div>
                <div class="info-card">
                    <h1>Guilherme Leandro</h1>
                    <p>Designer</p>
                </div>
                <div class="rede-socias">
                        <a href="https://www.instagram.com/gui.leandrzz/" class="insta"><img src="./img/instagram.png"></a>
                        <a href="https://www.instagram.com/gui.leandrzz/"><p>@gui.leandrzz</p></a>
                </div>
            </div>
        </div>
    
    </div>
    
    </footer>

</body>
</html>