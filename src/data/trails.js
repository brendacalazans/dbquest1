/**
 * Dados das Trilhas de Aprendizado - DBQuest
 * 
 * Contém todas as trilhas, lições, artigos e questões do sistema
 */

const trails = [
    {
        id: 'trail1',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-400',
        title: 'Fundamentos de SQL',
        description: 'Comece sua jornada aprendendo os comandos básicos de SQL.',
        lessons: [
            { 
                id: 'l1-1', 
                title: 'O que é um Banco de Dados?', 
                type: 'article', 
                duration: '5 min', 
                xp: 20, 
                content: 'Um banco de dados é uma coleção organizada de informações - ou dados - estruturadas, geralmente armazenadas eletronicamente em um sistema de computador. Um banco de dados é geralmente controlado por um sistema de gerenciamento de banco de dados (DBMS). Juntos, os dados e o DBMS, juntamente com os aplicativos associados a eles, são chamados de sistema de banco de dados, ou simplesmente banco de dados.\n\nDados dentro dos tipos mais comuns de bancos de dados em operação atualmente são normalmente modelados em linhas e colunas em uma série de tabelas para tornar o processamento e a consulta de dados eficientes. Os dados podem ser facilmente acessados, gerenciados, modificados, atualizados, controlados e organizados. A maioria dos bancos de dados usa a linguagem de consulta estruturada (SQL) para escrever e consultar dados.' 
            },
            { 
                id: 'l1-2', 
                title: 'Introdução ao SELECT', 
                type: 'lesson', 
                duration: '10 min', 
                xp: 50, 
                questions: [
                    { 
                        question: 'Qual comando é usado para buscar dados de uma tabela?', 
                        options: ['GET', 'SELECT', 'FETCH', 'PULL'], 
                        correct: 1, 
                        explanation: 'O comando SELECT é usado para consultar e extrair dados de um banco de dados.' 
                    },
                    { 
                        question: 'Qual símbolo seleciona todas as colunas?', 
                        options: ['*', '#', 'ALL', '&'], 
                        correct: 0, 
                        explanation: 'O asterisco (*) é um curinga que seleciona todas as colunas da tabela.' 
                    }
                ]
            },
            { 
                id: 'l1-3', 
                title: 'Filtrando com WHERE', 
                type: 'lesson', 
                duration: '12 min', 
                xp: 60, 
                questions: [
                    { 
                        question: 'Qual cláusula filtra os resultados?', 
                        options: ['FILTER', 'WHERE', 'IF', 'FIND'], 
                        correct: 1, 
                        explanation: 'A cláusula WHERE é usada para filtrar registros que satisfazem uma condição específica.' 
                    },
                    { 
                        question: 'Como você selecionaria usuários com idade superior a 18?', 
                        options: ['SELECT * FROM users WHERE age > 18', 'SELECT * FROM users IF age > 18', 'SELECT * FROM users FILTER age > 18', 'SELECT * FROM users WITH age > 18'], 
                        correct: 0, 
                        explanation: 'A sintaxe correta usa WHERE seguido da condição `age > 18`.' 
                    }
                ]
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
            { 
                id: 'l2-1', 
                title: 'Unindo Tabelas com JOIN', 
                type: 'lesson', 
                duration: '15 min', 
                xp: 75, 
                questions: [
                    { 
                        question: 'Qual comando combina linhas de duas ou mais tabelas?', 
                        options: ['COMBINE', 'MERGE', 'JOIN', 'LINK'], 
                        correct: 2, 
                        explanation: 'O comando JOIN é usado para combinar linhas de duas ou mais tabelas com base em uma coluna relacionada entre elas.' 
                    }
                ]
            },
            { 
                id: 'l2-2', 
                title: 'Agrupando com GROUP BY', 
                type: 'lesson', 
                duration: '15 min', 
                xp: 75, 
                questions: [
                    { 
                        question: 'Qual cláusula é usada com funções agregadas para agrupar o conjunto de resultados por uma ou mais colunas?', 
                        options: ['GROUP BY', 'ORDER BY', 'HAVING', 'CLUSTER BY'], 
                        correct: 0, 
                        explanation: 'A cláusula GROUP BY é usada para agrupar linhas que têm os mesmos valores em colunas especificadas.' 
                    }
                ]
            }
        ]
    },
    {
        id: 'trail3',
        icon: '🌌',
        color: 'from-pink-500 to-rose-500',
        title: 'SQL Avançado',
        description: 'Domine subconsultas, índices e otimização de performance.',
        lessons: [
            { 
                id: 'l3-1', 
                title: 'Subconsultas (Subqueries)', 
                type: 'article', 
                duration: '10 min', 
                xp: 40, 
                content: 'Uma subconsulta é uma consulta SQL aninhada dentro de outra consulta SQL. Elas podem ser usadas em cláusulas WHERE, FROM ou SELECT para realizar operações complexas e filtrar dados com base nos resultados de outra consulta.' 
            },
            { 
                id: 'l3-2', 
                title: 'Prática de Subconsulta', 
                type: 'practice', 
                duration: '20 min', 
                xp: 100, 
                questions: [
                    { 
                        question: 'Qual comando você usaria para encontrar clientes que fizeram pedidos?', 
                        options: ['SELECT nome FROM clientes WHERE id IN (SELECT cliente_id FROM pedidos)', 'SELECT nome FROM clientes WHERE EXISTS pedidos', 'SELECT nome FROM clientes JOIN pedidos', 'SELECT nome FROM clientes AND pedidos'], 
                        correct: 0, 
                        explanation: 'Usar `IN` com uma subconsulta `(SELECT cliente_id FROM pedidos)` é uma maneira eficaz de encontrar clientes que existem na tabela de pedidos.' 
                    }
                ]
            }
        ]
    }
];

export default trails;

