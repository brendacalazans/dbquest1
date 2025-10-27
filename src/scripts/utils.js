/**
 * Funções Utilitárias - DBQuest
 * 
 * Contém funções auxiliares usadas em toda a aplicação
 */

/**
 * Obtém as iniciais de um nome para exibição em avatar
 * @param {string} name - Nome completo do usuário
 * @returns {string} Iniciais ou emoji padrão
 */
const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.length === 0) return '👤';
    const words = name.split(' ');
    if (words.length > 1 && words[words.length - 1].length > 0) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
};

/**
 * Obtém informações de tipo de conteúdo (label, ícone, cor)
 * @param {string} type - Tipo do conteúdo (article, lesson, theory, practice)
 * @returns {object} Objeto com label, icon, color e bgGradient
 */
const getContentTypeInfo = (type) => {
    // Nota: Os ícones devem ser importados do arquivo icons.js
    switch (type) {
        case 'article': 
            return { 
                label: 'Artigo', 
                icon: 'FileText', 
                color: 'border-blue-400 text-blue-300', 
                bgGradient: 'from-blue-900/30 to-blue-800/20' 
            };
        case 'lesson': 
            return { 
                label: 'Aula', 
                icon: 'GraduationCap', 
                color: 'border-cyan-400 text-cyan-300', 
                bgGradient: 'from-cyan-900/30 to-cyan-800/20' 
            };
        case 'theory': 
            return { 
                label: 'Teoria', 
                icon: 'BookOpen', 
                color: 'border-purple-400 text-purple-300', 
                bgGradient: 'from-purple-900/30 to-purple-800/20' 
            };
        case 'practice': 
            return { 
                label: 'Prática', 
                icon: 'PenTool', 
                color: 'border-green-400 text-green-300', 
                bgGradient: 'from-green-900/30 to-green-800/20' 
            };
        default: 
            return { 
                label: 'Conteúdo', 
                icon: 'FileText', 
                color: 'border-gray-400 text-gray-300', 
                bgGradient: 'from-gray-900/30 to-gray-800/20' 
            };
    }
};

/**
 * Formata tempo restante em formato HH:MM:SS
 * @param {Date} targetDate - Data alvo
 * @returns {string} Tempo formatado
 */
const formatTimeRemaining = (targetDate) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export {
    getInitials,
    getContentTypeInfo,
    formatTimeRemaining
};

