(function() {
    const {
        auth, db, onAuthStateChanged, createUserWithEmailAndPassword,
        signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,
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
                    title: 'Prática: Inserção de Dados (INSERT)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para inserir um novo cliente com: ID_Cliente = 4, Nome = \'Daniel\', Sobrenome = \'Pereira\', Email = \'daniel.p@email.com\', Cidade = \'Curitiba\'.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Sobrenome VARCHAR(50),\n  Email VARCHAR(100),\n  Cidade VARCHAR(50)\n);',
                    correctQuery: 'INSERT INTO clientes (ID_Cliente, Nome, Sobrenome, Email, Cidade) VALUES (4, \'Daniel\', \'Pereira\', \'daniel.p@email.com\', \'Curitiba\');',
                    queryParts: ['INSERT INTO', 'clientes', '(', 'ID_Cliente', ',', 'Nome', ',', 'Sobrenome', ',', 'Email', ',', 'Cidade', ')', 'VALUES', '(', '4', ',', "'Daniel'", ',', "'Pereira'", ',', "'daniel.p@email.com'", ',', "'Curitiba'", ')', ';'] 
                },
                { 
                    id: 't1-p6', 
                    title: 'Prática: Atualização de Dados (UPDATE)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando para atualizar o `Email` para \'ana.costa.novo@email.com\', especificamente para o cliente com `ID_Cliente` igual a 1.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50),\n  Email VARCHAR(100)\n);',
                    correctQuery: 'UPDATE clientes SET Email = \'ana.costa.novo@email.com\' WHERE ID_Cliente = 1;',
                    queryParts: ['UPDATE', 'clientes', 'SET', 'Email', '=', "'ana.costa.novo@email.com'", 'WHERE', 'ID_Cliente', '=', '1', ';'] 
                },
                { 
                    id: 't1-p7', 
                    title: 'Prática: Exclusão de Dados (DELETE)', 
                    type: 'practice',
                    duration: '10 min',
                    xp: REWARD_CONFIG.practice.xp,
                    description: 'Tabela: `clientes`. Escreva o comando SQL para excluir o registro da tabela `clientes` onde o `ID_Cliente` seja 4.',
                    schema: 'CREATE TABLE clientes (\n  ID_Cliente INT,\n  Nome VARCHAR(50)\n);',
                    correctQuery: 'DELETE FROM clientes WHERE ID_Cliente = 4;',
                    queryParts: ['DELETE FROM', 'clientes', 'WHERE', 'ID_Cliente', '=', '4', ';'] 
                }
            ]
        },
                {
                    id: 'trail2',
                    icon: '🧩',
                    color: 'from-purple-500 to-indigo-400',
                    title: 'SQL Intermediário',
                    description: 'Aprofunde-se com JOINs, GROUP BY e funções agregadas.',
                    lessons: [
                        { id: 'l2-1', title: 'Unindo Tabelas com JOIN', type: 'lesson', duration: '15 min', xp: 75, questions: [
                            { question: 'Qual comando combina linhas de duas ou mais tabelas?', options: ['COMBINE', 'MERGE', 'JOIN', 'LINK'], correct: 2, explanation: 'O comando JOIN é usado para combinar linhas de duas ou mais tabelas com base em uma coluna relacionada entre elas.' }
                        ]},
                        { id: 'l2-2', title: 'Agrupando com GROUP BY', type: 'lesson', duration: '15 min', xp: 75, questions: [
                            { question: 'Qual cláusula é usada com funções agregadas para agrupar o conjunto de resultados por uma ou mais colunas?', options: ['GROUP BY', 'ORDER BY', 'HAVING', 'CLUSTER BY'], correct: 0, explanation: 'A cláusula GROUP BY é usada para agrupar linhas que têm os mesmos valores em colunas especificadas.' }
                        ]}
                    ]
                },
                {
                    id: 'trail3',
                    icon: '🌌',
                    color: 'from-pink-500 to-rose-500',
                    title: 'SQL Avançado',
                    description: 'Domine subconsultas, índices e otimização de performance.',
                    lessons: [
                        { id: 'l3-1', title: 'Subconsultas (Subqueries)', type: 'article', duration: '10 min', xp: 40, content: 'Uma subconsulta é uma consulta SQL aninhada dentro de outra consulta SQL. Elas podem ser usadas em cláusulas WHERE, FROM ou SELECT para realizar operações complexas e filtrar dados com base nos resultados de outra consulta.' },
                        { id: 'l3-2', title: 'Prática de Subconsulta', type: 'practice', duration: '20 min', xp: 100, questions: [
                            { question: 'Qual comando você usaria para encontrar clientes que fizeram pedidos?', options: ['SELECT nome FROM clientes WHERE id IN (SELECT cliente_id FROM pedidos)', 'SELECT nome FROM clientes WHERE EXISTS pedidos', 'SELECT nome FROM clientes JOIN pedidos', 'SELECT nome FROM clientes AND pedidos'], correct: 0, explanation: 'Usar `IN` com uma subconsulta `(SELECT cliente_id FROM pedidos)` é uma maneira eficaz de encontrar clientes que existem na tabela de pedidos.' }
                        ]}
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
                await signInWithPopup(auth, provider);
                // Success is handled by onAuthStateChanged in App
            } catch (error) {
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

        const [lastGainedXP, setLastGainedXP] = useState(0);
        const [practiceResult, setPracticeResult] = useState(null); // 'correct' ou 'incorrect'

        // --- EFEITOS (Restaurados) ---
        // Efeito: Observador de Autenticação
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUserId(user ? user.uid : null);
                setIsAuthChecked(true);
            });
            return () => unsubscribe(); // Limpa ao desmontar
        }, []);

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
                            },
                            cooldownUntil: null,
                            lastLifeResetDate: new Date().setHours(0,0,0,0)
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
        }, [userId, db, auth]); // Adicionado 'get'

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
            setPracticeResult(null); // <-- Limpa o resultado anterior
            
            // --- LÓGICA ATUALIZADA ---
            if (lesson.type === 'article') {
                setCurrentView('article');
            
            } else if (lesson.videoId) { 
                setCurrentView('video'); 
            
            } else if (lesson.type === 'practice') {
                // NOVO: Direciona para a view de Prática
                setCurrentView('practice');
            
            } else { 
                // Quiz (lesson, theory)
                setCurrentView('lesson');
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
        
        // --- LÓGICA DE OFENSIVA (STREAK) CORRIGIDA ---
       const handleLessonCompletion = (lessonId, lessonXP) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia
            
            const lastCompletedDate = userProgress.lastCompletedLessonDate ? new Date(userProgress.lastCompletedLessonDate) : null;
            if (lastCompletedDate) {
                lastCompletedDate.setHours(0, 0, 0, 0); // Zera a hora da última data
            }

            let newStreak = userProgress.streak;
            // Só incrementa a ofensiva se a última lição foi ANTES de hoje
            if (!lastCompletedDate || lastCompletedDate.getTime() < today.getTime()) {
                newStreak += 1;
                console.log("Ofensiva incrementada!");
            } else {
                console.log("Lição completada hoje, ofensiva mantida.");
            }

            // --- INÍCIO DA LÓGICA DE REVISÃO ---
            const isAlreadyCompleted = (userProgress.completedLessons || []).includes(lessonId);
            let gainedXP = 0; // Por padrão, não ganha XP

            const completed = [...(userProgress.completedLessons || [])];
            
            if (!isAlreadyCompleted) {
                // Se for a primeira vez, ganha XP e adiciona à lista
                gainedXP = Number(lessonXP) || 0;
                completed.push(lessonId);
                console.log("Primeira vez completando! XP Ganhos:", gainedXP);
            } else {
                // Se for revisão, não ganha XP
                console.log("Revisão de lição. Nenhum XP ganho.");
            }
            // --- FIM DA LÓGICA DE REVISÃO ---

            const newTotalXP = (Number(userProgress.totalXP) || 0) + gainedXP;
            const newLevel = Math.floor(newTotalXP / 100) + 1;
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
                    const { gainedXP } = handleLessonCompletion(currentLesson.id, currentLesson.xp);
                    setLastGainedXP(gainedXP); // <-- Salva o XP ganho
                    setCurrentView('completion');
                } else {
                    // Falhou na lição
                    setLastGainedXP(0); // <-- Garante que é 0 se falhar
                    setCurrentView('completion'); // Mostra os resultados mesmo se falhar
                }
            }
        }, [currentQuestion, currentLesson, answeredQuestions, userProgress, userId, db]);
        
        const handleArticleCompletion = useCallback(() => {
            // Chama a nova função centralizada
            const { gainedXP } = handleLessonCompletion(currentLesson.id, currentLesson.xp);
            
            setCurrentView('home'); // Volta para a home
            
            // Toast condicional
            if (gainedXP > 0) {
                setToast({ message: `Concluído! +${gainedXP} XP`, type: 'success' });
            } else {
                setToast({ message: "Conteúdo revisado!", type: 'success' });
            }
            
        }, [currentLesson, userProgress, userId, db]);
        
        
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

        const checkPracticeAnswer = useCallback((userQueryParts) => {
            if (showResult) return;

            const correctQuery = currentLesson.queryParts.join(' ');
            const userQuery = userQueryParts.join(' ');
            const isCorrect = userQuery === correctQuery;
            
            setShowResult(true);

            if (isCorrect) {
                setPracticeResult('correct');
            } else {
                setPracticeResult('incorrect');
                // Lógica de perder vida
                const newLives = userProgress.lives - 1;
                setUserProgress(prev => ({ ...prev, lives: newLives }));
                update(ref(db, `users/${userId}/gamification`), { lives: newLives });
                
                if (newLives <= 0) {
                    const cooldownTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
                    setUserProgress(prev => ({ ...prev, cooldownUntil: cooldownTime.toISOString() }));
                    update(ref(db, `users/${userId}`), { cooldownUntil: cooldownTime.toISOString() });
                }
            }
        }, [showResult, currentLesson, userProgress.lives, userId, db]);

        const nextPracticeStep = useCallback(() => {
            setShowResult(false);
            
            if (practiceResult === 'correct') {
                // Acertou -> Completa a lição e vai para a tela de conclusão
                const { gainedXP } = handleLessonCompletion(currentLesson.id, currentLesson.xp);
                setLastGainedXP(gainedXP);
                // ATENÇÃO: A tela 'completion' é para quizzes (mostra % de acerto)
                // O ideal seria criar uma 'PracticeCompletionView', mas por agora
                // vamos apenas para a home com um toast.
                if (gainedXP > 0) {
                    setToast({ message: `Prática concluída! +${gainedXP} XP`, type: 'success' });
                } else {
                    setToast({ message: "Prática revisada!", type: 'success' });
                }
                setCurrentView('home');
            } else {
                // Errou -> Reseta a lição prática (o 'useEffect' no PracticeView vai cuidar disso)
                setPracticeResult(null);
                // Força o 'PracticeView' a recarregar o state resetando o 'currentLesson' para si mesmo
                setCurrentLesson({...currentLesson}); 
            }
        }, [practiceResult, currentLesson, userProgress, userId, db]);

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
        
        const ArticleView = memo(({ currentLesson, onNavigate }) => {
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col animate-fade-in">
                    <header className="bg-white/10 border-b border-white/20">
                        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                            <button onClick={() => onNavigate('trailDetail')} className="text-white/80 hover:text-white"><ArrowLeft/></button>
                            <div className="w-full bg-white/20 h-4 rounded-full"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{width: '100%'}} /></div>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
                        <h2 className="text-3xl font-bold mb-6">{currentLesson.title}</h2>
                        <div className="prose prose-invert prose-lg text-white/90 max-w-none space-y-4">
                            {currentLesson.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </main>
                    <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={onNavigate}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform"
                            >
                                Concluir Artigo
                            </button>
                        </div>
                    </footer>
                </div>
            );
        });

        const VideoView = memo(({ currentLesson, onNavigate, onComplete }) => {
            // Cria a URL de "embed" correta para o YouTube
            const videoSrc = `https://www.youtube.com/embed/${currentLesson.videoId}`;
            
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col animate-fade-in">
                    <header className="bg-white/10 border-b border-white/20">
                        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                            {/* Botão de voltar para os detalhes da trilha */}
                            <button onClick={() => onNavigate('trailDetail')} className="text-white/80 hover:text-white"><ArrowLeft/></button>
                            <div className="flex-1">
                                <h3 className="text-white font-bold truncate">{currentLesson.title}</h3>
                            </div>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
                        {/* Box com aspect-ratio de 16:9 para o vídeo */}
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={videoSrc}
                                title={currentLesson.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </main>
                    <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={onComplete} // Reutiliza a função de completar
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform"
                            >
                                Concluir Vídeo
                            </button>
                        </div>
                    </footer>
                </div>
            );
        });

        const PracticeView = memo(({ 
            currentLesson, 
            userProgress, 
            onNavigate, 
            onCheckPractice, 
            onNext,
            showResult, 
            practiceResult
        }) => {
            const [userQueryParts, setUserQueryParts] = useState([]);
            const [availableParts, setAvailableParts] = useState([]);

            // Reseta e embaralha as partes quando a lição muda
            useEffect(() => {
                if (currentLesson && currentLesson.queryParts) {
                    // Embaralha o array de 'queryParts' para criar o banco de opções
                    const shuffled = [...currentLesson.queryParts].sort(() => Math.random() - 0.5);
                    setAvailableParts(shuffled);
                    setUserQueryParts([]);
                }
            }, [currentLesson]);

            // Adiciona uma parte à query do usuário
            const handleSelectPart = (part, index) => {
                if (showResult) return;
                const newAvailable = [...availableParts];
                newAvailable.splice(index, 1); // Remove do banco
                setAvailableParts(newAvailable);
                setUserQueryParts([...userQueryParts, part]); // Adiciona à query
            };
            
            // Remove uma parte da query do usuário
            const handleRemovePart = (part, index) => {
                if (showResult) return;
                const newQuery = [...userQueryParts];
                newQuery.splice(index, 1); // Remove da query
                setUserQueryParts(newQuery);
                setAvailableParts([...availableParts, part]); // Devolve ao banco
            };
            
            const isCorrect = practiceResult === 'correct';

            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col">
                    <header className="bg-white/10 border-b border-white/20">
                        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                            <button onClick={() => onNavigate('trailDetail')} className="text-white/80 hover:text-white"><X/></button>
                            <h3 className="text-white font-bold truncate">{currentLesson.title}</h3>
                            <div className="flex items-center gap-2 text-red-400 ml-auto"> <Heart /> <span className="font-bold">{userProgress.lives}</span> </div>
                        </div>
                    </header>

                    <main className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">{currentLesson.description}</h2>
                        <pre className="bg-black/20 p-4 rounded-lg text-sm text-cyan-300 font-mono whitespace-pre-wrap mb-6"><code>{currentLesson.schema}</code></pre>

                        {/* Área da Query (onde o usuário monta) */}
                        <div className="bg-black/20 border-2 border-dashed border-white/20 rounded-lg min-h-[120px] p-3 flex flex-wrap gap-2">
                            {userQueryParts.map((part, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleRemovePart(part, index)}
                                    disabled={showResult}
                                    className="bg-cyan-600 text-white font-mono font-bold px-3 py-2 rounded-md hover:bg-cyan-700"
                                >
                                    {part}
                                </button>
                          ))}
                        </div>

                        {/* Banco de Opções */}
                        <div className="mt-8 p-3 flex flex-wrap justify-center gap-2">
                            {availableParts.map((part, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleSelectPart(part, index)}
                                    disabled={showResult}
                                    className="bg-gray-700/80 text-white font-mono font-bold px-3 py-2 rounded-md hover:bg-gray-600"
                                >
                                    {part}
                                </button>
                            ))}
                        </div>
                    </main>
                    
                  {/* Footer de Resultado/Ação */}
                    {showResult ? (
                        <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0 animate-fade-in">
                            <div className="max-w-3xl mx-auto">
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? <><Check /><span className="text-green-400 font-bold text-lg">Correto!</span></> : <><X /><span className="text-red-400 font-bold text-lg">Incorreto</span></>}
                                </div>
                                <p className="text-white/90 mb-4">
                                    {isCorrect ? 'Excelente! Você construiu a query corretamente.' : 'Ops! Essa não é a query correta. Tente de novo.'}
                                </p>
                                <button
                                    onClick={() => onNext(userQueryParts)} // Passa a query para onNext
                                    className={`w-full text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                                >
                                    {isCorrect ? 'Continuar' : 'Tentar Novamente'}
                                </button>
                            </div>
                        </footer>
                    ) : (
                        <footer className="bg-white/10 border-t border-white/20 p-6 sticky bottom-0">
                            <div className="max-w-3xl mx-auto">
                                <button
                                    onClick={() => onCheckPractice(userQueryParts)}
                                    disabled={userQueryParts.length === 0}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    Verificar
                                </button>
                            </div>
                        </footer>
                    )}
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
        
        const CompletionView = memo(({ answeredQuestions, currentLesson, onNavigate, lastGainedXP }) => {
            const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length;
            const totalQuestions = currentLesson.questions.length;
            const isSuccess = correctAnswers === totalQuestions;
            
            // Usa o prop 'lastGainedXP' em vez de recalcular
            const xpGained = lastGainedXP; 
            
            return (
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl w-full">
                        <div className="text-8xl mb-6">{isSuccess ? '🎉' : '🤔'}</div>
                        <h2 className="text-3xl font-bold mb-4">{isSuccess ? 'Lição Concluída!' : 'Quase lá!'}</h2>
                        <p className="text-white/80 text-lg mb-6">
                            {/* Mensagem atualizada */}
                            {isSuccess ? 
                                (xpGained > 0 ? `Você ganhou +${xpGained} XP e manteve sua ofensiva!` : `Lição revisada com sucesso!`) 
                                : 'Você não acertou todas as perguntas. Revise o material e tente novamente!'}
                        </p>
                        
                        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left divide-y divide-white/10">
                            <div className="py-4 flex justify-between items-center"><span className="text-white/70">Precisão</span><span className={`font-bold text-2xl ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>{((correctAnswers / totalQuestions) * 100).toFixed(0)}%</span></div>
                            <div className="py-4 flex justify-between items-center"><span className="text-white/70">Perguntas Corretas</span><span className="font-bold text-2xl">{correctAnswers} de {totalQuestions}</span></div>
                            <div className="py-4 flex justify-between items-center"><span className="text-white/70">XP Ganhos</span><span className="font-bold text-2xl">{xpGained}</span></div>
                        </div>
                        
                        <div className="flex gap-4">
                            {!isSuccess && (
                                <button
                                    onClick={() => onNavigate('lesson')}
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
                case 'article': return <ArticleView currentLesson={currentLesson} onNavigate={handleArticleCompletion} />;
                
                {/* --- ADICIONEI ESTA LINHA --- */}
                case 'video': return <VideoView currentLesson={currentLesson} onNavigate={handleNavigate} onComplete={handleArticleCompletion} />; 

                {/* --- ADICIONE ESTE CASE --- */}
                case 'practice': return <PracticeView 
                    currentLesson={currentLesson}
                    userProgress={userProgress}
                    onNavigate={handleNavigate}
                    onCheckPractice={checkPracticeAnswer}
                    onNext={nextPracticeStep}
                    showResult={showResult}
                    practiceResult={practiceResult}
                />;
                    
                case 'lesson': return <LessonView currentLesson={currentLesson} currentQuestion={currentQuestion} userProgress={userProgress} onCheckAnswer={checkAnswer} onNextQuestion={nextQuestion} onNavigate={handleNavigate} showResult={showResult} answeredQuestions={answeredQuestions} selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} onGetAiExplanation={getAiExplanation} aiExplanation={aiExplanation} isAiExplanationLoading={isAiExplanationLoading} />;
                case 'completion': return <CompletionView answeredQuestions={answeredQuestions} currentLesson={currentLesson} onNavigate={handleNavigate} lastGainedXP={lastGainedXP} />;
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


    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);

    })(); // Fim da IIFE
