(function() {
    const {
        auth, db, onAuthStateChanged, createUserWithEmailAndPassword,
        signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,
        signInWithRedirect, getRedirectResult, // <-- ADICIONE ESTES DOIS
        updateProfile, signOut, ref, onValue, set, update, increment,
        get 
    } = window.FB;
    
    const { useState, useEffect, useCallback, memo, createContext, useContext } = React;
    
    // --- Ícones como Componentes React (Memoizados) ---
    const Trophy = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
    const Star = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
    const Sparkles = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 1.9-1.9-1.9-1.9 1.9-1.9-1.9L2.5 5l1.9 1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9 1.9 1.9 1.9-1.9-1.9-1.9 1.9-1.9-1.9-1.9 1.9-1.9Z"/><path d="M22 12.5 20.1 14.4 22 16.3 20.1 18.2 22 20.1 18.2 20.1 16.3 22 14.4 20.1 12.5 22 12.5 18.2 10.6 20.1 8.7 18.2 10.6 16.3 8.7 14.4 10.6 12.5 8.7 10.6 10.6 8.7 12.5 6.8 14.4 8.7 16.3 10.6 18.2 12.5Z"/></svg>);
    const Flame = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
    const Database = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>);
    const Lock = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
    const Check = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
    const X = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
    const Heart = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
    const HeartCrack = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3 2-2"/></svg>);
    const Gem = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M12 22V9"/><path d="m3.5 8.5 17 0"/></svg>);
    const Award = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);
    const Target = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    const Code = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
    const ChevronRight = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>);
    const ArrowLeft = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
    const BookOpen = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
    const PenTool = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-1.5"/><path d="m2 2 7.586 7.586"/><path d="m11 11 1 1"/></svg>);
    const GraduationCap = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0l8.59-3.9z"/><path d="M6 12v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5"/></svg>);
    const FileText = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
    const Play = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
    const Clock = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
    const User = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
    const Edit2 = memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>); // Novo ícone

  
    const REWARD_CONFIG = {
        lesson: { xp: 20 },
        article: { xp: 30 },
        theory: { xp: 50 },
        practice: { xp: 75 }
    };

    // --- 2. DEFINIÇÃO DAS TRILHAS (MOVIDA PARA CÁ) ---
    const trailsData = [
                {
            id: 'trail1',
            icon: '🚀',
            color: 'from-blue-500 to-cyan-400',
            title: 'Fundamentos de Banco de Dados',
            description: 'Comece do zero e construa uma base sólida.',
            lessons: [
                // Unidade 0: Vídeo
                { 
                    id: 't1-l0', 
                    title: 'Vídeo: Introdução aos Fundamentos', 
                    type: 'lesson', 
                    videoId: 'qup2BdIl_d8', // ID do link do seu doc 
                    duration: '5 min', 
                    xp: REWARD_CONFIG.lesson.xp 
                },
                // Unidade 1: Artigo SGBD
                { 
                    id: 't1-l1-article', 
                    title: 'Resumo: O Coração do Sistema (SGBD)', 
                    type: 'article',
                    duration: '7 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'O banco de dados em si é o "fichário" ou a "biblioteca" onde os dados são fisicamente armazenados. Mas quem opera essa biblioteca? Esse é o trabalho do SGBD (Sistema de Gerenciamento de Banco de Dados).\n\nO SGBD é o software, o "cérebro" ou o "bibliotecário" que recebe os seus pedidos, guarda as informações com segurança e as busca quando você precisa. Ele atua como uma interface entre o usuário e o banco de dados.\n\nSuas principais funções incluem:\n• Armazenamento e Recuperação de Dados\n• Segurança (Controla quem pode acessar o quê)\n• Integridade dos Dados (Garante que os dados sejam válidos, ex: idade não pode ser negativa)\n• Concorrência (Permite múltiplos acessos ao mesmo tempo sem corromper dados)\n• Recuperação de Falhas (Restaura o banco após uma queda de energia, por exemplo)\n\nExemplos de SGBDs Populares: MySQL, PostgreSQL, Oracle Database, SQL Server e SQLite.' // Baseado no Doc 
                },
                // Unidade 1: Teste SGBD
                { 
                    id: 't1-l1-theory', 
                    title: 'Teste: O Papel do SGBD', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'A analogia do SGBD como um “bibliotecário digital” é usada porque ele:', options: ['Apenas armazena livros e artigos em formato digital.', 'Precisa de uma conexão de internet de alta velocidade.', 'Gerencia a organização, o acesso, a segurança e a recuperação dos dados.', 'Converte automaticamente dados físicos em digitais.'], correct: 2, explanation: 'A função principal do SGBD é gerenciar a organização, acesso, segurança e recuperação dos dados, assim como um bibliotecário.' },
                        { question: 'Quais são duas funções essenciais de um SGBD (além de armazenar)?', options: ['Edição de código-fonte e compilação.', 'Controle de concorrência e recuperação de falhas.', 'Criação de interfaces gráficas e gerenciamento de rede.', 'Formatação de disco e instalação de drivers.'], correct: 1, explanation: 'Controle de concorrência (acesso simultâneo) e recuperação de falhas são funções essenciais de um SGBD.' },
                        { question: 'Qual função do SGBD é fundamental se o sistema cair por uma queda de energia?', options: ['Concorrência', 'Segurança', 'Recuperação de falhas', 'Armazenamento'], correct: 2, explanation: 'A recuperação de falhas restaura o banco de dados a um estado consistente após um erro.' },
                        { question: 'Quais dos seguintes são exemplos de SGBDs populares?', options: ['Microsoft Excel e Google Sheets', 'MySQL e Microsoft SQL Server', 'Adobe Photoshop e GIMP', 'Windows Server e Linux Ubuntu'], correct: 1, explanation: 'MySQL e SQL Server são SGBDs amplamente utilizados, enquanto os outros são planilhas, editores de imagem ou sistemas operacionais.' }
                    ] // Perguntas baseadas na Unidade 1 do Doc 
                },
                // Unidade 2: Artigo SQL
                { 
                    id: 't1-l2-article', 
                    title: 'Resumo: A Língua Universal (SQL)', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Para conversar com o "bibliotecário" (o SGBD), você precisa de uma linguagem que ele entenda. Essa linguagem é o SQL (Structured Query Language).\n\nO SQL é dividido em subconjuntos:\n• DDL (Data Definition Language): Usada para definir a estrutura (ex: CREATE TABLE, ALTER TABLE, DROP TABLE).\n• DML (Data Manipulation Language): Usada para manipular os dados dentro das tabelas (ex: INSERT, UPDATE, DELETE).\n• DCL (Data Control Language): Usada para gerenciar permissões (ex: GRANT, REVOKE).\n• TCL (Transaction Control Language): Usada para gerenciar transações (ex: COMMIT, ROLLBACK).' // Baseado no Doc 
                },
                // Unidade 2: Teste SQL (Perguntas novas, pois o doc repetiu)
                { 
                    id: 't1-l2-theory', 
                    title: 'Teste: Comandos SQL', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual subconjunto do SQL é usado para CRIAR ou DELETAR tabelas?', options: ['DML', 'DCL', 'TCL', 'DDL'], correct: 3, explanation: 'DDL (Data Definition Language) é usada para definir a estrutura, o que inclui criar (CREATE) e deletar (DROP) tabelas.' },
                        { question: 'O comando `INSERT` pertence a qual subconjunto do SQL?', options: ['DML', 'DDL', 'DCL', 'TCL'], correct: 0, explanation: 'DML (Data Manipulation Language) é usada para manipular os dados, o que inclui inserir (INSERT) novas linhas.' },
                        { question: 'Para salvar permanentemente uma transação, qual comando TCL você usaria?', options: ['GRANT', 'ROLLBACK', 'COMMIT', 'UPDATE'], correct: 2, explanation: 'O comando COMMIT (parte do TCL) é usado para salvar as mudanças de uma transação permanentemente.' }
                    ]
                },
                // Unidade 3: Artigo Modelo Relacional
                { 
                    id: 't1-l3-article', 
                    title: 'Resumo: Organização (Modelo Relacional)', 
                    type: 'article',
                    duration: '7 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Focamos nos Bancos de Dados Relacionais, que organizam os dados em Tabelas (similares a planilhas).\n\nA estrutura de uma Tabela é dividida em:\n• Colunas (Atributos): As categorias de informação (ex: "Nome", "Email").\n• Linhas (Registros/Tuplas): O conjunto de informações sobre um único item (ex: os dados de um cliente específico).\n\nPara que as tabelas possam se relacionar, usamos chaves:\n• Chave Primária (Primary Key - PK): É o identificador único de cada linha (ex: ID_Cliente). Não pode ter valores duplicados e não pode ser nula.\n• Chave Estrangeira (Foreign Key - FK): É a "cola" que conecta as tabelas. É uma coluna em uma tabela que faz referência à Chave Primária de outra tabela (ex: a coluna ID_Cliente na tabela Pedidos).' // Baseado no Doc 
                },
                // Unidade 3: Teste Modelo Relacional
                { 
                    id: 't1-l3-theory', 
                    title: 'Teste: Chaves e Relações', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'No modelo relacional, a estrutura (planilha) e os "cabeçalhos" são chamados de:', options: ['Linha e Tabela', 'Tabela e Coluna', 'Dado e Linha', 'Coluna e Chave'], correct: 1, explanation: 'A estrutura principal é a Tabela, e seus "cabeçalhos" (categorias) são as Colunas.' },
                        { question: 'Qual afirmação sobre Chaves é VERDADEIRA?', options: ['PK pode ter valores repetidos.', 'FK conecta duas tabelas referenciando uma PK.', 'Uma tabela pode ter várias PKs.', 'PK é usada apenas para ordenar dados.'], correct: 1, explanation: 'A Chave Estrangeira (FK) é a "cola" que conecta tabelas, referenciando a Chave Primária (PK) de outra.' },
                        { question: 'O que acontece se você tentar inserir um ID_Cliente em Pedidos que não existe na tabela Clientes?', options: ['Cria um novo cliente automaticamente.', 'A inserção falha (violação de integridade referencial).', 'O campo ID_Cliente fica nulo.', 'O SGBD permite, mas marca como "inválido".'], correct: 1, explanation: 'Isso é uma violação da integridade referencial. O SGBD rejeita a inserção para manter os dados consistentes.' }
                    ] // Perguntas baseadas na Unidade 3 do Doc 
                },
                // Unidade 4: Artigo SELECT
                { 
                    id: 't1-l4-article', 
                    title: 'Resumo: Seu Primeiro Comando (SELECT)', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'O comando fundamental para recuperar dados é o SELECT.\n\nPara ver todo o conteúdo (todas as colunas) de uma tabela, você usa o asterisco (*):\n`SELECT * FROM clientes;`\n\nSe você não precisa de tudo, pode especificar as colunas, o que é uma boa prática para otimizar o desempenho:\n`SELECT Nome, Email FROM clientes;`\n\nEste comando diz ao SGBD: "Mostre-me apenas as colunas Nome e Email a partir da tabela clientes".' // Baseado no Doc 
                },
                // Unidade 5: Artigo Casos de Uso
                { 
                    id: 't1-l5-article', 
                    title: 'Resumo: Casos de Uso Reais', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Bancos de dados são a espinha dorsal da infraestrutura digital moderna.\n\nEm um E-commerce (como a Amazon), o SGBD gerencia:\n• Catálogo de Produtos (preços, estoque, avaliações)\n• Informações de Clientes (histórico de compras, endereços)\n• Pedidos (status, pagamento)\n• Logística (rastreamento, armazéns)\n\nEm um Sistema Bancário, o SGBD garante:\n• Transações Financeiras (depósitos, saques, saldos corretos)\n• Dados de Clientes (proteção de informações sensíveis)\n• Auditoria (registro detalhado de todas as operações)\n\nO SQL é a ferramenta que permite que analistas e desenvolvedores interajam com esses sistemas, seja para analisar vendas, inserir novos usuários em um app, ou atualizar o status de um pedido.' // Baseado no Doc 
                },
                // Unidade 6: Artigo Mais SQL
                { 
                    id: 't1-l6-article', 
                    title: 'Resumo: Comandos Essenciais (DML)', 
                    type: 'article',
                    duration: '7 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Além de consultar, você precisa manipular os dados:\n\n• WHERE: Filtra os registros. É como pedir livros de um autor específico.\n`SELECT * FROM clientes WHERE Cidade = \'São Paulo\';`\n\n• ORDER BY: Ordena os resultados.\n`SELECT Nome, Cidade FROM clientes ORDER BY Nome ASC;` (ordem alfabética)\n\n• LIMIT: Restringe o número de linhas retornadas.\n`SELECT Nome, Preco FROM produtos ORDER BY Preco DESC LIMIT 3;` (Top 3 mais caros)\n\n• INSERT INTO: Adiciona novos registros (linhas).\n`INSERT INTO clientes (Nome, Email) VALUES (\'Daniel\', \'daniel.p@email.com\');`\n\n• UPDATE: Modifica registros existentes. (CUIDADO: Use WHERE!)\n`UPDATE clientes SET Email = \'ana.novo@email.com\' WHERE ID_Cliente = 1;`\n\n• DELETE FROM: Remove registros. (CUIDADO MÁXIMO: Use WHERE!)\n`DELETE FROM clientes WHERE ID_Cliente = 3;`' // Baseado no Doc 
                },
                // Unidade 4, 5, 6: Teste
                { 
                    id: 't1-l6-theory', 
                    title: 'Teste: DQL e DML', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Para ver TODAS as colunas da tabela `clientes`, qual a sintaxe correta?', options: ['SELECT clientes FROM *;', 'SELECT * FROM clientes;', 'GET * FROM clientes;', 'SELECT ALL FROM clientes;'], correct: 1, explanation: '`SELECT *` significa "selecionar todas as colunas". `FROM clientes` especifica a tabela.' },
                        { question: 'Qual cláusula você usaria para encontrar apenas clientes que moram em "São Paulo"?', options: ['LIMIT \'São Paulo\'', 'ORDER BY Cidade = \'São Paulo\'', 'WHERE Cidade = \'São Paulo\'', 'GROUP BY \'São Paulo\''], correct: 2, explanation: 'A cláusula WHERE é usada para filtrar os registros com base em uma condição.' },
                        { question: 'Em um e-commerce, qual é uma prioridade do SGBD, segundo o texto?', options: ['O histórico de navegação anônimo.', 'A consistência entre o estoque real e o estoque no sistema.', 'As cores e fontes do site.', 'O número de "likes" de um produto.'], correct: 1, explanation: 'Garantir a consistência dos dados, como o estoque, é uma função crucial do SGBD.' }
                    ] // Perguntas baseadas nas Unidades 4, 5, 6 do Doc 
                },
                // Exercícios Práticos (separados em lições individuais)
                { 
                    id: 't1-p1', 
                    title: 'Prática: Consulta Simples', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes` (colunas: ID_Cliente, Nome, Sobrenome, Email, Cidade). Escreva o comando para visualizar todas as colunas e todos os registros da tabela `clientes`.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Sobrenome VARCHAR(50),\n  Email VARCHAR(100),\n  Cidade VARCHAR(50)\n);',
                    correctQuery: 'SELECT * FROM clientes;',
                    queryParts: ['SELECT', '*', 'FROM', 'clientes', ';'] 
                },
                { 
                    id: 't1-p2', 
                    title: 'Prática: Consulta Específica', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para selecionar apenas as colunas `Nome` e `Email` de todos os clientes.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Email VARCHAR(100)\n);',
                    correctQuery: 'SELECT Nome, Email FROM clientes;',
                    queryParts: ['SELECT', 'Nome', ',', 'Email', 'FROM', 'clientes', ';'] 
                },
                { 
                    id: 't1-p3', 
                    title: 'Prática: Filtro Simples (WHERE)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para selecionar todos os dados dos clientes onde a `Cidade` seja exatamente \'São Paulo\'.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Cidade VARCHAR(50)\n);',
                    correctQuery: 'SELECT * FROM clientes WHERE Cidade = \'São Paulo\';',
                    queryParts: ['SELECT', '*', 'FROM', 'clientes', 'WHERE', 'Cidade', '=', "'São Paulo'", ';'] 
                },
                { 
                    id: 't1-p4', 
                    title: 'Prática: Ordenação e Limite', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `produtos` (colunas: Nome, Preco). Escreva o comando para selecionar o `Nome` e o `Preco` dos produtos, ordenados do mais caro para o mais barato (DESC), e limitar o resultado aos 3 primeiros.',
                    schema: 'CREATE TABLE produtos (\n  ID_Produto INT,\n  Nome VARCHAR(100),\n  Preco DECIMAL(10, 2)\n);',
                    correctQuery: 'SELECT Nome, Preco FROM produtos ORDER BY Preco DESC LIMIT 3;',
                    queryParts: ['SELECT', 'Nome', ',', 'Preco', 'FROM', 'produtos', 'ORDER BY', 'Preco', 'DESC', 'LIMIT', '3', ';'] 
                },
                { 
                    id: 't1-p5',
                    title: 'Prática: Inserção (INSERT)',
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Tabela: `clientes`. Escreva o comando para inserir um novo cliente: ID 4, Nome 'Daniel', Sobrenome 'Pereira', Email 'daniel.p@email.com', Cidade 'Curitiba'.",
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Sobrenome VARCHAR(50),\n  Email VARCHAR(100),\n  Cidade VARCHAR(50)\n);',
                    correctQuery: "INSERT INTO clientes (ID_Cliente, Nome, Sobrenome, Email, Cidade) VALUES (4, 'Daniel', 'Pereira', 'daniel.p@email.com', 'Curitiba');",
                    queryParts: ['INSERT INTO', 'clientes', '(', 'ID_Cliente', ',', 'Nome', ',', 'Sobrenome', ',', 'Email', ',', 'Cidade', ')', 'VALUES', '(', '4', ',', "'Daniel'", ',', "'Pereira'", ',', "'daniel.p@email.com'", ',', "'Curitiba'", ')', ';'] 
                },
                { 
                    id: 't1-p6',
                    title: 'Prática: Atualização (UPDATE)',
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para atualizar o `Email` para \'ana.costa.novo@email.com\', especificamente para o cliente com `ID_Cliente` igual a 1.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Email VARCHAR(100)\n);',
                    correctQuery: 'UPDATE clientes SET Email = \'ana.costa.novo@email.com\' WHERE ID_Cliente = 1;',
                    queryParts: ['UPDATE', 'clientes', 'SET', 'Email', '=', "'ana.costa.novo@email.com'", 'WHERE', 'ID_Cliente', '=', '1', ';']
                },
                { 
                    id: 't1-p7',
                    title: 'Prática: Deleção (DELETE)',
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para deletar o registro da tabela `clientes` onde o `ID_Cliente` seja 4.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50)\n);',
                    correctQuery: 'DELETE FROM clientes WHERE ID_Cliente = 4;',
                    queryParts: ['DELETE FROM', 'clientes', 'WHERE', 'ID_Cliente', '=', '4', ';'] 
                }
            ]
        },
                {
            id: 'trail2',
            icon: '📐', // Ícone para "Arquitetura" ou "Modelagem"
            color: 'from-purple-500 to-indigo-400', // Reutilizando a cor da trilha 2
            title: 'Modelagem e Normalização',
            description: 'Aprenda a arquitetar bancos de dados eficientes.',
            lessons: [
                // Unidade 0: Introdução
                { 
                    id: 't2-l0-article', 
                    title: 'Resumo: O que é Modelagem de Dados?', 
                    type: 'article',
                    duration: '3 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Antes de construir um prédio, você precisa de uma Planta Baixa Oficial. A Modelagem de Dados é exatamente isso: a arte de desenhar o mapa do seu "mundo de dados", definindo as estruturas e como elas se conectarão, antes de escrever qualquer código.\n\nÉ a fase conceitual e lógica onde se planeja como os dados serão armazenados, organizados e relacionados para atender aos requisitos de um sistema.\n\Uma boa modelagem de dados é crucial porque ela impacta diretamente a performance, a escalabilidade, a integridade e a facilidade de manutenção do banco de dados. Um projeto bem modelado evita redundâncias, inconsistências e problemas de desempenho no futuro.'
                },
                { 
                    id: 't2-l0-video', 
                    title: 'Vídeo: A Planta Baixa dos Dados', 
                    type: 'lesson', 
                    videoId: 'E24jFtgNroM', 
                    duration: '6 min', 
                    xp: REWARD_CONFIG.lesson.xp 
                },
                { 
                    id: 't2-l0-theory', 
                    title: 'Teste: Fundamentos da Modelagem', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'O texto compara a Modelagem de Dados a uma "Planta Baixa Oficial" porque ela:', options: ['Define as cores e o design visual do sistema final.', 'É a arte de desenhar o mapa dos dados, definindo estruturas e conexões antes de codificar.', 'Determina qual linguagem de programação será usada.', 'Foca apenas na performance e velocidade do banco de dados.'], correct: 1, explanation: 'A modelagem é a "planta baixa" que define a estrutura e as conexões dos dados antes da codificação.' },
                        { question: 'Qual é a principal função da modelagem de dados?', options: ['Definir a aparência visual do sistema.', 'Otimizar a navegação entre páginas de um site.', 'Organizar como os dados serão armazenados, organizados e relacionados.', 'Escrever os primeiros códigos SQL do projeto.'], correct: 2, explanation: 'A função principal é planejar a organização e o relacionamento dos dados.' },
                        { question: 'Segundo o texto, uma boa modelagem de dados é crucial para evitar problemas futuros, como:', options: ['Falhas de rede e lentidão de internet.', 'Redundâncias, inconsistências e problemas de desempenho.', 'Baixa resolução de imagem no aplicativo.', 'Erros de sintaxe na linguagem de programação.'], correct: 1, explanation: 'Uma boa modelagem evita redundância, inconsistência e problemas de performance.' }
                    ]
                },

                // Unidade 1: Blocos de Construção
                { 
                    id: 't2-l1-article', 
                    title: 'Resumo: Blocos de Construção', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'A modelagem se baseia em três conceitos:\n\n**Entidades (Os Edifícios):** São as "coisas" ou "conceitos" principais que você quer guardar informações (ex: Cliente, Produto, Aluno). Elas se tornarão Tabelas no banco de dados.\n\n**Atributos (As Características):** São as propriedades que descrevem uma entidade (ex: Nome, Email, Preço). Elas se tornarão Colunas na tabela.\n\n**Relacionamentos (As Estradas):** Definem como as entidades interagem (ex: Um Cliente *faz* um Pedido). Eles conectam as tabelas.\n\nPara visualizar isso, usamos um Diagrama Entidade-Relacionamento (DER), que é a "planta baixa" visual do banco de dados.'
                },
                { 
                    id: 't2-l1-theory', 
                    title: 'Teste: Blocos de Construção', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Em um sistema escolar, "Aluno", "Professor" e "Disciplina" são exemplos de:', options: ['Atributos', 'Entidades', 'Relacionamentos', 'Chaves Primárias'], correct: 1, explanation: 'Entidades são os "substantivos" ou conceitos principais do sistema, como Aluno, Professor e Disciplina.' },
                        { question: 'As características que descrevem uma entidade, como "Nome" e "Email" para um "Cliente", são chamadas de:', options: ['Atributos', 'Entidades', 'Relacionamentos', 'Chaves Estrangeiras'], correct: 0, explanation: 'Atributos são as propriedades ou características que descrevem uma entidade.' },
                        { question: 'No banco de dados final, as Entidades e os Atributos se materializam, respectivamente, como:', options: ['Colunas e Tabelas', 'Tabelas e Colunas', 'Tabelas e Relacionamentos', 'Colunas e Chaves'], correct: 1, explanation: 'A entidade (ex: Cliente) vira uma Tabela, e os atributos (ex: Nome, Email) viram Colunas.' },
                        { question: 'O que representa um "Relacionamento" na modelagem de dados?', options: ['O identificador único de uma tabela.', 'A descrição detalhada de uma entidade.', 'A conexão lógica ou interação entre duas ou mais entidades.', 'O diagrama visual que mostra o banco de dados.'], correct: 2, explanation: 'Relacionamentos são os "verbos" que conectam as entidades, como "Cliente FAZ Pedido".' }
                    ]
                },

                // Unidade 2: Chaves
                { 
                    id: 't2-l2-article', 
                    title: 'Resumo: As Chaves do Reino (PK e FK)', 
                    type: 'article',
                    duration: '7 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Chaves são a espinha dorsal dos relacionamentos.\n\n**Chave Primária (Primary Key - PK):** É o identificador único e exclusivo de cada linha (ex: `id_cliente`). Ela não pode ter valores duplicados e não pode ser nula (NOT NULL). Pense nela como o CPF de um registro.\n\n**Chave Estrangeira (Foreign Key - FK):** É a "cola" que conecta as tabelas. É uma coluna em uma tabela que faz referência à Chave Primária de outra tabela (ex: a coluna `id_cliente` na tabela `Pedidos`).\n\nA FK garante a **Integridade Referencial**, que impede a criação de "registros órfãos" (como um Pedido que aponta para um Cliente que não existe).'
                },
                { 
                    id: 't2-l2-theory', 
                    title: 'Teste: Chaves e Integridade', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual é a definição correta de uma Chave Primária (PK)?', options: ['Uma coluna que armazena nomes de clientes.', 'Uma coluna que conecta duas tabelas diferentes.', 'Uma coluna (ou conjunto) que serve como identificador único e exclusivo para cada linha da tabela.', 'Uma coluna que pode ter valores repetidos, mas não nulos.'], correct: 2, explanation: 'A PK é o identificador único e exclusivo de uma linha (registro).' },
                        { question: 'Uma das características essenciais que uma Chave Primária (PK) deve ter é:', options: ['Deve ser um texto longo.', 'Deve permitir valores duplicados.', 'Deve ser "Não Nula" (NOT NULL).', 'Deve ser sempre um número.'], correct: 2, explanation: 'A Chave Primária deve ser única e não nula (NOT NULL).' },
                        { question: 'Qual é a principal função da Chave Estrangeira (FK)?', options: ['Garantir que cada linha da tabela seja única.', 'Ser a "cola" que conecta tabelas, fazendo referência à Chave Primária de outra tabela.', 'Armazenar dados calculados.', 'Ser o atributo principal de uma entidade.'], correct: 1, explanation: 'A FK é a "cola" que estabelece o vínculo entre tabelas, referenciando uma PK.' },
                        { question: 'Na relação Clientes e Pedidos, a tabela Pedidos possui uma coluna id_cliente. Esta coluna é uma:', options: ['Chave Primária (PK)', 'Chave Estrangeira (FK)', 'Entidade', 'Dependência Transitiva'], correct: 1, explanation: 'A coluna `id_cliente` na tabela Pedidos é uma Chave Estrangeira que aponta para a PK da tabela Clientes.' },
                        { question: 'O que é "Integridade Referencial"?', options: ['Impede que existam "registros órfãos" (como um pedido sem cliente).', 'Garante que todas as tabelas tenham o mesmo número de colunas.', 'Garante que os dados sejam armazenados em ordem alfabética.', 'Impede que a Chave Primária seja um número.'], correct: 0, explanation: 'Integridade Referencial é a regra que impede que uma FK aponte para um registro que não existe, evitando "registros órfãos".' }
                    ]
                },

                // Unidade 3: Cardinalidade
                { 
                    id: 't2-l3-article', 
                    title: 'Resumo: Regras de Trânsito (Cardinalidade)', 
                    type: 'article',
                    duration: '7 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Cardinalidade define as "regras de trânsito" de como as tabelas se conectam.\n\n**Um-para-Muitos (1:N):** O tipo mais comum. (Ex: Um Cliente pode ter Muitos Pedidos). A Chave Estrangeira (FK) é sempre colocada na tabela do lado "Muitos" (N). (Ex: `id_cliente` fica na tabela `Pedidos`).\n\n**Muitos-para-Muitos (N:M):** (Ex: Um Aluno cursa Muitas Disciplinas; Uma Disciplina tem Muitos Alunos). Este relacionamento não pode ser implementado diretamente.\n\n**Solução N:M:** Cria-se uma **Tabela de Ligação** (ex: `Matriculas`) que atua como uma "rotatória", quebrando o N:M em dois relacionamentos 1:N. Esta tabela conterá as FKs de ambas as tabelas (ex: `id_aluno` e `id_disciplina`).\n\n**Um-para-Um (1:1):** O tipo menos comum. (Ex: Um Funcionário tem um Detalhe_Funcionario). Geralmente usado para separar dados sensíveis ou opcionais.'
                },
                { 
                    id: 't2-l3-theory', 
                    title: 'Teste: Cardinalidade e Tabelas de Ligação', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'O que a "Cardinalidade" define?', options: ['O número total de tabelas.', 'O número de instâncias (registros) de uma entidade que podem se associar a instâncias de outra.', 'O número de colunas que uma entidade pode ter.', 'A velocidade máxima da conexão.'], correct: 1, explanation: 'Cardinalidade define as regras numéricas do relacionamento (quantos registros se conectam a quantos).' },
                        { question: 'Em um relacionamento Um-para-Muitos (1:N), como "Cliente (1) faz Pedidos (N)", onde a FK deve ficar?', options: ['Na tabela do lado "1" (Clientes).', 'Na tabela do lado "N" (Pedidos).', 'Em ambas as tabelas.', 'Em uma tabela de ligação separada.'], correct: 1, explanation: 'A Chave Estrangeira (FK) é sempre colocada na tabela do lado "Muitos" (N).' },
                        { question: 'Qual relacionamento exige uma "Tabela de Ligação"?', options: ['Um-para-Um (1:1)', 'Um-para-Muitos (1:N)', 'Muitos-para-Muitos (N:M)', 'Um-para-Nenhum (1:0)'], correct: 2, explanation: 'Relacionamentos Muitos-para-Muitos (N:M) não podem ser implementados diretamente e exigem uma tabela de ligação.' },
                        { question: 'Como implementar a relação N:M "Aluno cursa Disciplinas"?', options: ['Colocando a FK de Disciplina em Aluno.', 'Colocando a FK de Aluno em Disciplina.', 'Criando uma tabela de ligação "Matricula" com as FKs de Aluno e Disciplina.', 'Permitindo que a coluna id_disciplina armazene múltiplos valores.'], correct: 2, explanation: 'Uma tabela de ligação (ex: Matricula) é criada contendo as FKs de ambas as tabelas (id_aluno, id_disciplina) para resolver o N:M.' }
                    ]
                },

                // Unidade 4: Normalização
                { 
                    id: 't2-l4-article', 
                    title: 'Resumo: A Arte de Organizar (Normalização)', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Normalização é o processo de organizar tabelas para minimizar a redundância (repetição) de dados e melhorar a integridade.\n\n**Primeira Forma Normal (1FN):** Garante que todos os atributos sejam "atômicos". (Ex: Não armazenar \'Notebook, Mouse\' em uma única célula. Você deve separar em linhas diferentes em uma tabela de ligação).\n\n**Segunda Forma Normal (2FN):** Resolve a "dependência parcial". (Ex: Em uma tabela `Itens_Pedido (id_pedido, id_produto)`, o `nome_produto` não pode estar ali, pois ele depende apenas do `id_produto`. Ele deve ir para a tabela `Produtos`).\n\n**Terceira Forma Normal (3FN):** Resolve a "dependência transitiva". (Ex: Em uma tabela `Clientes (id_cliente, nome, nome_cidade, estado)`, o `estado` depende do `nome_cidade`, que depende do `id_cliente`. Isso é transitivo. A solução é criar uma tabela `Cidades` separada).\n\n**Benefícios:** Redução da redundância e melhora da integridade dos dados.'
                },
                { 
                    id: 't2-l4-theory', 
                    title: 'Teste: Formas Normais', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual é o objetivo principal da Normalização de dados?', options: ['Aumentar a redundância para facilitar consultas rápidas.', 'Minimizar a redundância de dados e melhorar a integridade.', 'Tornar o banco de dados visualmente mais bonito.', 'Garantir que todas as tabelas tenham pelo menos 10 colunas.'], correct: 1, explanation: 'O objetivo principal é minimizar a redundância (repetição) e melhorar a integridade dos dados.' },
                        { question: 'A Primeira Forma Normal (1FN) exige que:', options: ['Todas as tabelas tenham uma Chave Estrangeira.', 'Todos os atributos sejam "atômicos" (indivisíveis).', 'O banco de dados esteja totalmente livre de redundâncias.', 'Não existam relacionamentos do tipo 1:N.'], correct: 1, explanation: '1FN exige que todos os atributos sejam atômicos, ou seja, não contenham múltiplos valores em uma única célula.' },
                        { question: 'Qual problema a Segunda Forma Normal (2FN) resolve?', options: ['Impede dependências transitivas.', 'Impede atributos multivalorados.', 'Impede que atributos não-chave dependam apenas de *parte* de uma Chave Primária composta.', 'Impede o uso de Chaves Estrangeiras.'], correct: 2, explanation: '2FN foca em chaves primárias compostas, garantindo que todos os atributos dependam da chave inteira, não de apenas parte dela.' },
                        { question: 'Uma "dependência transitiva" (resolvida pela 3FN) ocorre quando:', options: ['Um atributo não-chave depende de outro atributo não-chave, em vez de depender da PK.', 'Uma tabela depende de si mesma.', 'Uma Chave Estrangeira aponta para a Chave Primária errada.', 'A tabela possui múltiplos valores em uma única coluna.'], correct: 0, explanation: 'Dependência transitiva é quando um atributo não-chave depende de outro atributo não-chave (ex: Estado depende de Cidade, que depende do id_cliente).' },
                        { question: 'Na tabela `Clientes(id_cliente [PK], nome, id_cidade, nome_cidade, estado)`, a dependência `id_cliente -> id_cidade -> estado` é um exemplo de:', options: ['Primeira Forma Normal (1FN)', 'Chave Estrangeira (FK)', 'Dependência Transitiva (problema da 3FN)', 'Cardinalidade (1:N)'], correct: 2, explanation: 'Este é um exemplo clássico de dependência transitiva, onde `estado` depende de `id_cidade`, que por sua vez depende da PK `id_cliente`.' },
                        { question: 'Quais são os benefícios diretos da Normalização?', options: ['Aumento da velocidade da internet.', 'Redução da redundância, melhora da integridade dos dados e maior flexibilidade.', 'Aumento do espaço de armazenamento.', 'Eliminação total da necessidade de usar Chaves Estrangeiras.'], correct: 1, explanation: 'A normalização reduz a redundância, melhora a integridade e torna o banco de dados mais flexível.' }
                    ]
                },

                // Unidade 5: Exercícios Práticos
                { 
                    id: 't2-p1', 
                    title: 'Prática: Testando Chave Primária (PK)', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `Clientes (id_cliente PK, nome, email)`. Tente inserir \'Carla Dias\' com `id_cliente` 2, que já está em uso.',
                    schema: 'CREATE TABLE Clientes (\n  id_cliente INT PRIMARY KEY,\n  nome VARCHAR(100),\n  email VARCHAR(100)\n);',
                    correctQuery: 'INSERT INTO Clientes (id_cliente, nome, email) VALUES (2, \'Carla Dias\', \'carla@email.com\');',
                    queryParts: ['INSERT INTO', 'Clientes', '(', 'id_cliente', ',', 'nome', ',', 'email', ')', 'VALUES', '(', '2', ',', "'Carla Dias'", ',', "'carla@email.com'", ')', ';']
                },
                { 
                    id: 't2-p2', 
                    title: 'Prática: Testando Chave Estrangeira (FK)', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabelas: `Clientes (id_cliente PK)` e `Pedidos (id_cliente FK)`. Tente inserir um pedido para o `id_cliente` 5, que não existe.',
                    schema: 'CREATE TABLE Clientes (\n  id_cliente INT PRIMARY KEY\n);\nCREATE TABLE Pedidos (\n  id_pedido INT PRIMARY KEY,\n  data_pedido DATE,\n  id_cliente INT,\n  FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)\n);',
                    correctQuery: 'INSERT INTO Pedidos (id_pedido, data_pedido, id_cliente) VALUES (102, \'2023-10-27\', 5);',
                    queryParts: ['INSERT INTO', 'Pedidos', '(', 'id_pedido', ',', 'data_pedido', ',', 'id_cliente', ')', 'VALUES', '(', '102', ',', "'2023-10-27'", ',', '5', ')', ';']
                },
                { 
                    id: 't2-p3', 
                    title: 'Prática: Consultando Relação 1:N (JOIN)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabelas: `Clientes` e `Pedidos`. Escreva um `SELECT` que junte as tabelas e mostre o `nome` do cliente e a `data_pedido`.',
                    schema: 'CREATE TABLE Clientes (\n  id_cliente INT PRIMARY KEY,\n  nome VARCHAR(100)\n);\nCREATE TABLE Pedidos (\n  id_pedido INT PRIMARY KEY,\n  data_pedido DATE,\n  id_cliente INT\n);',
                    correctQuery: 'SELECT T1.nome, T2.data_pedido FROM Clientes AS T1 JOIN Pedidos AS T2 ON T1.id_cliente = T2.id_cliente;',
                    queryParts: ['SELECT', 'T1.nome', ',', 'T2.data_pedido', 'FROM', 'Clientes', 'AS T1', 'JOIN', 'Pedidos', 'AS T2', 'ON', 'T1.id_cliente', '=', 'T2.id_cliente', ';']
                },
                { 
                    id: 't2-p4', 
                    title: 'Prática: Inserindo em Tabela de Ligação (N:M)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabelas: `Alunos`, `Disciplinas`, `Matriculas`. Insira um registro em `Matriculas` para ligar o aluno 1 à disciplina 11.',
                    schema: 'CREATE TABLE Alunos (id_aluno INT PRIMARY KEY);\nCREATE TABLE Disciplinas (id_disciplina INT PRIMARY KEY);\nCREATE TABLE Matriculas (\n  id_aluno INT,\n  id_disciplina INT\n);',
                    correctQuery: 'INSERT INTO Matriculas (id_aluno, id_disciplina) VALUES (1, 11);',
                    queryParts: ['INSERT INTO', 'Matriculas', '(', 'id_aluno', ',', 'id_disciplina', ')', 'VALUES', '(', '1', ',', '11', ')', ';']
                },
                { 
                    id: 't2-p5', 
                    title: 'Prática: Consultando Relação N:M (JOIN Triplo)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabelas: `Alunos`, `Disciplinas`, `Matriculas`. Escreva um `SELECT` que mostre o `nome_aluno` e o `nome_disciplina`.',
                    schema: 'CREATE TABLE Alunos (id_aluno INT, nome_aluno VARCHAR(100));\nCREATE TABLE Disciplinas (id_disciplina INT, nome_disciplina VARCHAR(100));\nCREATE TABLE Matriculas (id_aluno INT, id_disciplina INT);',
                    correctQuery: 'SELECT T1.nome_aluno, T3.nome_disciplina FROM Alunos AS T1 JOIN Matriculas AS T2 ON T1.id_aluno = T2.id_aluno JOIN Disciplinas AS T3 ON T2.id_disciplina = T3.id_disciplina;',
                    queryParts: ['SELECT', 'T1.nome_aluno', ',', 'T3.nome_disciplina', 'FROM', 'Alunos', 'AS T1', 'JOIN', 'Matriculas', 'AS T2', 'ON', 'T1.id_aluno', '=', 'T2.id_aluno', 'JOIN', 'Disciplinas', 'AS T3', 'ON', 'T2.id_disciplina', '=', 'T3.id_disciplina', ';']
                },
                { 
                    id: 't2-p6', 
                    title: 'Prática: O Problema da 1FN (LIKE)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `Pedidos_Nao_Normalizados (produtos)`. Escreva um `SELECT` para encontrar pedidos que contenham \'Teclado\'.',
                    schema: 'CREATE TABLE Pedidos_Nao_Normalizados (\n  id_pedido INT,\n  id_cliente INT,\n  produtos VARCHAR(255)\n);',
                    correctQuery: 'SELECT * FROM Pedidos_Nao_Normalizados WHERE produtos LIKE \'%Teclado%\';',
                    queryParts: ['SELECT', '*', 'FROM', 'Pedidos_Nao_Normalizados', 'WHERE', 'produtos', 'LIKE', "'%Teclado%'", ';']
                },
                { 
                    id: 't2-p7', 
                    title: 'Prática: Anomalia da 3FN (UPDATE)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `Clientes_Nao_3FN`. O estado de \'São Paulo\' mudou a sigla para \'SP-BR\'. Escreva o `UPDATE` para corrigir isso.',
                    schema: 'CREATE TABLE Clientes_Nao_3FN (\n  id_cliente INT,\n  nome VARCHAR(100),\n  id_cidade INT,\n  nome_cidade VARCHAR(100),\n  estado VARCHAR(2)\n);',
                    correctQuery: 'UPDATE Clientes_Nao_3FN SET estado = \'SP-BR\' WHERE nome_cidade = \'São Paulo\';',
                    queryParts: ['UPDATE', 'Clientes_Nao_3FN', 'SET', 'estado', '=', "'SP-BR'", 'WHERE', 'nome_cidade', '=', "'São Paulo'", ';']
                },
                
                // Unidade 7: Resumo Final
                { 
                    id: 't2-l5-review', 
                    title: 'Revisão: A Planta Baixa Completa', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: 'Antes de construir um prédio, você precisa de uma Planta Baixa Oficial. A Modelagem de Dados é exatamente isso: a arte de desenhar o mapa do seu "mundo de dados", definindo as estruturas e como elas se conectarão, antes de escrever qualquer código.\n\n**1. Blocos de Construção da Arquitetura**\nA modelagem define três conceitos principais:\n• Entidades (Os Edifícios): As "coisas" ou "conceitos" principais que você quer guardar (ex: Cliente, Produto, Pedido). Entidades se tornam tabelas.\n• Atributos (As Características): As propriedades de uma entidade (ex: para o Cliente, os atributos são Nome, Email, Endereço). Atributos se tornam colunas.\n• Relacionamentos (As Estradas): A forma como as entidades interagem (ex: um Cliente faz um Pedido).\n\n**2. As Chaves do Reino (Identificação)**\nPara que os relacionamentos funcionem, precisamos de um sistema de códigos infalível.\n• Chave Primária (PK): É o identificador único e exclusivo de cada linha (ex: CPF). Deve ser única e nunca nula.\n• Chave Estrangeira (FK): É a "cola" que conecta as tabelas. É a cópia da PK de uma tabela, inserida como coluna em outra para criar o vínculo (ex: `id_cliente` na tabela `pedidos`).\n\n**3. As Regras de Trânsito (Cardinalidade)**\nA cardinalidade define as regras de negócio:\n• Um-para-Muitos (1:N): O tipo mais comum. (Ex: Um cliente faz muitos pedidos). A FK é colocada na tabela do lado "Muitos" (pedidos).\n• Muitos-para-Muitos (N:M): (Ex: Um pedido tem muitos produtos). Para resolver isso, cria-se uma Tabela de Ligação (como `itens_pedido`), que atua como uma "rotatória", contendo as FKs de ambas as tabelas.\n\n**4. Normalização: Organização e Integridade**\nNormalização é o processo de organizar as tabelas para evitar a repetição de dados (redundância) e garantir a integridade. A ideia é simples: garantir que cada tabela trate de apenas um assunto.\n\n**5. O Mapa Visual (DER)**\nO Diagrama de Entidade-Relacionamento (DER) é a "planta baixa" visual que mostra todas as tabelas, seus atributos e as regras de cardinalidade.'
                }
            ]
        },
                
// 1. COLE ESTE NOVO MÓDULO "SQL INTERMEDIÁRIO" AQUI
        {
            id: 'trail3',
            icon: '⚡', // Novo ícone para "SQL na Prática"
            color: 'from-green-500 to-emerald-400', // Nova cor
            title: 'SQL na Prática',
            description: 'Domine a linguagem SQL com desafios do mundo real.',
            lessons: [
                // --- UNIDADE 0 ---
                { 
                    id: 't3-l0-video', 
                    title: 'Vídeo: Introdução ao SQL na Prática', 
                    type: 'lesson', 
                    videoId: 'nTrI9HiuzSE',
                    duration: '4 min', 
                    xp: REWARD_CONFIG.lesson.xp 
                },
                { 
                    id: 't3-l0-theory', 
                    title: 'Teste: Conceitos DQL e DML', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'A SQL é usada principalmente para:', options: ['Controlar redes de computadores.', 'Interagir com bancos de dados para consultar e manipular informações.', 'Criar interfaces gráficas.', 'Configurar servidores web.'], correct: 1, explanation: "SQL é a ferramenta essencial para interagir com bancos de dados, permitindo consultar (DQL) e manipular (DML) informações." },
                        { question: 'Qual a diferença entre DQL e DML?', options: ['DQL define a estrutura (CREATE TABLE) e DML manipula (INSERT).', 'DQL recupera dados (SELECT) e DML modifica dados (INSERT, UPDATE, DELETE).', 'DQL é para consultas rápidas (SELECT) e DML é para consultas lentas (JOIN).', 'DQL é para administradores (GRANT) e DML é para usuários (SELECT).'], correct: 1, explanation: "DQL (Data Query Language) foca em recuperar dados com SELECT, enquanto DML (Data Manipulation Language) modifica dados com INSERT, UPDATE, e DELETE." }
                    ]
                },
                // --- UNIDADE 1 ---
                { 
                    id: 't3-l1-article', 
                    title: 'Resumo: Consultando Dados (DQL)', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "A Data Query Language (DQL) é a parte do SQL dedicada à recuperação de dados. O comando SELECT é o coração da DQL. A consulta fundamental é O QUÊ (SELECT), DE ONDE (FROM) e COM QUAIS CONDIÇÕES (WHERE).\n\n•SELECT: Especifica quais colunas você deseja ver.\n•FROM: Indica de qual tabela os dados serão recuperados.\n•WHERE: É a cláusula utilizada para filtrar as linhas.\n\nRefinando o Filtro:\n•AND/OR/NOT: Permitem combinar múltiplas condições.\n•LIKE: Usado para buscar padrões em texto, com '%' (zero ou mais) e '_' (um) caracteres.\n\nOrganizando e Resumindo:\n•ORDER BY: Classifica os resultados (ASC/DESC).\n•Funções de Agregação: Realizam cálculos (COUNT, SUM, AVG, MAX, MIN).\n•GROUP BY: Agrupa linhas para aplicar funções de agregação a cada grupo.\n•HAVING: Filtra os grupos criados pelo GROUP BY (diferente do WHERE, que filtra linhas individuais)."
                },
                { 
                    id: 't3-l1-theory', 
                    title: 'Teste: DQL (SELECT, WHERE, GROUP BY)', 
                    type: 'theory',
                    duration: '7 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual é a estrutura de uma consulta básica para filtrar dados?', options: ['SELECT colunas WHERE condição FROM tabela;', 'SELECT * FROM tabela ORDER BY condição;', 'SELECT colunas FROM tabela WHERE condição;', 'FROM tabela SELECT colunas LIMIT condição;'], correct: 2, explanation: "A ordem correta é SELECT (colunas) , FROM (tabela), e depois WHERE (condição). " },
                        { question: "Para quais produtos a condição WHERE categoria = 'Eletrônicos' AND estoque < 20 retornaria TRUE?", options: ["Um produto de 'Acessórios' com estoque 10.", "Um produto 'Eletrônico' com estoque 15.", "Um produto 'Eletrônico' com estoque 25.", "Qualquer produto com estoque 15."], correct: 1, explanation: "O operador AND exige que AMBAS as condições (categoria = 'Eletrônicos' E estoque < 20) sejam verdadeiras." },
                        { question: 'Para quais produtos a condição WHERE preco < 100.00 OR estoque > 50 retornaria TRUE?', options: ['Um produto de R$ 150,00 com estoque 20.', 'Apenas produtos que custam menos de R$ 100,00.', 'Um produto de R$ 150,00 com estoque 70 (pois uma condição é verdadeira).', 'Apenas produtos que atendem às duas condições simultaneamente.'], correct: 2, explanation: "O operador OR exige que APENAS UMA das condições (preco < 100 OU estoque > 50) seja verdadeira." },
                        { question: "O que faz o operador LIKE 'M%'?", options: ["Procura por produtos que contenham a letra 'M' em qualquer lugar.", "Procura por produtos que terminem com a letra 'M'.", "Procura por produtos que tenham 'M' como a segunda letra.", "Procura por produtos cujo nome começa com a letra 'M'."], correct: 3, explanation: "O caractere curinga '%' representa zero ou mais caracteres, então 'M%' busca qualquer texto que comece com 'M'." },
                        { question: 'A cláusula ORDER BY serve para:', options: ['Agrupar dados.', 'Filtrar linhas.', 'Classificar os resultados (ex: do menor para o maior).', 'Contar registros.'], correct: 2, explanation: 'ORDER BY é usado para classificar os resultados, seja em ordem ascendente (ASC) ou descendente (DESC).' },
                        { question: 'Qual função de agregação é usada para calcular a média de uma coluna numérica?', options: ['COUNT()', 'SUM()', 'MAX()', 'AVG()'], correct: 3, explanation: 'AVG() é a função de agregação padrão para calcular a média (average) de valores numéricos.' },
                        { question: 'Qual é a diferença entre WHERE e HAVING?', options: ['WHERE filtra colunas e HAVING filtra linhas.', 'WHERE é usado para números e HAVING é usado para texto.', 'WHERE e HAVING são idênticos e podem ser trocados.', 'WHERE filtra linhas antes do agrupamento (GROUP BY), e HAVING filtra os grupos depois do agrupamento.'], correct: 3, explanation: 'WHERE atua em linhas individuais antes do GROUP BY; HAVING atua sobre os grupos resultantes das funções de agregação.' }
                    ]
                },
                // --- UNIDADE 2 ---
                { 
                    id: 't3-l2-article', 
                    title: 'Resumo: Conectando Dados (JOINs)', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "JOINs são operações fundamentais no SQL para ligar os pontos entre as tabelas relacionadas.\n\n•INNER JOIN: Retorna apenas as linhas que têm valores correspondentes (o 'amigo em comum') em ambas as tabelas. Registros sem correspondência são excluídos.\n\n•LEFT JOIN: Retorna todas as linhas da tabela da 'esquerda', e as correspondentes da 'direita'. Se não houver correspondência, as colunas da direita terão valores NULL. É crucial para encontrar dados 'ausentes' (como clientes que nunca compraram).\n\n•RIGHT JOIN: Oposto do LEFT JOIN. Retorna todas as linhas da tabela da 'direita' e as correspondentes da 'esquerda'. Colunas da esquerda ficarão NULL se não houver correspondência.\n\n•FULL JOIN: Combina os resultados de LEFT e RIGHT JOIN. Retorna todas as linhas de ambas as tabelas; colunas ficam NULL onde não há correspondência.\n\n•JOINs em Cadeia: Múltiplos JOINs em sequência para conectar três ou mais tabelas (ex: Clientes -> Pedidos -> Itens_Pedido -> Produtos)."
                },
                { 
                    id: 't3-l2-theory', 
                    title: 'Teste: JOINs (INNER, LEFT, RIGHT, FULL)', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual é a principal finalidade de um JOIN?', options: ['Acelerar a velocidade de consultas SELECT *.', 'Excluir dados de múltiplas tabelas ao mesmo tempo.', 'Combinar informações de duas ou mais tabelas baseando-se em colunas relacionadas (como PK e FK).', 'Criar novas tabelas baseadas em filtros WHERE.'], correct: 2, explanation: "JOINs são usados para combinar informações de tabelas que se relacionam, geralmente através de chaves Primárias (PK) e Estrangeiras (FK)." },
                        { question: 'O INNER JOIN retorna:', options: ['Todas as linhas das duas tabelas, mesmo sem correspondência.', 'Apenas as linhas que possuem valores correspondentes em ambas as tabelas.', 'Somente as linhas da tabela da esquerda (a primeira).', 'Todas as linhas da tabela da direita (a segunda).'], correct: 1, explanation: "O INNER JOIN retorna apenas o 'amigo em comum', ou seja, registros que têm correspondência em ambas as tabelas." },
                        { question: 'Qual é a diferença entre um LEFT JOIN e um RIGHT JOIN?', options: ['LEFT JOIN é mais rápido que RIGHT JOIN.', 'LEFT JOIN retorna todos os registros da tabela da esquerda (e os correspondentes da direita), enquanto RIGHT JOIN retorna todos da direita (e os correspondentes da esquerda).', 'LEFT JOIN usa a PK e RIGHT JOIN usa a FK.', 'Não há diferença; são sinônimos.'], correct: 1, explanation: "LEFT JOIN prioriza a tabela da esquerda (retornando todos os seus registros), e RIGHT JOIN prioriza a da direita." },
                        { question: 'Qual JOIN retornaria todos os clientes (mesmo os sem pedidos) e todos os pedidos (mesmo os sem clientes)?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'], correct: 3, explanation: 'O FULL JOIN combina os resultados de um LEFT JOIN e um RIGHT JOIN, incluindo registros sem correspondência de ambos os lados.' },
                        { question: "O que é um 'JOIN em Cadeia' (encadeamento de joins)?", options: ['Um JOIN que se auto-referencia na mesma tabela.', 'O uso de múltiplos JOINs em sequência para conectar três ou mais tabelas (ex: Clientes -> Pedidos -> Itens_Pedido -> Produtos).', 'Um JOIN que usa a cláusula WHERE para filtrar.', 'Um nome antigo para o FULL JOIN.'], correct: 1, explanation: "É a prática de usar múltiplos JOINs em sequência para conectar uma cadeia de tabelas relacionadas." }
                    ]
                },
                // --- UNIDADE 3 ---
                { 
                    id: 't3-l3-article', 
                    title: 'Resumo: Manipulando Dados (DML)', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "A Data Manipulation Language (DML) é responsável por adicionar (INSERT), modificar (UPDATE) e remover (DELETE) dados.\n\n•INSERT INTO: Adiciona novas linhas (registros) a uma tabela. A forma mais segura é especificar explicitamente as colunas (ex: INSERT INTO Clientes (coluna1, ...)).\n\n•UPDATE: Modifica dados existentes. Atenção crítica: Use SEMPRE a cláusula WHERE para especificar quais linhas alterar. Sem ela, você altera toda a tabela.\n\n•DELETE FROM: Remove registros permanentemente. Atenção máxima: Use SEMPRE a cláusula WHERE. Sem ela, você apaga toda a tabela.\n\n•Regra da Dependência: Ao deletar dados com FKs, você deve apagar primeiro os dados das tabelas 'filhas' (com a FK) antes de apagar os dados da tabela 'mãe' (com a PK) para manter a integridade referencial."
                },
                { 
                    id: 't3-l3-theory', 
                    title: 'Teste: DML (INSERT, UPDATE, DELETE)', 
                    type: 'theory',
                    duration: '7 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Quais são os três principais comandos da DML?', options: ['CREATE, ALTER, DROP', 'SELECT, FROM, WHERE', 'INSERT, UPDATE, DELETE', 'JOIN, GROUP BY, ORDER BY'], correct: 2, explanation: 'Os comandos DML são INSERT, UPDATE e DELETE, usados para manipular os dados.' },
                        { question: 'Qual é a forma mais segura e recomendada de usar INSERT INTO?', options: ['Omitir a lista de colunas e fornecer valores para tudo.', 'Especificar explicitamente as colunas nas quais os dados serão inseridos (ex: INSERT INTO Clientes (coluna1, coluna2)...).', 'Usar INSERT INTO e WHERE ao mesmo tempo.', 'Inserir dados de múltiplas tabelas de uma só vez.'], correct: 1, explanation: 'Especificar as colunas é a forma mais segura, pois evita erros se a ordem das colunas mudar.' },
                        { question: "Qual comando alteraria a cidade do cliente com ID 4 para 'Curitiba'?", options: ["INSERT INTO Clientes SET cidade = 'Curitiba' WHERE id_cliente = 4;", "SELECT Clientes SET cidade = 'Curitiba' WHERE id_cliente = 4;", "UPDATE Clientes SET cidade = 'Curitiba' WHERE id_cliente = 4;", "UPDATE Clientes WHERE id_cliente = 4 SET cidade = 'Curitiba';"], correct: 2, explanation: 'A sintaxe correta é UPDATE [tabela] SET [coluna=valor] WHERE [condição].' },
                        { question: 'Por que a cláusula WHERE é fundamental nos comandos UPDATE e DELETE?', options: ['Ela acelera a velocidade da consulta.', 'Sem ela, o comando será aplicado a todas as linhas da tabela, causando perda de dados em massa.', 'Ela é opcional e serve apenas para organizar o resultado.', 'Ela garante que a tabela esteja na Terceira Forma Normal (3FN).'], correct: 1, explanation: 'Sem a cláusula WHERE, o UPDATE ou DELETE será aplicado a TODOS os registros da tabela.' },
                        { question: 'Se a cláusula WHERE for esquecida em um comando DELETE FROM Clientes;, o que acontece?', options: ['Nenhuma linha será excluída.', 'Somente a primeira linha será removida.', 'Todas as linhas da tabela Clientes serão excluídas permanentemente.', 'O SGBD retornará um erro de sintaxe.'], correct: 2, explanation: 'Omitir o WHERE em um DELETE é perigoso, pois apaga todos os registros da tabela.' },
                        { question: 'Qual é a "Regra da Dependência" (Integridade Referencial) ao excluir dados?', options: ['Você deve sempre excluir a tabela "mãe" (PK) antes da tabela "filha" (FK).', 'Você deve excluir os dados da tabela "filha" (ex: Pedidos) antes de excluir o dado correspondente na tabela "mãe" (ex: Clientes).', 'Você só pode excluir registros que tenham NULL em suas colunas.', 'Você deve usar UPDATE em vez de DELETE se houver uma FK.'], correct: 1, explanation: 'Para manter a integridade, os registros dependentes (filhos, com FK) devem ser removidos antes do registro principal (mãe, com PK).' },
                        { question: 'Qual é a sequência correta para excluir um Cliente (id 1) que possui Pedidos, que por sua vez possui Itens_Pedido?', options: ['1. Deletar de Clientes; 2. Deletar de Pedidos; 3. Deletar de Itens_Pedido.', '1. Deletar de Clientes; 2. Deletar de Itens_Pedido. (Pedidos é ignorado).', '1. Deletar de Itens_Pedido (filho); 2. Deletar de Pedidos (pai); 3. Deletar de Clientes (avô).', 'O SGBD não permite essa exclusão.'], correct: 2, explanation: 'A exclusão deve seguir a ordem da dependência, do "neto" (Itens_Pedido) para o "avô" (Clientes).' }
                    ]
                },
                // --- EXERCÍCIOS PRÁTICOS ---
                { 
                    id: 't3-p1', 
                    title: 'Prática: DQL (WHERE com AND e OR)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Selecione o nome_produto, preco e estoque de todos os produtos que são da categoria 'Eletrônicos' E custam mais de R$ 1000, OU produtos que tenham mais de 75 unidades no estoque.",
                    schema: "CREATE TABLE Produtos (\n  id_produto INT,\n  nome_produto VARCHAR(50),\n  categoria VARCHAR(50),\n  preco DECIMAL(10, 2),\n  estoque INT\n);",
                    correctQuery: "SELECT nome_produto, preco, estoque FROM Produtos WHERE (categoria = 'Eletrônicos' AND preco > 1000) OR (estoque > 75);",
                    queryParts: ['SELECT', 'nome_produto', ',', 'preco', ',', 'estoque', 'FROM', 'Produtos', 'WHERE', '(', 'categoria', '=', "'Eletrônicos'", 'AND', 'preco', '>', '1000', ')', 'OR', '(', 'estoque', '>', '75', ')', ';']
                },
                { 
                    id: 't3-p2', 
                    title: 'Prática: DQL (GROUP BY e Funções)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Agrupe por categoria e mostre a categoria, o AVG(preco) (preço médio) e o SUM(estoque) (estoque total).",
                    schema: "CREATE TABLE Produtos (\n  id_produto INT,\n  nome_produto VARCHAR(50),\n  categoria VARCHAR(50),\n  preco DECIMAL(10, 2),\n  estoque INT\n);",
                    correctQuery: "SELECT categoria, AVG(preco) AS preco_medio, SUM(estoque) AS estoque_total FROM Produtos GROUP BY categoria;",
                    queryParts: ['SELECT', 'categoria', ',', 'AVG(preco)', 'AS', 'preco_medio', ',', 'SUM(estoque)', 'AS', 'estoque_total', 'FROM', 'Produtos', 'GROUP BY', 'categoria', ';']
                },
                { 
                    id: 't3-p3', 
                    title: 'Prática: DQL (HAVING vs. WHERE)', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Agrupe por categoria, calcule o AVG(preco), mas use a cláusula HAVING para filtrar e mostrar apenas os grupos com média de preço superior a 1000.",
                    schema: "CREATE TABLE Produtos (\n  id_produto INT,\n  nome_produto VARCHAR(50),\n  categoria VARCHAR(50),\n  preco DECIMAL(10, 2),\n  estoque INT\n);",
                    correctQuery: "SELECT categoria, AVG(preco) AS preco_medio FROM Produtos GROUP BY categoria HAVING AVG(preco) > 1000;",
                    queryParts: ['SELECT', 'categoria', ',', 'AVG(preco)', 'AS', 'preco_medio', 'FROM', 'Produtos', 'GROUP BY', 'categoria', 'HAVING', 'AVG(preco)', '>', '1000', ';']
                },
                { 
                    id: 't3-p4', 
                    title: 'Prática: JOIN (LEFT JOIN)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva um LEFT JOIN que liste o nome_cliente e o id_pedido. O resultado deve incluir os clientes que não têm pedidos (eles aparecerão com NULL no id_pedido).",
                    schema: "CREATE TABLE Clientes (id_cliente INT, nome_cliente VARCHAR(50));\nCREATE TABLE Pedidos (id_pedido INT, id_cliente INT);",
                    correctQuery: "SELECT C.nome_cliente, P.id_pedido FROM Clientes AS C LEFT JOIN Pedidos AS P ON C.id_cliente = P.id_cliente;",
                    queryParts: ['SELECT', 'C.nome_cliente', ',', 'P.id_pedido', 'FROM', 'Clientes', 'AS C', 'LEFT JOIN', 'Pedidos', 'AS P', 'ON', 'C.id_cliente', '=', 'P.id_cliente', ';']
                },
                { 
                    id: 't3-p5', 
                    title: 'Prática: JOIN (RIGHT JOIN)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva um RIGHT JOIN que liste o nome_cliente e o id_pedido. O resultado deve incluir pedidos que não têm clientes (eles aparecerão com NULL no nome_cliente).",
                    schema: "CREATE TABLE Clientes (id_cliente INT, nome_cliente VARCHAR(50));\nCREATE TABLE Pedidos (id_pedido INT, id_cliente INT);",
                    correctQuery: "SELECT C.nome_cliente, P.id_pedido FROM Clientes AS C RIGHT JOIN Pedidos AS P ON C.id_cliente = P.id_cliente;",
                    queryParts: ['SELECT', 'C.nome_cliente', ',', 'P.id_pedido', 'FROM', 'Clientes', 'AS C', 'RIGHT JOIN', 'Pedidos', 'AS P', 'ON', 'C.id_cliente', '=', 'P.id_cliente', ';']
                },
                { 
                    id: 't3-p6', 
                    title: 'Prática: JOIN (JOIN em Cadeia)', 
                    type: 'practice',
                    duration: '12 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva um SELECT com três INNER JOINs para buscar nome_cliente, nome_produto e quantidade (Clientes -> Pedidos -> Itens_Pedido -> Produtos).",
                    schema: "CREATE TABLE Clientes (id_cliente INT, nome_cliente VARCHAR(50));\nCREATE TABLE Pedidos (id_pedido INT, id_cliente INT);\nCREATE TABLE Itens_Pedido (id_pedido INT, id_produto INT, quantidade INT);\nCREATE TABLE Produtos (id_produto INT, nome_produto VARCHAR(50));",
                    correctQuery: "SELECT C.nome_cliente, PR.nome_produto, IP.quantidade FROM Clientes AS C INNER JOIN Pedidos AS P ON C.id_cliente = P.id_cliente INNER JOIN Itens_Pedido AS IP ON P.id_pedido = IP.id_pedido INNER JOIN Produtos AS PR ON IP.id_produto = PR.id_produto ORDER BY C.nome_cliente;",
                    queryParts: ['SELECT', 'C.nome_cliente', ',', 'PR.nome_produto', ',', 'IP.quantidade', 'FROM', 'Clientes', 'AS C', 'INNER JOIN', 'Pedidos', 'AS P', 'ON', 'C.id_cliente', '=', 'P.id_cliente', 'INNER JOIN', 'Itens_Pedido', 'AS IP', 'ON', 'P.id_pedido', '=', 'IP.id_pedido', 'INNER JOIN', 'Produtos', 'AS PR', 'ON', 'IP.id_produto', '=', 'PR.id_produto', 'ORDER BY', 'C.nome_cliente', ';']
                },
                { 
                    id: 't3-p7', 
                    title: 'Prática: DML (INSERT)', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva o comando SQL para inserir o novo cliente: id_cliente: 5, nome_cliente: 'Fernanda Costa', cidade: 'Porto Alegre'.",
                    schema: "CREATE TABLE Clientes (id_cliente INT, nome_cliente VARCHAR(50), cidade VARCHAR(50));",
                    correctQuery: "INSERT INTO Clientes (id_cliente, nome_cliente, cidade) VALUES (5, 'Fernanda Costa', 'Porto Alegre');",
                    queryParts: ['INSERT INTO', 'Clientes', '(', 'id_cliente', ',', 'nome_cliente', ',', 'cidade', ')', 'VALUES', '(', '5', ',', "'Fernanda Costa'", ',', "'Porto Alegre'", ')', ';']
                },
                { 
                    id: 't3-p8', 
                    title: 'Prática: DML (UPDATE)', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva o comando UPDATE para alterar a cidade para 'Curitiba', especificamente para o cliente com id_cliente 4.",
                    schema: "CREATE TABLE Clientes (id_cliente INT, nome_cliente VARCHAR(50), cidade VARCHAR(50));",
                    correctQuery: "UPDATE Clientes SET cidade = 'Curitiba' WHERE id_cliente = 4;",
                    queryParts: ['UPDATE', 'Clientes', 'SET', 'cidade', '=', "'Curitiba'", 'WHERE', 'id_cliente', '=', '4', ';']
                },
                { 
                    id: 't3-p9', 
                    title: 'Prática: DML (DELETE e Dependência)', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Escreva o comando DELETE para tentar remover o cliente com id_cliente 1. (Isso deve falhar se a FK estiver ativa, mas o exercício pede o comando).",
                    schema: "CREATE TABLE Clientes (id_cliente INT PRIMARY KEY);\nCREATE TABLE Pedidos (id_pedido INT, id_cliente INT, FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente));",
                    correctQuery: "DELETE FROM Clientes WHERE id_cliente = 1;",
                    queryParts: ['DELETE FROM', 'Clientes', 'WHERE', 'id_cliente', '=', '1', ';']
                },
                // --- UNIDADE 4 (REVISÃO) ---
                { 
                    id: 't3-l4-review', 
                    title: 'Revisão: DQL, JOINs e DML', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Revisão Rápida:\n\n1. Consultando Dados (DQL):\n•A consulta fundamental é O QUÊ (SELECT), DE ONDE (FROM) e COM QUAIS CONDIÇÕES (WHERE).\n•Use AND/OR para filtros complexos e LIKE para buscar padrões.\n•ORDER BY classifica os resultados.\n•Funções de Agregação (COUNT, SUM, AVG) calculam valores.\n•GROUP BY agrupa linhas para as funções de agregação.\n•HAVING filtra os grupos (diferente do WHERE, que filtra linhas).\n\n2. Conectando Dados (JOINs):\n•INNER JOIN: Retorna apenas correspondências em ambas as tabelas.\n•LEFT JOIN: Retorna tudo da tabela da esquerda e preenche com NULL onde não há correspondência na direita (ótimo para achar 'clientes sem pedidos').\n•JOINs em Cadeia: Conectam múltiplas tabelas em sequência.\n\n3. Manipulando Dados (DML):\n•INSERT INTO: Adiciona novas linhas.\n•UPDATE: Modifica linhas existentes. (Use WHERE!)\n•DELETE FROM: Remove linhas. (Use WHERE!)\n•Regra da Dependência: Delete primeiro os dados das tabelas 'filhas' (FK) antes de deletar da 'mãe' (PK)." //
                }
            ]
        },
       
        
        {
            id: 'trail4',
            icon: '🏆', // Ícone para "Projetos Avançados"
            color: 'from-yellow-500 to-orange-400', // Nova cor
            title: 'Projetos Avançados',
            description: 'Aplique o conhecimento em um projeto completo.',
            lessons: [
                // --- UNIDADE 0: INTRODUÇÃO ---
                { 
                    id: 't4-l0-video', 
                    title: 'Vídeo: Introdução a Projetos Avançados', 
                    type: 'lesson', 
                    videoId: 'kpeH8FWR3Qw',
                    duration: '5 min', 
                    xp: REWARD_CONFIG.lesson.xp 
                },
                { 
                    id: 't4-l0-article', 
                    title: 'Introdução: Eficiência e Organização', 
                    type: 'article',
                    duration: '3 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Ao nível de projetos avançados, o foco não é apenas fazer a consulta funcionar, mas fazê-la de forma eficiente, organizada e segura, preparando a estrutura para o crescimento do negócio. Isso significa ir além dos comandos básicos de SELECT, INSERT, UPDATE e DELETE e explorar ferramentas que otimizam a lógica, a legibilidade e a performance das suas operações com dados."
                },
                // --- UNIDADE 1: CTEs E SUBCONSULTAS ---
                { 
                    id: 't4-l1-article', 
                    title: 'Resumo: Organizando com CTEs e Subconsultas', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Para problemas complexos que exigem múltiplos passos, as Subconsultas e as CTEs (Common Table Expressions) são indispensáveis. Elas permitem quebrar uma lógica complexa em partes menores.\n\n**Subconsultas:** É uma consulta SELECT aninhada dentro de outra. Ela executa primeiro e seu resultado é usado pela consulta externa. Vantagens: Simplicidade para problemas pontuais. Desvantagens: Podem se tornar difíceis de ler.\n\n**CTEs (Common Table Expressions):** Introduzidas pela cláusula WITH, são uma forma mais elegante de quebrar uma consulta complexa em blocos lógicos nomeados. Elas funcionam como 'tabelas temporárias' que existem apenas durante a execução. Vantagens: Legibilidade, Reutilização e capacidade de Recursividade."
                },
                { 
                    id: 't4-l1-theory', 
                    title: 'Teste: CTEs vs. Subconsultas', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'O que é uma Subconsulta (ou Subquery)?', options: ['Um comando INSERT que usa dados de outra tabela.', 'Uma consulta SELECT aninhada dentro de outra consulta (externa).', 'Um nome alternativo para a cláusula WHERE.', 'Uma tabela temporária que só existe durante a consulta.'], correct: 1, explanation: "Uma subconsulta é uma consulta SELECT aninhada dentro de outra consulta SQL principal." },
                        { question: "No exemplo `WHERE preco > (SELECT AVG(preco) FROM Produtos)`, o que acontece primeiro?", options: ['A consulta externa seleciona todos os produtos.', 'O SGBD pede ao usuário para inserir a média.', 'A subconsulta (SELECT AVG(preco)...) é executada primeiro, calculando a média.', 'A consulta falha porque não se pode usar uma função (AVG) dentro de um WHERE.'], correct: 2, explanation: "A subconsulta (interna) sempre executa primeiro, e seu resultado é usado pela consulta externa." },
                        { question: 'O que são CTEs (Common Table Expressions), introduzidas pela cláusula WITH?', options: ['São índices automáticos criados pelo SGBD para otimizar JOINs.', 'São restrições de segurança que definem quem pode ver os dados.', 'São comandos DML usados para atualizar dados em múltiplas tabelas.', "São 'tabelas temporárias' nomeadas que existem apenas durante a execução da consulta, melhorando a legibilidade."], correct: 3, explanation: "CTEs (cláusula WITH) funcionam como 'tabelas temporárias' nomeadas que existem apenas durante a execução da consulta." },
                        { question: 'Qual é uma vantagem de usar CTEs em vez de Subconsultas complexas?', options: ['CTEs são a única maneira de filtrar dados usando WHERE.', 'Legibilidade (dividem a lógica em blocos), reutilização (podem ser referenciadas várias vezes) e capacidade de recursão.', 'CTEs sempre rodam mais devagar, mas usam menos memória.', 'Subconsultas não podem ser usadas na cláusula FROM, apenas CTEs.'], correct: 1, explanation: 'As principais vantagens das CTEs são a legibilidade, a capacidade de reutilizar o bloco lógico várias vezes e a capacidade de realizar consultas recursivas.' }
                    ]
                },
                // --- UNIDADE 2: FUNÇÕES DE JANELA ---
                { 
                    id: 't4-l2-article', 
                    title: 'Resumo: Análise com Funções de Janela', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Funções de Janela (Window Functions) permitem realizar cálculos de agregação (como SUM()) sobre um conjunto de linhas... sem agrupar o resultado. Elas mantêm o detalhe de cada linha original.\n\nA sintaxe usa a cláusula `OVER()`, que pode conter:\n•`PARTITION BY`: Divide o conjunto de resultados em partições (grupos) onde a função é aplicada. É como um GROUP BY, mas sem colapsar as linhas.\n•`ORDER BY`: Define a ordem das linhas dentro da partição, crucial para funções como `RANK()` ou `ROW_NUMBER()`.\n\nOutras funções úteis incluem `DENSE_RANK()` (ranking sem pular números), `LAG()` (valor da linha anterior) e `LEAD()` (valor da linha posterior)."
                },
                { 
                    id: 't4-l2-theory', 
                    title: 'Teste: Funções de Janela e OVER()', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'Qual é a principal característica das Funções de Janela (Window Functions)?', options: ['Elas agrupam o resultado, colapsando as linhas (como um GROUP BY).', 'Elas só podem ser usadas para criar novas tabelas (DDL).', 'Elas realizam cálculos (como SUM, AVG) sobre um conjunto de linhas, mas mantêm o detalhe de cada linha original no resultado.', 'Elas abrem uma nova "janela" de aplicativo no cliente SQL (DBeaver).'], correct: 2, explanation: "Funções de Janela realizam agregações (como SUM, AVG) sobre uma 'janela' de dados, mas retornam o resultado em cada linha original, mantendo a granularidade." },
                        { question: "Qual cláusula define a 'janela' ou o conjunto de linhas sobre o qual a função de janela será aplicada?", options: ['GROUP BY', 'OVER()', 'WINDOW()', 'ANALYZE()'], correct: 1, explanation: "A sintaxe básica de uma função de janela envolve a cláusula OVER(), que define a 'janela' de dados." },
                        { question: 'O que a cláusula PARTITION BY faz dentro de um OVER()?', options: ['Define a ordem da classificação (ASC ou DESC).', 'Divide o conjunto de resultados em partições (grupos) onde a função é aplicada independentemente.', 'Exclui fisicamente os dados da tabela.', 'Filtra as linhas antes da função de janela ser aplicada.'], correct: 1, explanation: "PARTITION BY divide os dados em grupos (partições), e a função de janela é aplicada a cada grupo separadamente, de forma similar a um GROUP BY, mas sem colapsar as linhas." },
                        { question: 'Qual função de janela é usada para atribuir um ranking (ex: 1°, 2º, 3º) aos produtos dentro de uma categoria?', options: ['SUM() OVER (...)', 'NTILE() OVER (...)', 'RANK() OVER (PARTITION BY ... ORDER BY ...)', 'LEAD() OVER (...)'], correct: 2, explanation: "RANK() OVER (PARTITION BY ... ORDER BY ...) é a sintaxe exata para criar um ranking de linhas dentro de grupos específicos." }
                    ]
                },
                // --- UNIDADE 3: DDL ---
                { 
                    id: 't4-l3-article', 
                    title: 'Resumo: Construindo a Estrutura (DDL)', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "A DDL (Data Definition Language) lida com a criação (CREATE), modificação (ALTER) e exclusão (DROP) da estrutura dos objetos do banco de dados.\n\n**CREATE TABLE:** Define colunas, tipos de dados e restrições.\n•Tipos Comuns: `INT`, `SERIAL` (auto-incremento), `VARCHAR(tamanho)` (texto com limite), `NUMERIC(10, 2)` (para dinheiro), `TIMESTAMP` (data e hora).\n•Constraints Comuns: `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK` (regra).\n•Regras ON DELETE: `ON DELETE RESTRICT` (impede a exclusão do 'pai' se houver 'filhos'), `ON DELETE CASCADE` (exclui 'filhos' automaticamente).\n\n**ALTER TABLE:** É a ferramenta de 'reforma' para modificar uma tabela existente (ex: adicionar uma nova coluna) sem perder dados."
                },
                { 
                    id: 't4-l3-theory', 
                    title: 'Teste: DDL (CREATE, ALTER, Constraints)', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'O que é DDL (Data Definition Language)?', options: ['A parte do SQL usada para consultar dados (SELECT).', "A parte do SQL que lida com a estrutura dos objetos (ex: CREATE TABLE, ALTER TABLE, DROP TABLE).", 'A parte do SQL usada para manipular dados (INSERT, UPDATE).', 'A parte do SQL usada para segurança (GRANT, REVOKE).'], correct: 1, explanation: "DDL (Data Definition Language) é a parte do SQL que lida com a definição da estrutura dos objetos, como tabelas (CREATE, ALTER, DROP)." },
                        { question: 'Ao criar uma tabela, qual restrição (Constraint) garante que a coluna não possa conter valores nulos?', options: ['PRIMARY KEY (apenas, pois UNIQUE permite nulos)', 'UNIQUE', 'CHECK', 'NOT NULL'], correct: 3, explanation: "A restrição NOT NULL garante especificamente que uma coluna não pode conter valores nulos." },
                        { question: "No comando `...FOREIGN KEY (id_pedido) REFERENCES Pedidos (id_pedido) ON DELETE CASCADE`, o que `ON DELETE CASCADE` fará?", options: ['Impedirá que o Pedido seja excluído se houver Itens_Pedido.', 'Se um Pedido for excluído, todos os Itens_Pedido relacionados a ele serão automaticamente excluídos também.', 'Se um Pedido for excluído, o id_pedido nos Itens_Pedido se tornará NULL.', 'Enviará um alerta ao administrador antes de excluir.'], correct: 1, explanation: "ON DELETE CASCADE exclui automaticamente os registros 'filhos' (Itens_Pedido) quando o registro 'pai' (Pedido) é excluído." },
                        { question: "Qual comando DDL é usado para 'reformar' ou modificar a estrutura de uma tabela existente (ex: adicionar uma nova coluna)?", options: ['UPDATE TABLE', 'MODIFY TABLE', 'ALTER TABLE', 'CREATE OR REPLACE TABLE'], correct: 2, explanation: "O comando ALTER TABLE é usado para modificar a estrutura de uma tabela existente, como adicionar, remover ou alterar colunas." }
                    ]
                },
                // --- UNIDADE 4: VIEWS ---
                { 
                    id: 't4-l4-article', 
                    title: 'Resumo: Simplificando Acesso com Views', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Views (Visões) são 'tabelas virtuais' que representam uma consulta SQL armazenada. Elas não armazenam dados fisicamente, mas atuam como 'atalhos' para consultas complexas.\n\n**Por que usar Views?**\n1. **Simplificação:** Encapsulam JOINs e lógicas complexas.\n2. **Segurança:** Você pode conceder permissão à View (mostrando dados limitados) em vez das tabelas base.\n3. **Consistência:** Garante que todos usem a mesma lógica de negócio.\n\n**Views Materializadas:** Armazenam fisicamente o resultado da consulta e precisam ser atualizadas. Elas melhoram drasticamente a performance de relatórios complexos."
                },
                { 
                    id: 't4-l4-theory', 
                    title: 'Teste: Views (Visões)', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: 'O que é uma View (Visão)?', options: ['Um backup físico de uma tabela.', "Uma 'tabela virtual' que representa uma consulta SELECT armazenada; ela não armazena dados fisicamente.", 'Um índice usado para acelerar consultas SELECT.', 'Um tipo de dado especial para armazenar imagens (VARCHAR).'], correct: 1, explanation: "Views são tabelas virtuais que atuam como 'atalhos' para consultas SQL armazenadas; elas não armazenam os dados fisicamente." },
                        { question: 'Como as Views ajudam na Segurança?', options: ['Elas criptografam os dados automaticamente.', 'Você pode conceder permissão a uma View (que mostra colunas limitadas) em vez de dar acesso às tabelas base (com dados sensíveis).', 'Elas impedem todos os comandos DELETE e UPDATE.', 'Elas criam cópias dos dados, protegendo os originais.'], correct: 1, explanation: "Views permitem restringir o acesso, concedendo permissão apenas à View (que pode mostrar colunas limitadas) em vez das tabelas base." },
                        { question: 'Qual é a principal diferença entre uma View comum e uma View Materializada (Materialized View)?', options: ['Views comuns são mais rápidas que Views Materializadas.', 'Views comuns podem usar JOINs, enquanto Materializadas não.', 'Views Materializadas armazenam fisicamente o resultado da consulta e precisam ser atualizadas, enquanto Views comuns executam a consulta toda vez.', 'Apenas Views Materializadas podem ser usadas para segurança.'], correct: 2, explanation: "Views Materializadas armazenam o resultado fisicamente (melhorando a performance) e precisam ser atualizadas, enquanto Views comuns executam a consulta a cada acesso." }
                    ]
                },
                // --- UNIDADE 5: SEGURANÇA E PERFORMANCE ---
                { 
                    id: 't4-l5-article', 
                    title: 'Resumo: Segurança e Performance', 
                    type: 'article',
                    duration: '10 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Um projeto profissional exige segurança e eficiência.\n\n**Transações (ACID):** Garantem a consistência. São uma sequência de operações executadas como uma unidade (Tudo ou Nada).\n•`Atomicidade`: Ou todas as operações funcionam (COMMIT), ou nenhuma funciona (ROLLBACK).\n•`COMMIT` salva permanentemente as mudanças.\n•`ROLLBACK` desfaz todas as operações.\n\n**Índices:** Aceleram drasticamente a recuperação de dados (leitura). Pense neles como o índice de um livro. Use em colunas de `WHERE`, `JOIN`, e `ORDER BY`. A desvantagem (overhead) é que podem desacelerar a escrita (INSERT, UPDATE, DELETE).\n\n**Boas Práticas:**\n•Evite `SELECT *` em produção; liste colunas explícitas.\n•Use ALIAS (apelidos) para tabelas em JOINs.\n•Monitore consultas lentas (EXPLAIN ANALYZE)."
                },
                { 
                    id: 't4-l5-theory', 
                    title: 'Teste: Transações e Índices', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: "O que significa a 'Atomicidade' (o 'A' de ACID) em uma transação?", options: ['A transação é isolada de outras transações.', 'As mudanças são permanentes após o COMMIT.', "A transação é uma unidade indivisível: ou todas as operações funcionam (COMMIT), ou nenhuma funciona (ROLLBACK).", 'A transação leva o banco de um estado válido para outro.'], correct: 2, explanation: "Atomicidade significa que a transação é 'Tudo ou Nada'. Ou todas as operações são confirmadas (COMMIT), ou todas são desfeitas (ROLLBACK)." },
                        { question: 'Quais comandos são usados para controlar uma transação de transferência bancária?', options: ['CREATE TRANSACTION..., UPDATE..., DROP TRANSACTION.', 'START TRANSACTION;, UPDATE..., UPDATE..., COMMIT; (ou ROLLBACK;).', 'BEGIN..., ALTER..., SAVE;.', 'SELECT FOR UPDATE..., COMMIT....'], correct: 1, explanation: "A sequência padrão é START TRANSACTION, seguida pelas operações (UPDATEs), e finalizada com COMMIT (para salvar) ou ROLLBACK (para desfazer)." },
                        { question: 'Qual é a principal função de um Índice (Index) no banco de dados?', options: ['Garantir que os dados não possam ser excluídos (Integridade Referencial).', 'Armazenar dados de forma segura (Criptografia).', 'Acelerar a recuperação de dados (leitura/SELECT), como o índice remissivo de um livro.', 'Definir o tipo de dado de uma coluna (DDL).'], correct: 2, explanation: "Índices são estruturas de pesquisa, como o índice de um livro, que aceleram drasticamente a recuperação de dados (consultas SELECT)." },
                        { question: 'Embora Índices acelerem a leitura (SELECT), qual é a sua principal desvantagem (overhead)?', options: ['Eles usam muita CPU durante as consultas SELECT.', 'Eles podem desacelerar operações de escrita (INSERT, UPDATE, DELETE), pois o índice também precisa ser atualizado.', 'Eles não podem ser usados em colunas de texto (VARCHAR).', 'Eles tornam as transações impossíveis de reverter (ROLLBACK).'], correct: 1, explanation: "A desvantagem (overhead) dos índices é que eles precisam ser atualizados a cada operação de escrita (INSERT, UPDATE, DELETE), o que torna essas operações mais lentas." },
                        { question: 'Qual é uma boa prática de performance mencionada no texto?', options: ['Sempre usar SELECT * para garantir que todos os dados sejam carregados.', 'Evitar o uso de ALIAS (apelidos) pois eles confundem o SGBD.', 'Criar índices em todas as colunas de todas as tabelas.', 'Evitar SELECT * em produção e listar explicitamente apenas as colunas necessárias.'], correct: 3, explanation: "Listar colunas explicitamente (em vez de SELECT *) reduz a carga na rede e no banco de dados, sendo uma prática de performance crucial." }
                    ]
                },
                // --- UNIDADE 6: EXERCÍCIOS PRÁTICOS ---
                { 
                    id: 't4-p1', 
                    title: 'Prática: Subconsulta na Cláusula WHERE', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Selecione o nome_produto e preco dos produtos onde o preco é maior que a média (AVG) de todos os preços na tabela.",
                    schema: "CREATE TABLE Produtos (id_produto INT, nome_produto VARCHAR(50), preco NUMERIC(10,2));",
                    correctQuery: "SELECT nome_produto, preco FROM Produtos WHERE preco > (SELECT AVG(preco) FROM Produtos);",
                    queryParts: ['SELECT', 'nome_produto', ',', 'preco', 'FROM', 'Produtos', 'WHERE', 'preco', '>', '(', 'SELECT', 'AVG(preco)', 'FROM', 'Produtos', ')', ';']
                },
                { 
                    id: 't4-p2', 
                    title: 'Prática: Organizando com CTE', 
                    type: 'practice',
                    duration: '7 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Use uma CTE chamada MediaPreco para calcular o valor_medio e, em seguida, faça um SELECT na tabela Produtos que usa esse valor para filtrar.",
                    schema: "CREATE TABLE Produtos (id_produto INT, nome_produto VARCHAR(50), preco NUMERIC(10,2));",
                    correctQuery: "WITH MediaPreco AS (SELECT AVG(preco) AS valor_medio FROM Produtos) SELECT P.nome_produto, P.preco FROM Produtos AS P, MediaPreco AS MP WHERE P.preco > MP.valor_medio;",
                    queryParts: ['WITH', 'MediaPreco', 'AS', '(', 'SELECT', 'AVG(preco)', 'AS', 'valor_medio', 'FROM', 'Produtos', ')', 'SELECT', 'P.nome_produto', ',', 'P.preco', 'FROM', 'Produtos', 'AS P', ',', 'MediaPreco', 'AS MP', 'WHERE', 'P.preco', '>', 'MP.valor_medio', ';']
                },
                { 
                    id: 't4-p3', 
                    title: 'Prática: Função de Janela (PARTITION BY)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Mostre o id_pedido, o valor do item (quantidade * preco_unitario) e use a função SUM() OVER (PARTITION BY...) para mostrar o valor_total_pedido.",
                    schema: "CREATE TABLE Itens_Pedido (id_item_pedido INT, id_pedido INT, quantidade INT, preco_unitario NUMERIC(10,2));",
                    correctQuery: "SELECT id_pedido, (quantidade * preco_unitario) AS valor_item, SUM(quantidade * preco_unitario) OVER (PARTITION BY id_pedido) AS valor_total_pedido FROM Itens_Pedido;",
                    queryParts: ['SELECT', 'id_pedido', ',', '(', 'quantidade', '*', 'preco_unitario', ')', 'AS', 'valor_item', ',', 'SUM(quantidade * preco_unitario)', 'OVER', '(', 'PARTITION BY', 'id_pedido', ')', 'AS', 'valor_total_pedido', 'FROM', 'Itens_Pedido', ';']
                },
            	{ 
  	              id: 't4-p4', 
  	              title: 'Prática: Função de Janela (RANK)', 
  	              type: 'practice',
  	              duration: '10 min',
  	              xp: REWARD_CONFIG.practice.xp,
  	          	  description: "Escreva um SELECT que mostre o nome_produto, categoria, preco e o ranking (RANK()) dos produtos, particionado por categoria e ordenado por preco DESC.",
  	          	  schema: "CREATE TABLE Produtos (nome_produto VARCHAR(50), categoria VARCHAR(50), preco NUMERIC(10,2));",
  	          	  correctQuery: "SELECT nome_produto, categoria, preco, RANK() OVER (PARTITION BY categoria ORDER BY preco DESC) AS rank_por_categoria FROM Produtos ORDER BY categoria, rank_por_categoria;",
  	          	  queryParts: ['SELECT', 'nome_produto', ',', 'categoria', ',', 'preco', ',', 'RANK()', 'OVER', '(', 'PARTITION BY', 'categoria', 'ORDER BY', 'preco', 'DESC', ')', 'AS', 'rank_por_categoria', 'FROM', 'Produtos', 'ORDER BY', 'categoria', ',', 'rank_por_categoria', ';']
            	},
            	{ 
    	            id: 't4-p5', 
    	            title: 'Prática: DDL (CREATE TABLE)', 
    	            type: 'practice',
    	            duration: '7 min',
    	            xp: REWARD_CONFIG.practice.xp,
    	            description: "Crie a tabela Produtos com: id_produto (SERIAL PRIMARY KEY), nome_produto (VARCHAR(150) NOT NULL), e preco (NUMERIC(10, 2) NOT NULL CHECK (preco >= 0)).",
    	            schema: "",
    	            correctQuery: "CREATE TABLE Produtos (id_produto SERIAL PRIMARY KEY, nome_produto VARCHAR(150) NOT NULL, preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0));",
    	            queryParts: ['CREATE TABLE', 'Produtos', '(', 'id_produto', 'SERIAL', 'PRIMARY KEY', ',', 'nome_produto', 'VARCHAR(150)', 'NOT NULL', ',', 'preco', 'NUMERIC(10, 2)', 'NOT NULL', 'CHECK', '(', 'preco', '>=', '0', ')', ')', ';']
            	},
            	{ 
                    id: 't4-p6-theory', 
                    title: 'Teste: DDL (Restrições ON DELETE)', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: "Tabelas: Clientes (ID 1), Pedidos (ID 101, FK ID 1, com ON DELETE RESTRICT). O que acontece se você executar `DELETE FROM Clientes WHERE id_cliente = 1;`?", options: ["O Cliente e o Pedido são excluídos.", "O Cliente é excluído, e o Pedido tem o id_cliente alterado para NULL.", "ERRO: A exclusão falha, pois a regra ON DELETE RESTRICT impede a exclusão de um 'pai' (Cliente) que ainda tem 'filhos' (Pedidos).", "Apenas o Cliente é excluído, o Pedido 101 fica órfão."], correct: 2, explanation: "A exclusão falha porque ON DELETE RESTRICT (na tabela Pedidos) impede que um Cliente seja excluído se ele ainda tiver Pedidos." }
                    ]
                },
            	{ 
                    id: 't4-p7', 
                    title: 'Prática: Usando uma View', 
                    type: 'practice',
                    duration: '5 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: "Assumindo que a View `relatorio_vendas_detalhado` (que une 4 tabelas) já foi criada, escreva um SELECT para ver o relatório apenas da cliente 'Ana Silva'.",
                    schema: "CREATE VIEW relatorio_vendas_detalhado AS ... (une Clientes, Pedidos, Itens_Pedido, Produtos)",
                    correctQuery: "SELECT * FROM relatorio_vendas_detalhado WHERE nome_cliente = 'Ana Silva';",
                    queryParts: ['SELECT', '*', 'FROM', 'relatorio_vendas_detalhado', 'WHERE', 'nome_cliente', '=', "'Ana Silva'", ';']
                },
            	{ 
                    id: 't4-p8-theory', 
                    title: 'Teste: Transações (COMMIT/ROLLBACK)', 
                    type: 'theory',
                    duration: '5 min',
                    xp: REWARD_CONFIG.theory.xp,
                    questions: [
                        { question: "Você executa `START TRANSACTION;`, depois `UPDATE Contas SET saldo = 400 WHERE id_conta = 1;`. Se você executar `ROLLBACK;` em seguida, qual será o saldo da Conta 1?", options: ["400 (a mudança é temporária)", "NULL", "O saldo original (ex: 500), pois a transação foi desfeita.", "O SGBD retornará um erro."], correct: 2, explanation: "ROLLBACK desfaz todas as operações desde o START TRANSACTION, restaurando o banco de dados ao seu estado original antes da transação." }
                    ]
            	},
            	// --- UNIDADE 7: REVISÃO ---
            	{ 
                    id: 't4-l6-review', 
                    title: 'Revisão: Projetos Avançados', 
                    type: 'article',
                    duration: '5 min',
                    xp: REWARD_CONFIG.article.xp,
                    content: "Em projetos avançados, o foco é eficiência e segurança.\n\n1. **CTEs e Subconsultas:** Use Subconsultas para cálculos simples e CTEs (cláusula WITH) para quebrar lógicas complexas em blocos legíveis e reutilizáveis.\n\n2. **Funções de Janela:** Permitem cálculos (SUM, RANK) sobre partições (PARTITION BY) sem colapsar as linhas, mantendo o detalhe.\n\n3. **DDL:** Use `CREATE TABLE` para definir a estrutura (tipos de dados e constraints) e `ALTER TABLE` para 'reformar' tabelas existentes.\n\n4. **Views:** São 'tabelas virtuais' ou atalhos para consultas complexas. Elas simplificam o acesso e aumentam a segurança.\n\n5. **Segurança e Performance:**\n•**Transações (ACID):** Garantem o 'Tudo ou Nada' (COMMIT/ROLLBACK).\n•**Índices:** Aceleram buscas (SELECT) em colunas de WHERE e JOIN.\n•**Práticas:** Evite `SELECT *` em produção."
            	}
            ]
        }
        ];

    
    const getInitials = (name) => {
        if (!name || typeof name !== 'string' || name.length === 0) return '👤';
        const words = name.split(' ');
        if (words.length > 1 && words[words.length - 1].length > 0) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // --- Componente Toast (NOVO E GLOBAL) ---
    const Toast = memo(({ message, type, onDismiss }) => {
        useEffect(() => {
            const timer = setTimeout(onDismiss, 3000);
            return () => clearTimeout(timer);
        }, [onDismiss]);

        const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

        return (
            <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50`}>
                {message}
            </div>
        );
    });
    
    // --- Componente AuthScreen (ATUALIZADO PARA O DESIGN DA IMAGEM) ---
    const AuthScreen = memo(({ auth }) => {
        const [localToast, setLocalToast] = useState(null);
        const [view, setView] = useState('login'); // 'login' or 'register'
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [name, setName] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const handleLogin = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Success is handled by onAuthStateChanged in App
            } catch (error) {
                console.error(error);
                setLocalToast({ message: 'Email ou senha inválidos.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        const handleRegister = async (e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                setLocalToast({ message: 'As senhas não correspondem.', type: 'error' });
                return;
            }
            setIsLoading(true);
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: name });
                // Success is handled by onAuthStateChanged in App
            } catch (error) {
                console.error(error);
                setLocalToast({ message: error.message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        const handleGoogleLogin = async () => {
            const provider = new GoogleAuthProvider();
            try {
                // Apenas inicie o redirecionamento. O 'await' não é estritamente
                // necessário aqui, pois a página irá navegar.
                signInWithRedirect(auth, provider); 
            } catch (error) {
                // Erros de inicialização (ex: config errada) serão pegos aqui
                console.error(error);
                setLocalToast({ message: error.message, type: 'error' });
            }
        };

        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased flex items-center justify-center p-5">
                {localToast && <Toast message={localToast.message} type={localToast.type} onDismiss={() => setLocalToast(null)} />}
                
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    
                    {/* Coluna da Esquerda (Branding) - ATUALIZADO */}
                    <div className="flex-1 text-center md:text-left p-8">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                            <Database className="w-12 h-12 text-purple-600" />
                            <h1 className="text-5xl font-bold text-gray-900">DBQuest</h1>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Aprenda <span className="text-purple-600">Banco de Dados</span> como nunca antes
                        </h2>
                        <p className="text-lg text-gray-600">
                            Domine SQL, NoSQL e conceitos de banco de dados através de exercícios interativos e gamificação.
                        </p>
                    </div>

                    {/* Coluna da Direita (Formulário) - ATUALIZADO */}
                    <div className="flex-1 w-full max-w-md mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                                {view === 'login' ? 'Bem-vindo de volta!' : 'Criar Conta'}
                            </h2>
                            <p className="text-center text-gray-600 mb-6">
                                {view === 'login' ? 'Faça login para continuar' : 'Preencha os campos para se registrar'}
                            </p>
                            
                            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
                                {view === 'register' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                {view === 'register' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Carregando...' : (view === 'login' ? 'Entrar' : 'Registrar')}
                                </button>
                            </form>
                            
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors hover:bg-gray-50 flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                                Entrar com Google
                            </button>
                            
                            <p className="mt-6 text-center text-sm text-gray-600">
                                {view === 'login' ? 'Não tem conta?' : 'Já tem uma conta?'}
                                <button
                                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                    className="font-semibold text-purple-600 hover:text-purple-700 ml-1"
                                >
                                    {view === 'login' ? 'Registre-se' : 'Faça login'}
                                </button>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    });

    function App() {
        
        // --- ESTADO DA APLICAÇÃO (Restaurado) ---
        // Estados de Autenticação e Usuário
        const [userId, setUserId] = useState(null);
        const [isAuthChecked, setIsAuthChecked] = useState(false);
        const [userProgress, setUserProgress] = useState({
            username: 'Carregando...',
            avatar: '👤',
            level: 1,
            totalXP: 0,
            streak: 0,
            gems: 0,
            lives: 5,
            completedLessons: [],
            lastCompletedLessonDate: null,
            lastLifeResetDate: null,
            cooldownUntil: null
        });

        // Estados de Navegação e Conteúdo
        const [currentView, setCurrentView] = useState('home');
        const [selectedTrail, setSelectedTrail] = useState(null);
        const [currentLesson, setCurrentLesson] = useState(null);
        const [currentQuestion, setCurrentQuestion] = useState(0);
        const [filterType, setFilterType] = useState('all');

        // Estados de Dados (Trilhas e Ranking)
        const [studyTrails, setStudyTrails] = useState([]);
        const [leaderboard, setLeaderboard] = useState([]);
        const [isRankingLoading, setIsRankingLoading] = useState(true);

        // Estados da Lição
        const [answeredQuestions, setAnsweredQuestions] = useState([]);
        const [showResult, setShowResult] = useState(false);
        const [selectedAnswer, setSelectedAnswer] = useState(null);
        
        // Estados de Desafio (IA)
        const [challenge, setChallenge] = useState(null);
        const [isChallengeLoading, setIsChallengeLoading] = useState(false);
        const [aiExplanation, setAiExplanation] = useState('');
        const [isAiExplanationLoading, setIsAiExplanationLoading] = useState(false);
        
        // Estado de Notificação
        const [toast, setToast] = useState(null);

        // --- EFEITOS (Restaurados) ---
        // Efeito: Observador de Autenticação
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUserId(user ? user.uid : null);
                setIsAuthChecked(true);
            });
            return () => unsubscribe(); // Limpa ao desmontar
        }, []);

        useEffect(() => {
            // Verifica se o usuário está voltando de um login por redirect
            const checkRedirect = async () => {
                try {
                    const result = await getRedirectResult(auth);
                    if (result) {
                        // Login bem-sucedido. O onAuthStateChanged
                        // também será disparado, mas podemos por um toast aqui.
                        setToast({ message: `Bem-vindo, ${result.user.displayName}!`, type: 'success' });
                    }
                } catch (error) {
                    // Trata erros do redirect (ex: email já em uso com outro método)
                    console.error("Erro ao obter resultado do redirect:", error);
                    setToast({ message: "Erro no login: " + error.message, type: 'error' });
                }
            };
            
            // Só executa quando a verificação de auth inicial estiver pronta
            if (isAuthChecked) {
                checkRedirect();
            }
        }, [isAuthChecked, auth, getRedirectResult]); // Adicione as dependências

        // Efeito: Carregar Dados do Usuário e Trilha
        useEffect(() => {
            // Carrega as trilhas estáticas (simulação de API)
            // (Esta parte estava faltando, adicionei a estrutura de dados)
            setStudyTrails(trailsData);

            // Observador do Ranking
            const leaderboardRef = ref(db, 'leaderboard');
            const offLeaderboard = onValue(leaderboardRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const sortedData = Object.entries(data)
                        .map(([id, values]) => ({ id, ...values }))
                        .sort((a, b) => b.totalXP - a.totalXP);
                    setLeaderboard(sortedData);
                }
                setIsRankingLoading(false);
            });

            // Observador de Dados do Usuário
            let offUserProgress = () => {};
            if (userId) {
                const userRef = ref(db, `users/${userId}`);
                offUserProgress = onValue(userRef, async (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        
                        // --- Verificação de Ofensiva e Vidas (Restaurado) ---
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const todayTimestamp = today.getTime();
                        
                        const lastResetDate = data.lastLifeResetDate ? new Date(data.lastLifeResetDate) : null;
                        let lives = data.gamification.lives;
                        let cooldown = data.cooldownUntil ? new Date(data.cooldownUntil) : null;
                        
                        const updates = {};
                        let needsUpdate = false;

                        // Check for daily life reset
                        if (!lastResetDate || lastResetDate.getTime() < todayTimestamp) {
                            if (lives < 5) {
                                updates['gamification/lives'] = 5;
                                updates['cooldownUntil'] = null;
                                updates['lastLifeResetDate'] = todayTimestamp;
                                lives = 5;
                                cooldown = null;
                                needsUpdate = true;
                            }
                        }

                        // Check if cooldown has ended
                        if (cooldown && cooldown.getTime() <= Date.now()) {
                            updates['gamification/lives'] = 5;
                            updates['cooldownUntil'] = null;
                            updates['lastLifeResetDate'] = todayTimestamp;
                            lives = 5;
                            needsUpdate = true;
                        }

                        // Check for streak reset
                        const lastCompleted = data.lastCompletedLessonDate ? new Date(data.lastCompletedLessonDate) : null;
                        if (lastCompleted) {
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            
                            // Se a última lição completada foi ANTES de ontem, zera a ofensiva
                            if (lastCompleted.getTime() < yesterday.getTime()) {
                                updates['gamification/streak'] = 0;
                                needsUpdate = true;
                            }
                        }

                        if (needsUpdate) {
                            await update(userRef, updates);
                        }
                        
                        // Atualiza o estado local com os dados do DB (e possíveis atualizações)
                        setUserProgress({
                            ...data.gamification,
                            username: data.name || auth.currentUser.displayName || 'Aluno',
                            avatar: data.avatar || '👤',
                            cooldownUntil: cooldown ? cooldown.toISOString() : null,
                            lives: lives
                        });
                        
                        // Garante que o ranking esteja atualizado
                        const rankRef = ref(db, `leaderboard/${userId}`);
                        const rankSnapshot = await get(rankRef); // 'get' precisa ser importado
                        if (!rankSnapshot.exists() || rankSnapshot.val().username !== data.name || rankSnapshot.val().avatar !== data.avatar) {
                            update(rankRef, {
                                username: data.name,
                                totalXP: data.gamification.totalXP,
                                avatar: data.avatar || '👤'
                            });
                        }

                    } else {
                        // --- Cria novo usuário no DB (Restaurado) ---
                        const newUser = {
                            name: auth.currentUser.displayName || 'Novo Aluno',
                            avatar: '👤',
                            email: auth.currentUser.email,
                            joinedDate: new Date().toISOString(),
                            gamification: {
                                level: 1,
                                totalXP: 0,
                                streak: 0,
                                gems: 100,
                                lives: 5,
                                completedLessons: [],
                                lastCompletedLessonDate: null,
                                lastLifeResetDate: new Date().setHours(0,0,0,0)
                            },
                            cooldownUntil: null
                        };
                        await set(userRef, newUser);
                        setUserProgress(newUser.gamification);
                        
                        // Adiciona ao leaderboard
                        await set(ref(db, `leaderboard/${userId}`), {
                            username: newUser.name,
                            totalXP: 0,
                            avatar: newUser.avatar
                        });
                    }
                });
            } else {
                // Reseta o progresso se o usuário deslogar
                setUserProgress({
                    username: 'Convidado', avatar: '👤', level: 1, totalXP: 0,
                    streak: 0, gems: 0, lives: 5, completedLessons: []
                });
            }

            // Função de limpeza
            return () => {
                offLeaderboard();
                offUserProgress();
            };
        // Adicionada a importação de 'get' que estava faltando
        }, [userId, db, auth, get]); // Adicionado 'get'

        // --- Funções de Handler (Restauradas) ---
        const handleLogout = async () => {
            try {
                await signOut(auth);
                setCurrentView('home'); // Redireciona para home (que mostrará AuthScreen)
                setToast({ message: "Sessão terminada com sucesso.", type: 'success' });
            } catch (error) {
                console.error("Erro ao terminar sessão:", error);
                setToast({ message: "Erro ao terminar sessão.", type: 'error' });
            }
        };

        const startLesson = (trail, lesson) => {
            if (userProgress.lives <= 0) {
                setCurrentView('noLives');
                return;
            }
            setSelectedTrail(trail);
            setCurrentLesson(lesson);
            setCurrentQuestion(0);
            setAnsweredQuestions([]);
            setShowResult(false);
            setSelectedAnswer(null);
            
            // --- LÓGICA DE ROTEAMENTO CORRIGIDA ---
            if (lesson.type === 'article') {
                setCurrentView('article');
            } else if (lesson.type === 'practice') { // <-- ADICIONADO
                setCurrentView('practice');
            } else if (lesson.type === 'theory') { // <-- ESPECIFICADO
                setCurrentView('lesson');
} else if (lesson.type === 'lesson') {
                setCurrentView('video');
            } else {
                // Fallback para tipos desconhecidos
                setCurrentView('home');
            }
        };
        
        const getContentTypeInfo = useCallback((type) => {
            switch (type) {
                case 'article': return { label: 'Artigo', icon: <FileText />, color: 'border-blue-400 text-blue-300', bgGradient: 'from-blue-900/30 to-blue-800/20' };
                case 'lesson': return { label: 'Aula', icon: <GraduationCap />, color: 'border-cyan-400 text-cyan-300', bgGradient: 'from-cyan-900/30 to-cyan-800/20' };
                case 'theory': return { label: 'Teoria', icon: <BookOpen />, color: 'border-purple-400 text-purple-300', bgGradient: 'from-purple-900/30 to-purple-800/20' };
                case 'practice': return { label: 'Prática', icon: <PenTool />, color: 'border-green-400 text-green-300', bgGradient: 'from-green-900/30 to-green-800/20' };
                default: return { label: 'Conteúdo', icon: <FileText />, color: 'border-gray-400 text-gray-300', bgGradient: 'from-gray-900/30 to-gray-800/20' };
            }
        }, []);

        const checkAnswer = useCallback((optionIndex) => {
            if (showResult) return;
            setSelectedAnswer(optionIndex);
            setShowResult(true);

            const question = currentLesson.questions[currentQuestion];
            const isCorrect = optionIndex === question.correct;
            
            setAnsweredQuestions(prev => [...prev, { ...question, selected: optionIndex, isCorrect }]);
            
            // Lógica de gamificação
            if (!isCorrect) {
                const newLives = userProgress.lives - 1;
                setUserProgress(prev => ({ ...prev, lives: newLives }));
                update(ref(db, `users/${userId}/gamification`), { lives: newLives });
                
                if (newLives <= 0) {
                    const cooldownTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
                    setUserProgress(prev => ({ ...prev, cooldownUntil: cooldownTime.toISOString() }));
                    update(ref(db, `users/${userId}`), { cooldownUntil: cooldownTime.toISOString() });
                }
            }
        }, [showResult, currentLesson, currentQuestion, userProgress.lives, userId, db]);
        
       
        // --- LÓGICA DE OFENSIVA (STREAK) E GEMAS (VERSÃO CORRIGIDA) ---
        const handleLessonCompletion = (lessonId, lessonXP) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia
            
            const lastCompletedDate = userProgress.lastCompletedLessonDate 
                ? new Date(userProgress.lastCompletedLessonDate) 
                : null;
            
            if (lastCompletedDate) {
                lastCompletedDate.setHours(0, 0, 0, 0); // Zera a hora da última data
            }

            // --- LÓGICA DE STREAK (Aprimorada) ---
            let newStreak = userProgress.streak || 0;
            let streakIncreasedToday = false; // Flag para bônus de gema
            
            if (!lastCompletedDate) {
                // Primeira lição do usuário
                newStreak = 1;
                streakIncreasedToday = true; 
                console.log("Primeira lição! Ofensiva iniciada: 1 dia");
            } else {
                // Calcula ontem para verificar consecutividade
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                
                const lastCompletedTime = lastCompletedDate.getTime();
                const todayTime = today.getTime();
                const yesterdayTime = yesterday.getTime();
                
                if (lastCompletedTime === todayTime) {
                    // Já completou lição hoje
                    newStreak = userProgress.streak || 1;
                    streakIncreasedToday = false; 
                    console.log("Lição completada hoje, ofensiva mantida:", newStreak, "dias");
                } else if (lastCompletedTime === yesterdayTime) {
                    // Completou ontem - incrementa
                    newStreak = (userProgress.streak || 0) + 1;
                    streakIncreasedToday = true; 
                    console.log("Ofensiva incrementada! Dias consecutivos:", newStreak);
                } else if (lastCompletedTime < yesterdayTime) {
                    // Perdeu o streak
                    newStreak = 1;
                    streakIncreasedToday = true; 
                    console.log("Ofensiva perdida! Recomeçando do dia 1");
                } else {
                    // Caso de segurança
                    newStreak = userProgress.streak || 1;
                }
            }
            
            // --- LÓGICA DE XP E NÍVEL ---
            const newXP = (Number(userProgress.totalXP) || 0) + (Number(lessonXP) || 0);
            const newLevel = Math.floor(newXP / 100) + 1;
            const completed = [...(userProgress.completedLessons || [])];
            
            const isNewLesson = !completed.includes(lessonId); // Verifica se é a primeira vez
            if (isNewLesson) {
                completed.push(lessonId);
            }

            // --- ✨ INÍCIO DA LÓGICA DE GEMAS ---
            let newGems = Number(userProgress.gems) || 0;
            let gemsAwarded = 0;
            const BASE_GEM_REWARD = 10;       // Recompensa base por lição nova
            const STREAK_BONUS_MILESTONE = 5;  // Bônus a cada 5 dias
            const STREAK_BONUS_AMOUNT = 25;    // Quantidade do bônus

            // 1. Recompensa base (apenas se a lição for nova)
            if (isNewLesson) {
                gemsAwarded += BASE_GEM_REWARD;
                console.log(`+${BASE_GEM_REWARD} gemas por completar uma nova lição!`);
            }

            // 2. Bônus de Ofensiva (Streak)
            // Só dá o bônus se o streak aumentou HOJE
            if (streakIncreasedToday && newStreak > 0 && newStreak % STREAK_BONUS_MILESTONE === 0) {
                gemsAwarded += STREAK_BONUS_AMOUNT;
                console.log(`BÔNUS DE OFENSIVA! +${STREAK_BONUS_AMOUNT} gemas por ${newStreak} dias!`);
            }

            newGems += gemsAwarded;
            // --- ✨ FIM DA LÓGICA DE GEMAS ---

            // --- Objeto de Updates para o Firebase ---
            const updates = {
                totalXP: newXP,
                level: newLevel,
                streak: newStreak,
                gems: newGems, // <-- ✨ AQUI ESTÁ A ADIÇÃO
                lastCompletedLessonDate: new Date().toISOString(), // Salva a data E hora exata
                completedLessons: completed
            };

            // Atualiza o DB
            update(ref(db, `users/${userId}/gamification`), updates);
            // Atualiza o Leaderboard
            update(ref(db, `leaderboard/${userId}`), { 
                totalXP: newXP, 
                streak: newStreak,
                // ✨ (Opcional, mas recomendado) Adicione gemas ao leaderboard também
                gems: newGems 
            });
            
            return newXP;
        };

        const nextQuestion = useCallback(() => {
            setShowResult(false);
            setSelectedAnswer(null);
            setAiExplanation('');

            if (currentQuestion < currentLesson.questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                // Lição concluída
                const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length;
                const totalQuestions = currentLesson.questions.length;
                
                if (correctAnswers === totalQuestions) {
                    // Chama a nova função centralizada
                    handleLessonCompletion(currentLesson.id, currentLesson.xp);
                    setCurrentView('completion');
                } else {
                    // Falhou na lição
                    setCurrentView('completion'); // Mostra os resultados mesmo se falhar
                }
            }
        }, [currentQuestion, currentLesson, answeredQuestions, userProgress, userId, db]);
        
        const handleArticleCompletion = useCallback(() => {
            // Chama a nova função centralizada
            const newXP = handleLessonCompletion(currentLesson.id, currentLesson.xp);
            
            setCurrentView('home'); // Volta para a home
            setToast({ message: `Artigo concluído! +${currentLesson.xp} XP`, type: 'success' });
            
        }, [currentLesson, userProgress, userId, db]);

        const handlePracticeCompletion = useCallback((isCorrect) => {
            if (isCorrect) {
                // Sucesso: Chama o handler principal e vai para a tela de sucesso
                handleLessonCompletion(currentLesson.id, currentLesson.xp);
                // Simula um "quiz" perfeito para a tela de completion
                setAnsweredQuestions([{ isCorrect: true }]); 
                setCurrentView('completion');
            } else {
                // Erro: Deduz vida
                const newLives = userProgress.lives - 1;
                setUserProgress(prev => ({ ...prev, lives: newLives }));
                update(ref(db, `users/${userId}/gamification`), { lives: newLives });
                
                // Simula um "quiz" falho para a tela de completion
                setAnsweredQuestions([{ isCorrect: false }]);
                
                if (newLives <= 0) {
                    // Se acabaram as vidas, define o cooldown e vai para a tela 'noLives'
                    const cooldownTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
                    setUserProgress(prev => ({ ...prev, cooldownUntil: cooldownTime.toISOString() }));
                    update(ref(db, `users/${userId}`), { cooldownUntil: cooldownTime.toISOString() });
                    setCurrentView('noLives');
                } else {
                    // Se ainda tem vidas, só mostra a tela de "Quase lá"
                    setCurrentView('completion');
                }
            }
            // Reseta os estados da lição
            setShowResult(false);
            setSelectedAnswer(null);
        // Adicione as dependências corretas
        }, [currentLesson, userProgress.lives, userId, db, handleLessonCompletion]);
        
        const handleRefillLives = useCallback(() => {
            const refillCost = 100; // Custo em gemas
            if (userProgress.gems >= refillCost) {
                const newGems = userProgress.gems - refillCost;
                const newLives = 5;
                
                update(ref(db, `users/${userId}/gamification`), {
                    gems: newGems,
                    lives: newLives
                });
                update(ref(db, `users/${userId}`), {
                    cooldownUntil: null,
                    lastLifeResetDate: new Date().setHours(0,0,0,0)
                });
                
                setUserProgress(prev => ({
                    ...prev,
                    gems: newGems,
                    lives: newLives,
                    cooldownUntil: null
                }));
                
                setCurrentView('home'); // Volta para a home
                setToast({ message: "Vidas recarregadas!", type: 'success' });
            } else {
                setToast({ message: "Gemas insuficientes.", type: 'error' });
            }
        }, [userProgress.gems, userId, db]);

        const handleCooldownEnd = useCallback(() => {
            setUserProgress(prev => ({ ...prev, lives: 5, cooldownUntil: null }));
            setCurrentView('home'); // Volta para a home
        }, []);


        // --- Componentes Memoizados ---
        const Header = memo(({ userProgress, onNavigate }) => {
            const initials = getInitials(userProgress.username); // Get initials
            return (
                <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-20">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
                        <Database className="w-8 h-8 text-cyan-300" />
                        <h1 className="text-2xl font-bold">DBQuest</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <button onClick={() => onNavigate('home')} className="text-white/80 hover:text-white font-semibold transition-colors">Trilhas</button>
                        <button onClick={() => onNavigate('ranking')} className="text-white/80 hover:text-white font-semibold transition-colors">Ranking</button>
                    </nav>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-full"> <Flame /> <span className="font-bold">{userProgress.streak}</span> </div>
                        <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-2 rounded-full"> <Gem /> <span className="font-bold">{userProgress.gems}</span> </div>
                        <div className="flex items-center gap-2 bg-red-500/20 px-3 py-2 rounded-full"> <Heart className={`${userProgress.lives > 0 ? 'text-red-400' : 'text-gray-500'}`} /> <span className="font-bold">{userProgress.lives}</span> </div>
                        <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-2xl">{userProgress.avatar ? userProgress.avatar : initials}</button>
                    </div>
                </div>
            </header>
            );
        });

        const HomeView = memo(({ userProgress, studyTrails, onSelectTrail, onGenerateChallenge }) => (
            <main className="max-w-6xl mx-auto px-6 py-6 animate-fade-in">
                {/* Bloco de XP (Preservado) */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"><Trophy /></div>
                            <div>
                                <div className="text-white/60 text-sm">Nível {userProgress.level}</div>
                                <div className="text-2xl font-bold">{userProgress.totalXP} XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-center hidden md:block"><div className="text-3xl font-bold">{(userProgress.completedLessons || []).length}</div><div className="text-white/60 text-sm">Lições Completas</div></div>
                            <div className="text-center"><div className="text-3xl font-bold text-cyan-400">{userProgress.streak}</div><div className="text-white/60 text-sm">Dias de Ofensiva</div></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(userProgress.totalXP % 100)}%` }} /></div>
                        <div className="text-white/60 text-xs mt-1 text-right">{100 - (userProgress.totalXP % 100)} XP para o próximo nível</div>
                    </div>
                </div>

                {/* Bloco do Desafio Rápido / Gemini API (Preservado) */}
                <div className="mt-10">
                     <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Sparkles className="text-purple-400" /> Desafio Rápido</h2>
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden transition-all p-6 text-center">
                        <p className="text-white/80 mb-4">Teste seus conhecimentos com um desafio de SQL gerado por IA!</p>
                        <button onClick={onGenerateChallenge} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform">
                            Gerar Desafio
                        </button>
                    </div>
                </div>
        
                {/* Bloco das Trilhas (Com o estilo de cadeado da imagem) */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Target /> Trilhas de Aprendizado</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studyTrails.map((trail, index) => {
                        const completedCount = trail.lessons.filter(l => (userProgress.completedLessons || []).includes(l.id)).length;
                        const progress = studyTrails.length > 0 && trail.lessons.length > 0 ? (completedCount / trail.lessons.length) * 100 : 0;
                        
                        let isLocked = false;
                        if (index > 0) {
                            const previousTrail = studyTrails[index - 1];
                            const isPreviousTrailComplete = previousTrail.lessons.every(lesson => 
                                (userProgress.completedLessons || []).includes(lesson.id)
                            );
                            if (!isPreviousTrailComplete) {
                                isLocked = true;
                            }
                        }
        
                        return (
                        // Card agora usa 'opacity-60' se estiver bloqueado
                        <div 
                            key={trail.id} 
                            className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden transition-all relative ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/40 cursor-pointer'}`} 
                            onClick={() => !isLocked && onSelectTrail(trail)}
                        >
                            
                            {/* O overlay de bloqueio (fundo preto) foi REMOVIDO */}

                            <div className={`bg-gradient-to-r ${trail.color} p-6`}>
                                <div className="flex items-center justify-between mb-3"><div className="text-5xl">{trail.icon}</div><div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-bold">{completedCount}/{trail.lessons.length}</div></div>
                                
                                {/* Título agora inclui o ícone de cadeado (se bloqueado) */}
                                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                    {trail.title}
                                    {isLocked && <Lock className="w-5 h-5 flex-shrink-0" />} 
                                </h3>
                                <p className="text-white/80 text-sm">{trail.description}</p>
                            </div>

                            {/* Rodapé do Card */}
                            <div className="p-6">
                                <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-3"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                                <div className="flex justify-between items-center">
                                    <div className="text-white/60 text-sm">{progress.toFixed(0)}% Completo</div>
                                    <button className="text-white/80 hover:text-white font-bold flex items-center gap-1">Ver Lições <ChevronRight /></button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
            </main>
        ));

        const TrailDetailView = memo(({ selectedTrail, userProgress, onStartLesson, onBack, getContentTypeInfo, filterType, onFilterChange }) => {
            const filteredLessons = selectedTrail.lessons.filter(lesson => {
                if (filterType === 'all') return true;
                return lesson.type === filterType;
            });
            
            return (
                <main className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
                        <ArrowLeft /> Voltar para as Trilhas
                    </button>
                    <div className={`bg-gradient-to-r ${selectedTrail.color} rounded-2xl p-8 mb-8 border border-white/20`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-6xl">{selectedTrail.icon}</div>
                            <div className="text-right"><div className="text-3xl font-bold">{(((selectedTrail.lessons.filter(l => (userProgress.completedLessons || []).includes(l.id)).length) / selectedTrail.lessons.length) * 100).toFixed(0)}%</div><div className="text-white/70">Completo</div></div>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{selectedTrail.title}</h2><p className="text-white/80 mb-6 max-w-2xl">{selectedTrail.description}</p>
                    </div>
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 -mx-8 px-8">
                            <button onClick={() => onFilterChange('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>Todos</button>
                            <button onClick={() => onFilterChange('article')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'article' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}><FileText className="w-4 h-4" />Artigos</button>
                            <button onClick={() => onFilterChange('lesson')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'lesson' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}><GraduationCap className="w-4 h-4" />Aulas</button>
                            <button onClick={() => onFilterChange('theory')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'theory' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}><BookOpen className="w-4 h-4" />Teoria</button>
                            <button onClick={() => onFilterChange('practice')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterType === 'practice' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}><PenTool className="w-4 h-4" />Prática</button>
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen />Conteúdo da Trilha</h3>
                        <div className="space-y-4">
                            {filteredLessons.map((lesson) => {
                                const lessonIndex = selectedTrail.lessons.findIndex(l => l.id === lesson.id);
                                const isCompleted = (userProgress.completedLessons || []).includes(lesson.id);
                                
                                let isLocked = false;
                                if (lessonIndex > 0) {
                                    const previousLesson = selectedTrail.lessons[lessonIndex - 1];
                                    if (!(userProgress.completedLessons || []).includes(previousLesson.id)) {
                                        isLocked = true;
                                    }
                                }

                                const contentType = getContentTypeInfo(lesson.type);
                                return (
                                    <div key={lesson.id} onClick={() => !isLocked && onStartLesson(selectedTrail, lesson)} className={`bg-gradient-to-r ${contentType.bgGradient} rounded-2xl p-6 border ${isLocked ? 'opacity-50 cursor-not-allowed border-white/10' : 'hover:scale-[1.01] cursor-pointer border-white/20 hover:border-white/30'} transition-all`}>
                                        <div className="flex items-start gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${isCompleted ? 'bg-green-500/20 text-green-300' : isLocked ? 'bg-white/5 text-white/30' : 'bg-cyan-500/20 text-cyan-300'}`}>{isLocked ? <Lock /> : isCompleted ? <Check /> : lessonIndex + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h4 className="font-bold text-lg">{lesson.title}</h4>
                                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 whitespace-nowrap ${contentType.color}`}>{lesson.type === 'article' && <FileText className="w-3 h-3" />}{lesson.type === 'lesson' && <GraduationCap className="w-3 h-3" />}{lesson.type === 'theory' && <BookOpen className="w-3 h-3" />}{lesson.type === 'practice' && <PenTool className="w-3 h-3" />}{contentType.label}</div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                                                    <div className="flex items-center gap-1"><Clock />{lesson.duration}</div>
                                                    <div className="flex items-center gap-1"><Star />+{lesson.xp} XP</div>
                                                </div>
                                                {!isLocked && (<button className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2">{isCompleted ? <><Check className="w-4 h-4" />Revisar</> : <><Play className="w-4 h-4" />Começar</>}</button>)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            );
        });
        
        // --- COMPONENTE PARA VÍDEOS ---
    const VideoView = memo(({ currentLesson, onComplete, onBack }) => {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col animate-fade-in">
                <header className="bg-white/10 border-b border-white/20">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                        <button onClick={onBack} className="text-white/80 hover:text-white"><ArrowLeft/></button>
                        <div className="w-full bg-white/20 h-4 rounded-full"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{width: '100%'}} /></div>
                    </div>
                </header>
                <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
                    <h2 className="text-3xl font-bold mb-6">{currentLesson.title}</h2>
                    {currentLesson.videoId && (
                        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                                title={currentLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    {currentLesson.content && (
                        <div className="prose prose-invert prose-lg text-white/90 max-w-none space-y-4">
                            {currentLesson.content ? currentLesson.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            )) : <p>Conteúdo não disponível.</p>}
                        </div>
                    )}
                </main>
                <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={onComplete}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform"
                        >
                            Concluir Aula
                        </button>
                    </div>
                </footer>
            </div>
        );
    });
    
    const ArticleView = memo(({ currentLesson, onComplete, onBack }) => {
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col animate-fade-in">
                    <header className="bg-white/10 border-b border-white/20">
                        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                            <button onClick={onBack} className="text-white/80 hover:text-white"><ArrowLeft/></button>
                            <div className="w-full bg-white/20 h-4 rounded-full"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{width: '100%'}} /></div>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
                        <h2 className="text-3xl font-bold mb-6">{currentLesson.title}</h2>
                        <div className="prose prose-invert prose-lg text-white/90 max-w-none space-y-4">
                            {currentLesson.content ? currentLesson.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            )) : <p>Conteúdo não disponível.</p>}
                        </div>
                    </main>
                    <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={onComplete}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform"
                            >
                                Concluir Artigo
                            </button>
                        </div>
                    </footer>
                </div>
            );
        });
        
        const LessonView = memo(({ currentLesson, currentQuestion, userProgress, onCheckAnswer, onNextQuestion, onNavigate, showResult, answeredQuestions, selectedAnswer, setSelectedAnswer, onGetAiExplanation, aiExplanation, isAiExplanationLoading }) => {
            const question = currentLesson.questions[currentQuestion];
            const progress = ((currentQuestion + 1) / currentLesson.questions.length) * 100;
            
            const getOptionClasses = (index) => {
                if (showResult) {
                    if (index === question.correct) {
                        return `bg-green-500/30 border-green-400 text-white`;
                    }
                    if (selectedAnswer === index) {
                        return `bg-red-500/30 border-red-400 text-white`;
                    }
                    return `bg-white/5 border-white/10 opacity-60 cursor-not-allowed`;
                }

                if (selectedAnswer === index) {
                    return `bg-cyan-500/30 border-cyan-400`;
                }
                
                return `bg-gray-800/50 border-white/20 text-gray-200 hover:bg-gray-800/70 hover:border-white/30`;
            };
            
            const isCorrect = selectedAnswer === question.correct;
            
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col">
                    <header className="bg-white/10 border-b border-white/20">
                        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                            <button onClick={() => onNavigate('trailDetail')} className="text-white/80 hover:text-white"><X/></button>
                            <div className="w-full bg-white/20 h-4 rounded-full"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300" style={{width: `${progress}%`}} /></div>
                            <div className="flex items-center gap-2 text-red-400"> <Heart /> <span className="font-bold">{userProgress.lives}</span> </div>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{question.question}</h2>
                        <div className="space-y-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => onCheckAnswer(index)}
                                    disabled={showResult}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${getOptionClasses(index)}`}
                                >
                                    {/* Adiciona verificação se a opção é um código para aplicar font-mono */}
                                    <span className={option.includes('SELECT') || option.includes('FROM') ? 'font-mono' : ''}>{option}</span>
                                </button>
                            ))}
                        </div>
                    </main>
                    
                    {showResult && (
                        <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0 animate-fade-in">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? <><Check /><span className="text-green-400 font-bold text-lg">Correto!</span></> : <><X /><span className="text-red-400 font-bold text-lg">Incorreto</span></>}
                                </div>
                                <p className="text-white/90 mb-4">{question.explanation}</p>
                                
                                {!isCorrect && (
                                    <div className="mb-4">
                                        <button 
                                            onClick={() => onGetAiExplanation(question, question.options[selectedAnswer])} 
                                            className="text-sm text-purple-300 font-semibold flex items-center gap-2"
                                            disabled={isAiExplanationLoading}
                                        >
                                            <Sparkles className="w-4 h-4" /> {isAiExplanationLoading ? "Analisando..." : "Por que errei? (Explicação da IA)"}
                                        </button>
                                        {aiExplanation && (
                                            <div className="mt-2 p-4 bg-black/20 rounded-lg text-sm text-white/80 prose prose-invert max-w-none">
                                                {aiExplanation}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <button
                                    onClick={onNextQuestion}
                                    className={`w-full text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                                >
                                    Continuar
                                </button>
                            </div>
                        </footer>
                    )}
                </div>
            );
        });
        
        const CompletionView = memo(({ answeredQuestions, currentLesson, onNavigate }) => {
            const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length;
            
            // --- LÓGICA MODIFICADA ---
            // Verifica se a lição era um quiz (tem 'questions') ou uma prática (não tem)
            const isQuiz = currentLesson.questions && currentLesson.questions.length > 0;
            const totalQuestions = isQuiz ? currentLesson.questions.length : 1; // Prática conta como 1
            const isSuccess = correctAnswers > 0; // Se 'answeredQuestions' tiver UM acerto, é sucesso
            // --- FIM DA MODIFICAÇÃO ---
            
            const xpGained = isSuccess ? currentLesson.xp : 0;
            
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl w-full">
                        <div className="text-8xl mb-6">{isSuccess ? '🎉' : '🤔'}</div>
                        <h2 className="text-3xl font-bold mb-4">{isSuccess ? 'Lição Concluída!' : 'Quase lá!'}</h2>
                        <p className="text-white/80 text-lg mb-6">
                            {isSuccess ? `Você ganhou +${xpGained} XP e manteve sua ofensiva!` : 'Você errou a questão. Revise o material e tente novamente!'}
                        </p>
                        
                        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left divide-y divide-white/10">
                            <div className="py-4 flex justify-between items-center"><span className="text-white/70">Precisão</span><span className={`font-bold text-2xl ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>{((correctAnswers / totalQuestions) * 100).toFixed(0)}%</span></div>
                            {isQuiz && ( // Só mostra isso se for um quiz
                                <div className="py-4 flex justify-between items-center"><span className="text-white/70">Perguntas Corretas</span><span className="font-bold text-2xl">{correctAnswers} de {totalQuestions}</span></div>
                            )}
                            <div className="py-4 flex justify-between items-center"><span className="text-white/70">XP Ganhos</span><span className="font-bold text-2xl">{xpGained}</span></div>
                        </div>
                        
                        <div className="flex gap-4">
                             {!isSuccess && (
                                <button
                                    // Modificado para voltar para a view correta (practice ou lesson)
                                    onClick={() => onNavigate(isQuiz ? 'lesson' : 'practice')}
                                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Tentar Novamente
                             </button>
                            )}
                            <button
                                onClick={() => onNavigate('home')}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                               Continuar
                            </button>
                        </div>
                    </div>
                </div>
            );
        });

        const NoLivesView = memo(({ userProgress, onRefillWithGems, onCooldownEnd, onNavigate }) => {
            const [timeLeft, setTimeLeft] = useState('');

            useEffect(() => {
                if (!userProgress.cooldownUntil) {
                    onCooldownEnd();
                    return;
                }
                
                const interval = setInterval(() => {
                    const now = new Date();
                    const cooldown = new Date(userProgress.cooldownUntil);
                    const diff = cooldown.getTime() - now.getTime();

                    if (diff <= 0) {
                        clearInterval(interval);
                        setTimeLeft('00:00:00');
                        onCooldownEnd();
                        return;
                    }

                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                }, 1000);

                return () => clearInterval(interval);
            }, [userProgress.cooldownUntil, onCooldownEnd]);

            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full">
                        <div className="text-8xl mb-6"><HeartCrack /></div>
                        <h2 className="text-3xl font-bold mb-4">Você está sem vidas!</h2>
                        <p className="text-white/80 text-lg mb-6">
                            Você precisa de vidas para continuar aprendendo. Elas recarregam automaticamente.
                        </p>
                        
                        <div className="bg-white/5 rounded-xl p-6 mb-8">
                            <div className="text-white/70 mb-2">Próxima recarga em:</div>
                            <div className="text-4xl font-bold tracking-widest">{timeLeft || 'Calculando...'}</div>
                        </div>
                        
                        <div className="space-y-4">
                             <button
                                onClick={onRefillWithGems}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Gem /> Recarregar por 100 Gemas
                            </button>
                            <button
                                onClick={() => onNavigate('home')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                            >
                                Voltar para Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        });

        const RankingView = memo(({ leaderboard, currentUserId, isLoading }) => {
            const getRankColor = (index) => {
                if (index === 0) return 'border-yellow-400 bg-yellow-400/10';
                if (index === 1) return 'border-gray-400 bg-gray-400/10';
                if (index === 2) return 'border-yellow-700 bg-yellow-700/10';
                return 'border-white/10 bg-white/5';
            };

            const getRankIcon = (index) => {
                if (index === 0) return <Trophy className="text-yellow-400" />;
                if (index === 1) return <Award className="text-gray-400" />;
                if (index === 2) return <Star className="text-yellow-700" />;
                return <span className="text-white/50">{index + 1}</span>;
            };

            return (
                <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-8">Ranking</h2>
                    {isLoading ? (
                        <div className="text-center text-white/70">Carregando ranking...</div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((user, index) => (
                                <div key={user.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${getRankColor(index)} ${user.id === currentUserId ? 'scale-105 bg-white/20' : ''}`}>
                                    <div className="w-10 text-xl font-bold flex items-center justify-center">
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                                        {user.avatar || '👤'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{user.username}</h3>
                                        {user.id === currentUserId && <span className="text-xs text-cyan-400 font-bold">VOCÊ</span>}
                                    </div>
                                    <div className="text-xl font-bold text-right">
                                        {user.totalXP} <span className="text-sm text-white/60">XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            );
        });

        // --- Componente ProfileView (NOVO) ---
        // Este componente agora gerencia seu próprio estado de toast
        const ProfileView = memo(({ userProgress, onLogout, onSaveProfile }) => {
            const [isEditing, setIsEditing] = useState(false);
            const [name, setName] = useState(userProgress.username);
            const [avatar, setAvatar] = useState(userProgress.avatar || '👤');
            const [localToast, setLocalToast] = useState(null); // Estado de toast local
            const [isSaving, setIsSaving] = useState(false);

            // Emojis para seleção
            const avatarOptions = ['👤', '🧑‍💻', '🚀', '💡', '🧠', '⚡', '🏆', '🎯', '💾', '🤖', '👑', '🧙'];
            
            const initials = getInitials(userProgress.username);

            const handleSave = async () => {
                setIsSaving(true);
                setLocalToast(null);
                try {
                    // onSaveProfile agora lança um erro se falhar
                    await onSaveProfile(name, avatar);
                    setLocalToast({ message: "Perfil atualizado com sucesso!", type: 'success' });
                    setIsEditing(false);
                } catch (error) {
                    console.error("Erro ao salvar perfil:", error);
                    // Exibe o erro vindo da função
                    setLocalToast({ message: error.message || "Erro ao salvar perfil.", type: 'error' });
                } finally {
                    setIsSaving(false);
                }
            };

            const handleCancel = () => {
                // Reseta para os valores originais
                setName(userProgress.username);
                setAvatar(userProgress.avatar || '👤');
                setIsEditing(false);
                setLocalToast(null);
            };
            
            // Atualiza o estado local se o userProgress (do DB) mudar
            useEffect(() => {
                if (!isEditing) {
                    setName(userProgress.username);
                    setAvatar(userProgress.avatar || '👤');
                }
            }, [userProgress.username, userProgress.avatar, isEditing]);

            return (
                <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
                    {/* Renderiza o toast local */}
                    {localToast && <Toast message={localToast.message} type={localToast.type} onDismiss={() => setLocalToast(null)} />}
                    
                    <h2 className="text-3xl font-bold text-white mb-8">Meu Perfil</h2>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        {!isEditing ? (
                            // --- MODO DE VISUALIZAÇÃO ---
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-6xl mb-6">
                                    {userProgress.avatar ? userProgress.avatar : initials}
                                </div>
                                <h3 className="text-3xl font-bold mb-6">{userProgress.username}</h3>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-center mb-8">
                                    <div className="bg-white/5 p-4 rounded-xl"><div className="text-3xl font-bold">{userProgress.level}</div><div className="text-white/60">Nível</div></div>
                                    <div className="bg-white/5 p-4 rounded-xl"><div className="text-3xl font-bold">{userProgress.totalXP}</div><div className="text-white/60">Total XP</div></div>
                                    <div className="bg-white/5 p-4 rounded-xl"><div className="text-3xl font-bold text-cyan-400">{userProgress.streak}</div><div className="text-white/60">Ofensiva</div></div>
                                    <div className="bg-white/5 p-4 rounded-xl"><div className="text-3xl font-bold text-red-400">{userProgress.lives}</div><div className="text-white/60">Vidas</div></div>
                                </div>
                                
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full max-w-xs bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-5 h-5" /> Editar Perfil
                                </button>
                            </div>
                        ) : (
                            // --- MODO de EDIÇÃO ---
                            <div className="flex flex-col items-center">
                                <div className="text-6xl mb-6">{avatar}</div>
                                
                                <div className="mb-6 w-full">
                                    <label className="block text-sm font-medium text-white/80 mb-2">Escolha seu Avatar</label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {avatarOptions.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setAvatar(opt)}
                                                className={`w-12 h-12 text-2xl rounded-full transition-all ${avatar === opt ? 'bg-cyan-500 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6 w-full max-w-md">
                                    <label className="block text-sm font-medium text-white/80 mb-2">Nome de Usuário</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                                    />
                                </div>
                                
                                <div className="flex gap-4 w-full max-w-md">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Botão de Logout sempre visível */}
                        <div className="border-t border-white/10 mt-8 pt-8 text-center">
                            <button
                                onClick={onLogout}
                                className="text-red-400 hover:text-red-300 font-semibold"
                            >
                                Terminar Sessão
                            </button>
                        </div>
                    </div>
                </main>
            );
        });

        // --- Salvar Perfil ---
        // MUDANÇA: handleSaveProfile agora lança erros em vez de chamar setToast
        const handleSaveProfile = useCallback(async (newName, newAvatar) => {
            if (!newName || newName.trim() === "") {
                throw new Error("O nome não pode estar vazio.");
            }
            
            const userRef = ref(db, `users/${userId}`);
            const leaderboardRef = ref(db, `leaderboard/${userId}`);
            
            const updates = {
                name: newName,
                avatar: newAvatar || null
            };
            
            const leaderboardUpdates = {
                username: newName,
                avatar: newAvatar || null
            };
            
            try {
                await update(userRef, updates);
                await update(leaderboardRef, leaderboardUpdates);
                // Retorna sucesso (implícito)
            } catch (error) {
                console.error("Erro ao salvar perfil:", error);
                // Lança o erro para o componente ProfileView tratar
                throw new Error("Erro ao salvar perfil.");
            }
        }, [userId, db]);

        // --- Funções da API Gemini ---
        const callGeminiAPI = useCallback(async (payload, retries = 3, delay = 1000) => {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    const candidate = result.candidates?.[0];

                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        return candidate.content.parts[0].text;
                    } else {
                        throw new Error("Resposta da API inválida.");
                    }
                } catch (error) {
                    console.error(`Tentativa ${i + 1} falhou:`, error);
                    if (i === retries - 1) throw error; // Lança o erro na última tentativa
                    await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
                }
            }
        }, []);
        
        const getAiExplanation = useCallback(async (question, incorrectAnswer) => {
            setIsAiExplanationLoading(true);
            setAiExplanation('');

            const prompt = `Você é um tutor especialista em bancos de dados. Um aluno respondeu a uma pergunta incorretamente.
            A pergunta era: "${question.question}"
            A resposta incorreta do aluno foi: "${incorrectAnswer}"
            A resposta correta é: "${question.options[question.correct]}"
            A explicação básica é: "${question.explanation}"
            
            Por favor, forneça uma explicação mais detalhada e amigável para iniciantes sobre o conceito por trás da resposta correta. Explique por que a resposta correta funciona e por que a resposta do aluno está incorreta. Formate sua resposta em markdown simples.`;

            try {
                const payload = { contents: [{ parts: [{ text: prompt }] }] };
                const explanation = await callGeminiAPI(payload);
                setAiExplanation(explanation);
            } catch (error) {
                console.error("Erro ao buscar explicação da IA:", error);
                setToast({ message: "Não foi possível obter a explicação da IA.", type: 'error' });
            } finally {
                setIsAiExplanationLoading(false);
            }
        }, []);
        
        const generateSqlChallenge = useCallback(async () => {
            setIsChallengeLoading(true);
            setChallenge(null);
            setCurrentView('challenge');

            const prompt = `Você é um gerador de problemas de SQL para uma plataforma de aprendizado gamificada. Gere um problema de SQL de nível iniciante/intermediário. Siga estritamente o esquema JSON fornecido. A descrição deve apresentar um cenário simples. O esquema SQL deve ser uma única tabela simples. As opções devem incluir uma consulta correta e três consultas incorretas plausíveis. A explicação deve detalhar por que a consulta correta funciona.`;
            
            const schema = {
                type: "OBJECT",
                properties: {
                    description: { type: "STRING" },
                    schema: { type: "STRING" },
                    question: { type: "STRING" },
                    options: { type: "ARRAY", items: { type: "STRING" } },
                    correctIndex: { type: "NUMBER" },
                    explanation: { type: "STRING" },
                },
                required: ["description", "schema", "question", "options", "correctIndex", "explanation"]
            };

            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            };
            
            try {
                const responseText = await callGeminiAPI(payload);
                const challengeData = JSON.parse(responseText);
                setChallenge(challengeData);
            } catch (error) {
                console.error("Erro ao gerar desafio de IA:", error);
                setToast({ message: "Não foi possível gerar um desafio. Tente novamente.", type: 'error' });
                setCurrentView('home'); // Volta para a home em caso de erro
            } finally {
                setIsChallengeLoading(false);
            }
        }, []);
        
        const handleSelectTrail = useCallback((trail) => { setSelectedTrail(trail); setCurrentView('trailDetail'); }, []);
        const handleBackToTrails = useCallback(() => { setCurrentView('home'); setSelectedTrail(null); setFilterType('all'); }, []);
        const handleNavigate = useCallback((view) => setCurrentView(view), []);

        const renderCurrentView = () => {
            if (isChallengeLoading) {
                return <div className="min-h-screen flex items-center justify-center text-white"><h2 className="text-2xl font-bold">✨ Gerando um novo desafio...</h2></div>;
            }
            if (userProgress.lives <= 0 && !['home', 'ranking', 'profile', 'noLives', 'challenge'].includes(currentView)) {
                if(!showResult) {
                    setCurrentView('noLives');
                }
                return <NoLivesView userProgress={userProgress} onRefillWithGems={handleRefillLives} onCooldownEnd={handleCooldownEnd} onNavigate={handleNavigate} />;
            }
            
            switch (currentView) {
                case 'home': return <HomeView userProgress={userProgress} studyTrails={studyTrails} onSelectTrail={handleSelectTrail} onGenerateChallenge={generateSqlChallenge} />;
                case 'trailDetail': return <TrailDetailView selectedTrail={selectedTrail} userProgress={userProgress} onStartLesson={startLesson} onBack={handleBackToTrails} getContentTypeInfo={getContentTypeInfo} filterType={filterType} onFilterChange={setFilterType} />;
                case 'video': return <VideoView currentLesson={currentLesson} onComplete={handleArticleCompletion} onBack={() => setCurrentView('trailDetail')} />;
                case 'article': return <ArticleView currentLesson={currentLesson} onComplete={handleArticleCompletion} onBack={() => setCurrentView('trailDetail')} />;
                case 'lesson': return <LessonView currentLesson={currentLesson} currentQuestion={currentQuestion} userProgress={userProgress} onCheckAnswer={checkAnswer} onNextQuestion={nextQuestion} onNavigate={handleNavigate} showResult={showResult} answeredQuestions={answeredQuestions} selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} onGetAiExplanation={getAiExplanation} aiExplanation={aiExplanation} isAiExplanationLoading={isAiExplanationLoading} />;
                
                // --- ADICIONE ESTE CASE ---
                case 'practice':
                    return <PracticeView
                        currentLesson={currentLesson}
                        userProgress={userProgress}
                        onNavigate={handleNavigate}
                        onPracticeComplete={handlePracticeCompletion}
                    />;
                // --- FIM DA ADIÇÃO ---
                
                case 'completion': return <CompletionView answeredQuestions={answeredQuestions} currentLesson={currentLesson} onNavigate={handleNavigate} />;
                case 'noLives': return <NoLivesView userProgress={userProgress} onRefillWithGems={handleRefillLives} onCooldownEnd={handleCooldownEnd} onNavigate={handleNavigate} />;
                case 'ranking': return <RankingView leaderboard={leaderboard} currentUserId={userId} isLoading={isRankingLoading} />;
                case 'profile': return <ProfileView userProgress={userProgress} onLogout={handleLogout} onSaveProfile={handleSaveProfile} />;
                case 'challenge': return <ChallengeView challenge={challenge} onBack={() => setCurrentView('home')} onGenerateChallenge={generateSqlChallenge} />;
                default: return <HomeView userProgress={userProgress} studyTrails={studyTrails} onSelectTrail={handleSelectTrail} onGenerateChallenge={generateSqlChallenge}/>;
            }
        };

        if (!isAuthChecked) {
            return <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center text-white"><h1 className="text-3xl font-bold">A carregar...</h1></div>;
        }
        
        return (
            <div className="min-h-screen">
                {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
                
                {!userId ? (
                    // MUDANÇA: Remoção do prop "setToast"
                    <AuthScreen auth={auth} />
                ) : (
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white min-h-screen">
                    {!['lesson', 'article', 'completion', 'noLives', 'challenge'].includes(currentView) && <Header userProgress={userProgress} onNavigate={handleNavigate} />}
                    {renderCurrentView()}
                    </div>
                )}
            </div>
        );
    }
    
    // Novo Componente para o Desafio de IA
    const ChallengeView = memo(({ challenge, onBack, onGenerateChallenge }) => {
        const [selectedAnswer, setSelectedAnswer] = useState(null);
        const [showResult, setShowResult] = useState(false);

        const handleCheckAnswer = () => {
            setShowResult(true);
        };
        
        const handleNext = () => {
            setSelectedAnswer(null);
            setShowResult(false);
            onGenerateChallenge();
        };

        const getOptionClasses = (index) => {
            if (showResult) {
                if (index === challenge.correctIndex) {
                    return `bg-green-500/30 border-green-400 text-white`;
                }
                if (selectedAnswer === index) {
                    return `bg-red-500/30 border-red-400 text-white`;
                }
                return `bg-white/5 border-white/10 opacity-60 cursor-not-allowed`;
            }

            if (selectedAnswer === index) {
                return `bg-cyan-500/30 border-cyan-400`;
            }
            
            return `bg-gray-800/50 border-white/20 text-gray-200 hover:bg-gray-800/70 hover:border-white/30`;
        };
        
        if (!challenge) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white"><ArrowLeft /> Voltar</button>
                    <p className="text-white/80">Nenhum desafio encontrado.</p>
                </div>
            );
        }

        const isCorrect = selectedAnswer === challenge.correctIndex;

        return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 flex flex-col text-white animate-fade-in">
            <header className="bg-white/10 border-b border-white/20">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                <button onClick={onBack} className="text-white/80 hover:text-white"><ArrowLeft/></button>
                <h1 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-purple-400"/> Desafio Rápido de SQL</h1>
            </div>
            </header>
    
            <main className="flex-1 flex flex-col justify-between p-6">
            <div className="max-w-3xl w-full mx-auto">
                <div className="bg-black/20 p-6 rounded-xl border border-white/10 mb-6">
                    <p className="text-lg text-white/90 mb-4">{challenge.description}</p>
                    <pre className="bg-black/30 p-4 rounded-lg text-sm text-cyan-300 font-mono whitespace-pre-wrap"><code>{challenge.schema}</code></pre>
                </div>
                <h2 className="text-xl font-bold text-center mb-6">{challenge.question}</h2>
                <div className="space-y-3">
                    {challenge.options.map((option, index) => (
                        <button key={index} onClick={() => !showResult && setSelectedAnswer(index)} disabled={showResult} className={`w-full transition-all text-left font-mono text-sm p-4 rounded-xl border-2 ${getOptionClasses(index)}`}>
                            <code>{option}</code>
                        </button>
                    ))}
                </div>
            </div>
                <footer className="mt-8">
                    {showResult && (
                    <div className={`max-w-3xl w-full mx-auto p-5 rounded-xl mb-4 animate-fade-in ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <div className="flex items-center gap-3 mb-3">{isCorrect ? <><Check /><span className="text-green-400 font-bold text-lg">Correto! 🎉</span></> : <><X /><span className="text-red-400 font-bold text-lg">Incorreto</span></>}</div>
                        <p className="text-white/90">{challenge.explanation}</p>
                    </div>
                )}
                <div className="max-w-3xl w-full mx-auto">
                    {!showResult ? (
                    <button onClick={handleCheckAnswer} disabled={selectedAnswer === null} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform">Verificar</button>
                    ) : (
                    <button onClick={handleNext} className={`w-full text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>Gerar Novo Desafio</button>
                    )}
                </div>
                </footer>
            </main>
        </div>
        );
    });

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // --- NOVA VERSÃO COMPLETA DO PRACTICEVIEW (TEXTO LIVRE) ---
    const PracticeView = memo(({ currentLesson, userProgress, onNavigate, onPracticeComplete }) => {
        const [showResult, setShowResult] = useState(false);
        const [userQueryText, setUserQueryText] = useState(""); // 🔥 novo: texto da query escrita pelo usuário
    
        // Normaliza a query para comparação
        const normalizeQuery = (query) => {
            if (!query) return "";
            return query
                .replace(/;$/, '')            // remove ; final
                .replace(/\s+/g, ' ')         // normaliza múltiplos espaços
                .trim()
                .toLowerCase();               // ignora maiúsculas/minúsculas
        };
    
        // Determina se o usuário acertou
        const isCorrect =
            normalizeQuery(userQueryText) === normalizeQuery(currentLesson.correctQuery);
    
        // Ao trocar de lição, limpamos tudo
        useEffect(() => {
            setShowResult(false);
            setUserQueryText("");
        }, [currentLesson]);
    
        const progress = showResult ? 100 : 0;
    
        const handleCheck = () => setShowResult(true);
        const handleContinue = () => onPracticeComplete(isCorrect);
    
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col">
    
                {/* HEADER */}
                <header className="bg-white/10 border-b border-white/20">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                        <button
                            onClick={() => onNavigate("trailDetail")}
                            className="text-white/80 hover:text-white"
                        >
                            <X />
                        </button>
    
                        {/* PROGRESS BAR */}
                        <div className="w-full bg-white/20 h-4 rounded-full">
                            <div
                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
    
                        {/* LIVES */}
                        <div className="flex items-center gap-2 text-red-400">
                            <Heart />
                            <span className="font-bold">{userProgress.lives}</span>
                        </div>
                    </div>
                </header>
    
                {/* MAIN */}
                <main className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentLesson.title}</h2>
                    <p className="text-lg text-white/80 mb-6">{currentLesson.description}</p>
    
                    {/* SCHEMA */}
                    <div className="bg-black/20 p-4 rounded-xl border border-white/10 mb-6">
                        <h3 className="text-sm text-white/70 mb-2">Schema da Tabela:</h3>
                        <pre className="bg-black/30 p-4 rounded-lg text-sm text-cyan-300 font-mono whitespace-pre-wrap">
                            <code>{currentLesson.schema}</code>
                        </pre>
                    </div>
    
                    {/* INPUT DE TEXTO */}
                    <h3 className="text-sm text-white/70 mb-2">Digite sua Query Completa:</h3>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/10 mb-6">
                        <textarea
                            value={userQueryText}
                            onChange={(e) => setUserQueryText(e.target.value)}
                            placeholder="Ex: SELECT * FROM clientes;"
                            className="w-full min-h-[160px] bg-transparent text-white font-mono text-sm p-3 rounded resize-none focus:outline-none"
                        />
                    </div>
    
                    {/* BOTÃO LIMPAR */}
                    <button
                        onClick={() => setUserQueryText("")}
                        disabled={showResult || userQueryText.length === 0}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 mb-6"
                    >
                        Limpar
                    </button>
                </main>
    
                {/* FOOTER */}
                <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                    <div className="max-w-4xl mx-auto">
    
                        {/* VERIFICAR */}
                        {!showResult ? (
                            <button
                                onClick={handleCheck}
                                disabled={userQueryText.trim() === ""}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                Verificar
                            </button>
                        ) : (
                            <div className="animate-fade-in">
    
                                {/* RESULTADO */}
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? (
                                        <>
                                            <Check />
                                            <span className="text-green-400 font-bold text-lg">
                                                Correto!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <X />
                                            <span className="text-red-400 font-bold text-lg">
                                                Incorreto
                                            </span>
                                        </>
                                    )}
                                </div>
    
                                {/* EXPLICAÇÃO */}
                                <p className="text-white/90 mb-4 font-mono">
                                    {isCorrect
                                        ? `Perfeito! A query "${currentLesson.correctQuery}" está correta.`
                                        : `A query correta é: ${currentLesson.correctQuery}`}
                                </p>
    
                                {/* CONTINUAR */}
                                <button
                                    onClick={handleContinue}
                                    className={`w-full text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform ${
                                        isCorrect
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                            : "bg-gradient-to-r from-orange-500 to-red-500"
                                    }`}
                                >
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        );
    });




    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);

    })(); // Fim da IIFE
