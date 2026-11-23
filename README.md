<div align="center">
  <img src="img/logo-branca-conexion-migratoria.png" width="300" alt="Conexión Migratoria Logo">
  
  # Conexión Migratoria
  
  **O seu portal de auxílio para adaptação no Brasil.**
  
  [**👉 ACESSAR O SITE AGORA 👈**](https://biabruna19.github.io/Conexion-Migratoria/)
</div>

---

O aumento do movimento migratório em várias partes do mundo tem ocorrido com regularidade. Neste espaço, auxiliamos você, imigrante, a se familiarizar com o Brasil de forma rápida e segura.

## 🚀 Funcionalidades

Nosso projeto oferece recursos essenciais para facilitar a integração e o dia a dia de imigrantes recém-chegados:

- 🗺️ **Mapa Interativo**: Localize sua região e obtenha informações sobre infraestrutura, saúde e educação local.
- 📜 **Leis e Documentos**: Guias sobre como regularizar seus documentos, direitos e deveres.
- 💼 **Empregabilidade**: Dicas para currículos, entrevistas de emprego e integração profissional no mercado brasileiro.
- 🎓 **Cursos**: Recomendações de cursos de português e profissionalizantes oferecidos por ONGs e parceiros.
- 🌐 **Tradução Automática**: Suporte nativo para múltiplos idiomas integrado para facilitar a leitura.
- 👤 **Conta e Perfil**: cadastro, login, recuperação de senha, edição de dados e foto de perfil.
- 📱 **Responsivo e acessível**: menu mobile, navegação pelo teclado (inclusive no mapa) e respeito a quem prefere menos animações.

## 🧪 Modo demonstração

Este repositório roda **100% no GitHub Pages, sem servidor e sem banco de dados**, para que qualquer pessoa consiga testar todas as funções:

- O conteúdo dos 27 estados (cultura, pontos turísticos, saúde, ensino e cidades) fica em [`data/estados.js`](data/estados.js), recuperado do banco de dados original do projeto.
- Contas, sessão e foto de perfil ficam salvas **apenas no navegador** de quem está testando (`localStorage`). As senhas são guardadas como hash SHA-256, nunca em texto puro.
- Na tela de login há o botão **"entrar como visitante"**, para conhecer o site sem criar conta.

## 💻 Tecnologias

- **Frontend**: HTML5, CSS3 e JavaScript (Vanilla), sem frameworks.
- **Dados**: conteúdo estático em JavaScript + `localStorage` (modo demonstração).
- **Integrações**: GTranslate (tradução português/espanhol).
- **Histórico**: o projeto nasceu com PHP + MySQL (XAMPP), passou por Supabase e hoje é um site estático.

## 📁 Estrutura

```
├── index.html            # Página inicial com o mapa interativo
├── pg-estados.html       # Página de cada estado (?uf=SP, ?uf=BA...)
├── leis.html             # Leis e documentos
├── pg-empregos.html      # Empregabilidade
├── pg-cursos.html        # Cursos
├── pg-perfil.html        # Perfil do usuário
├── logar.html, criarConta.html, recuperarSenha.html, redefinirSenha.html
├── data/estados.js       # Conteúdo dos 27 estados
├── js/
│   ├── demo-store.js     # Contas e sessão no navegador (modo demonstração)
│   ├── layout.js         # Menu, menu mobile e aviso compartilhados
│   ├── mapa.js           # Mapa interativo
│   ├── estado.js         # Preenche a página de cada estado
│   ├── conta.js          # Login, cadastro e recuperação de senha
│   └── perfil.js         # Página de perfil
├── css/                  # Estilos de cada página + repaginada.css
├── img/                  # Imagens gerais
└── imgs-estado/          # Imagens dos estados (WebP)
```

## 🛠️ Como rodar localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/biabruna19/Conexion-Migratoria.git
   ```
2. Abra o arquivo `index.html` no navegador (dois cliques) ou use a extensão **Live Server** do VS Code.

Não é preciso instalar nada nem configurar banco de dados.

## 👥 Equipe

Projeto desenvolvido em equipe por **Alexia**, **Beatriz**, **Evellyn**, **Felipe** e **Guilherme**.
