# Conexión Migratoria

Bem-vindo ao repositório do **Conexión Migratoria**!
Este projeto é um site informativo focado em auxiliar imigrantes na adaptação ao Brasil, oferecendo informações práticas, dicas de empregabilidade, cursos e um mapa interativo.

## 🚀 Tecnologias Utilizadas

Este projeto foi totalmente refatorado para operar como uma aplicação Web Estática moderna e independente de servidores locais como o XAMPP.

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL & Autenticação)
- **Design**: Totalmente responsivo, focado em facilidade de uso e estética limpa.

## ⚙️ Funcionalidades

- Cadastro e Login de usuários integrados ao Supabase.
- Acesso a informações locais através de mapas interativos.
- Diretório de Leis, Documentos, Cursos e dicas de Empregabilidade.
- Perfis de usuário com dados básicos.
- Sistema multi-idioma integrado via GTranslate.

## 🛠️ Como executar o projeto localmente

Como o projeto agora é totalmente estático e consome a API do Supabase, rodá-lo é extremamente simples:

1. Clone o repositório:
   ```bash
   git clone https://github.com/biabruna19/Conexion-Migratoria.git
   ```
2. Abra a pasta do projeto e dê um duplo-clique no arquivo `index.html` ou `logar.html`.
3. *(Recomendado)* Para ter uma experiência melhor e não ter problemas com bloqueios de arquivos locais no navegador (CORS), utilize a extensão **Live Server** no VSCode.
   - Abra o VSCode na pasta do projeto.
   - Instale a extensão "Live Server".
   - Clique em "Go Live" na barra inferior.

Não é mais necessário utilizar o PHP ou o XAMPP! 🎉

## 🔒 Variáveis de Configuração

O arquivo `js/supabase-config.js` já está configurado com a `anon_key` e a URL do Supabase fornecida para este ambiente.

Desenvolvido com 🩵.
