# 🎮 DBQuest - Aprenda Banco de Dados de Forma Interativa

Plataforma gamificada de aprendizado de banco de dados com exercícios interativos, sistema de vidas e ranking competitivo.

![DBQuest](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## 📋 Sobre o Projeto

DBQuest é uma aplicação web educacional que transforma o aprendizado de banco de dados em uma experiência gamificada e envolvente. Através de trilhas de aprendizado estruturadas, exercícios práticos e um sistema de progressão, os usuários podem dominar SQL, NoSQL e conceitos fundamentais de banco de dados.

## ✨ Funcionalidades

### 🎯 Sistema de Gamificação
- **Sistema de Vidas**: 5 vidas que se regeneram a cada 4 horas
- **XP e Níveis**: Ganhe experiência ao completar lições
- **Streak**: Mantenha sequências de dias estudando
- **Ranking Global**: Compete com outros usuários

### 📚 Trilhas de Aprendizado
- **SQL Básico**: Fundamentos de consultas e manipulação de dados
- **NoSQL**: Conceitos de bancos não relacionais
- **Modelagem de Dados**: Normalização e design de esquemas

### 🔐 Autenticação
- Login com email/senha
- Login com Google
- Perfil de usuário personalizado

### 📊 Acompanhamento de Progresso
- Dashboard com estatísticas
- Histórico de lições completadas
- Gráficos de evolução

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Firebase (Authentication + Realtime Database)
- **Hospedagem**: GitHub Pages
- **Linguagens**: HTML5, CSS3, JavaScript (ES6+)

## 📁 Estrutura do Projeto

\`\`\`
DBQuest/
├── index.html                 # Página de entrada
├── src/
│   ├── pages/                 # Páginas HTML
│   │   ├── auth.html         # Login/Registro
│   │   ├── home.html         # Página inicial
│   │   ├── lesson.html       # Lições
│   │   ├── ranking.html      # Ranking
│   │   └── profile.html      # Perfil
│   ├── styles/               # Estilos CSS
│   │   ├── global.css
│   │   ├── components/
│   │   └── pages/
│   ├── scripts/              # JavaScript
│   │   ├── app-full.jsx
│   │   ├── icons.js
│   │   ├── utils.js
│   │   └── gamification.js
│   ├── config/
│   │   └── firebase.js       # Configuração Firebase
│   └── data/
│       └── trails.js         # Dados das trilhas
\`\`\`

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge)
- Python 3 (para servidor local)

### Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/brendacalazans/DBQuest.git
cd DBQuest
\`\`\`

2. Inicie um servidor local:
\`\`\`bash
python3 -m http.server 8080
\`\`\`

3. Acesse no navegador:
\`\`\`
http://localhost:8080
\`\`\`

## 🌐 Deploy

O projeto está configurado para deploy no GitHub Pages.

## 🎓 Como Usar

1. **Cadastre-se** ou faça login
2. **Escolha uma trilha** de aprendizado
3. **Complete lições** para ganhar XP
4. **Responda exercícios** para testar conhecimento
5. **Acompanhe seu progresso** no perfil
6. **Compete** no ranking global

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: \`git checkout -b feature/nova-funcionalidade\`
3. Commit suas mudanças: \`git commit -m 'Adiciona nova funcionalidade'\`
4. Push para a branch: \`git push origin feature/nova-funcionalidade\`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Autores


- **Brenda Calazans** - [GitHub](https://github.com/brendacalazans)
- **Maria Silveira** - [GitHub](https://github.com/mayasrl)
- **João Vitor Parolini** - [GitHub](https://github.com/Parolini4)
- **Rebeca Reis** - 
---

**Desenvolvido com ❤️ para tornar o aprendizado de banco de dados mais divertido!**
