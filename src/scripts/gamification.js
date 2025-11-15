/**
 * Sistema de Gamificação - DBQuest
 * * Contém toda a lógica de gamificação (XP, vidas, streak, etc.)
 */

/**
 * Manipula a conclusão de uma lição e atualiza o progresso do usuário
 * @param {object} userProgress - Progresso atual do usuário
 * @param {string} lessonId - ID da lição concluída
 * @param {number} lessonXP - XP ganho na lição
 * @param {string} userId - ID do usuário
 * @param {object} db - Instância do Firebase Database
 * @param {function} ref - Função ref do Firebase
 * @param {function} update - Função update do Firebase
 * @returns {number} Novo total de XP
 */
const handleLessonCompletion = (userProgress, lessonId, lessonXP, userId, db, ref, update) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia
    
    const lastCompletedDate = userProgress.lastCompletedLessonDate 
        ? new Date(userProgress.lastCompletedLessonDate) 
        : null;
    
    if (lastCompletedDate) {
        lastCompletedDate.setHours(0, 0, 0, 0); // Zera a hora da última data
    }

    // LÓGICA DE STREAK (A sua lógica está ótima e foi mantida)
    let newStreak = userProgress.streak || 0;
    let streakIncreasedToday = false; // ✨ Flag para bônus de gema
    
    if (!lastCompletedDate) {
        // Primeira lição do usuário - inicia o streak
        newStreak = 1;
        streakIncreasedToday = true; // ✨ Streak iniciou
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
            // Já completou uma lição hoje - mantém o streak atual
            newStreak = userProgress.streak || 1;
            streakIncreasedToday = false; // ✨ Sem aumento de streak
            console.log("Lição completada hoje, ofensiva mantida:", newStreak, "dias");
        } else if (lastCompletedTime === yesterdayTime) {
            // Completou lição ontem - incrementa o streak
            newStreak = (userProgress.streak || 0) + 1;
            streakIncreasedToday = true; // ✨ Streak aumentou
            console.log("Ofensiva incrementada! Dias consecutivos:", newStreak);
        } else if (lastCompletedTime < yesterdayTime) {
            // Completou há 2 ou mais dias - perdeu o streak, recomeça do 1
            newStreak = 1;
            streakIncreasedToday = true; // ✨ Streak resetou para 1
            console.log("Ofensiva perdida! Recomeçando do dia 1");
        } else {
            // Caso de segurança (não deveria acontecer)
            newStreak = userProgress.streak || 1;
            console.log("Ofensiva mantida (caso padrão):", newStreak);
        }
    }

    const newXP = (Number(userProgress.totalXP) || 0) + (Number(lessonXP) || 0);
    const newLevel = Math.floor(newXP / 100) + 1;
    const completed = [...(userProgress.completedLessons || [])];
    
    const isNewLesson = !completed.includes(lessonId); // ✨ Verifica se a lição é nova
    if (isNewLesson) {
        completed.push(lessonId);
    }

    // --- ✨ INÍCIO DA LÓGICA DE GEMAS ---
    let newGems = Number(userProgress.gems) || 0;
    let gemsAwarded = 0;
    const BASE_GEM_REWARD = 5;       // Recompensa base por lição nova
    const STREAK_BONUS_MILESTONE = 5;  // Bônus a cada 5 dias
    const STREAK_BONUS_AMOUNT = 25;    // Quantidade do bônus

    // 1. Recompensa base (apenas se a lição for nova)
    if (isNewLesson) {
        gemsAwarded += BASE_GEM_REWARD;
        console.log(`+${BASE_GEM_REWARD} gemas por completar uma nova lição!`);
    }

    // 2. Bônus de Ofensiva (Streak)
    // Só dá o bônus se o streak aumentou HOJE (para não dar bônus em toda lição do dia)
    if (streakIncreasedToday && newStreak > 0 && newStreak % STREAK_BONUS_MILESTONE === 0) {
        gemsAwarded += STREAK_BONUS_AMOUNT;
        console.log(`BÔNUS DE OFENSIVA! +${STREAK_BONUS_AMOUNT} gemas por ${newStreak} dias!`);
    }

    newGems += gemsAwarded;
    // --- ✨ FIM DA LÓGICA DE GEMAS ---

    const updates = {
        totalXP: newXP,
        level: newLevel,
        streak: newStreak,
        gems: newGems, // ✨ ADICIONADO AO UPDATE
        lastCompletedLessonDate: new Date().toISOString(), // Salva a data E hora exata
        completedLessons: completed
    };

    update(ref(db, `users/${userId}/gamification`), updates);
    update(ref(db, `leaderboard/${userId}`), { totalXP: newXP, streak: newStreak, gems: newGems }); // ✨ Atualiza gemas no leaderboard
    
    return newXP; // Mantém o retorno original para compatibilidade com App.js
};

/**
 * Recarrega vidas usando gemas
 * (Nenhuma alteração necessária aqui, mas incluído para integridade)
 */
const handleRefillLives = (userProgress, userId, db, ref, update, setUserProgress, setToast, onNavigate) => {
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
            lastLifeResetDate: new Date().setHours(0, 0, 0, 0)
        });
        
        setUserProgress(prev => ({ 
            ...prev, 
            gems: newGems, 
            lives: newLives, 
            cooldownUntil: null 
        }));
        
        setToast({ message: 'Vidas recarregadas com sucesso!', type: 'success' });
        onNavigate('home');
        
        return true;
    } else {
        setToast({ message: 'Gemas insuficientes!', type: 'error' });
        return false;
    }
};

/**
 * Verifica e reseta vidas diariamente
 * (Nenhuma alteração necessária)
 */
const checkDailyLifeReset = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const lastResetDate = data.lastLifeResetDate ? new Date(data.lastLifeResetDate) : null;
    let lives = data.gamification.lives;
    let cooldown = data.cooldownUntil ? new Date(data.cooldownUntil) : null;
    
    const updates = {};
    let needsUpdate = false;

    // Verifica reset diário de vidas
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

    // Verifica se o cooldown terminou
    if (cooldown && cooldown.getTime() <= Date.now()) {
        updates['gamification/lives'] = 5;
        updates['cooldownUntil'] = null;
        updates['lastLifeResetDate'] = todayTimestamp;
        lives = 5;
        needsUpdate = true;
    }

    return { updates, needsUpdate, lives, cooldown };
};

/**
 * Verifica e reseta streak se necessário
 * (Nenhuma alteração necessária)
 */
const checkStreakReset = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const updates = {};
    let needsUpdate = false;
    
    const lastCompleted = data.gamification?.lastCompletedLessonDate 
        ? new Date(data.gamification.lastCompletedLessonDate) 
        : null;
    
    if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        if (lastCompleted.getTime() < yesterday.getTime()) {
            updates['gamification/streak'] = 0;
            needsUpdate = true;
            console.log("Streak resetado - usuário não completou lição ontem");
        }
    }
    
    return { updates, needsUpdate };
};

export {
    handleLessonCompletion,
    handleRefillLives,
    checkDailyLifeReset,
    checkStreakReset
};
