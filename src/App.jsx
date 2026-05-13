import React, { useState, useEffect, useRef } from 'react';

// --- GAME DATA & CONFIGURATION ---
const TOTAL_TILES = 36;
const GRID_COLS = 6;

// Banca dati delle domande divise per categoria
const QUESTION_BANK = {
  "Morfologia": [
    { question: "Qual è il genitivo singolare di 'puella'?", answer: "puellae" },
    { question: "Coniuga il verbo 'esse' al presente indicativo, 2a pers. plurale.", answer: "estis" },
    { question: "Qual è l'accusativo plurale di 'amicus'?", answer: "amicos" },
    { question: "Qual è il nominativo plurale del nome neutro 'verbum, -i'?", answer: "verba" },
    { question: "Coniuga 'monere' all'imperfetto indicativo, 1a pers. plurale.", answer: "monebamus" },
    { question: "Declina 'rosa pulchra' al dativo singolare.", answer: "rosae pulchrae" },
    { question: "Qual è l'ablativo plurale di 'donum magnum'?", answer: "donis magnis" },
    { question: "Coniuga 'audire' al presente indicativo, 3a pers. singolare.", answer: "audit" },
    { question: "Coniuga 'legere' al presente indicativo, 1a pers. plurale.", answer: "legimus" },
    { question: "Qual è il vocativo singolare di 'filius'?", answer: "fili" },
    { question: "Coniuga 'esse' all'imperfetto indicativo, 2a pers. singolare.", answer: "eras" },
    { question: "Qual è il genitivo plurale di 'deus'?", answer: "deorum (o deum)" },
    { question: "Coniuga 'venire' all'imperfetto indicativo, 3a pers. plurale.", answer: "veniebant" },
    { question: "Qual è l'ablativo singolare di 'puer parvus'?", answer: "puero parvo" },
    { question: "Coniuga 'ducere' al presente indicativo, 2a pers. plurale.", answer: "ducitis" },
    { question: "Qual è il nominativo plurale del nome 'vir, viri'?", answer: "viri" },
    { question: "Coniuga 'esse' all'imperfetto indicativo, 1a pers. singolare.", answer: "eram" },
    { question: "Qual è il dativo plurale di 'lupus'?", answer: "lupis" },
    { question: "Coniuga 'amare' all'imperfetto indicativo, 3a pers. singolare.", answer: "amabat" },
    { question: "Qual è l'accusativo singolare di 'oppidum'?", answer: "oppidum" },
    { question: "Coniuga 'vidēre' al presente indicativo, 1a pers. singolare.", answer: "video" },
    { question: "Qual è il genitivo singolare di 'magister'?", answer: "magistri" }
  ],
  "Traduzione": [
    { question: "Traduci: 'Magistri discipulos laudant'.", answer: "I maestri lodano gli allievi/discepoli." },
    { question: "Traduci: 'Boni eramus'.", answer: "Noi eravamo buoni." },
    { question: "Traduci: 'Lupus in silva erat'.", answer: "Il lupo era nella selva/nel bosco." },
    { question: "Traduci: 'Puellae rosas amabant'.", answer: "Le fanciulle amavano le rose." },
    { question: "Traduci: 'Romani multa arma habebant'.", answer: "I Romani avevano molte armi." },
    { question: "Traduci: 'Agricola piger est'.", answer: "Il contadino è pigro." },
    { question: "Traduci: 'Pueri in horto ludunt'.", answer: "I fanciulli giocano nel giardino." },
    { question: "Traduci: 'Inimici oppidum delebant'.", answer: "I nemici distruggevano la città/fortezza." },
    { question: "Traduci: 'Amici veri pauci sunt'.", answer: "I veri amici sono pochi." },
    { question: "Traduci: 'Gaudium magnum erat'.", answer: "La gioia era grande." }
  ],
  "Sintassi": [
    { question: "Concorda l'aggettivo 'bonus, -a, -um' con il nome 'nauta' all'accusativo singolare.", answer: "bonum nautam (nauta è maschile!)" },
    { question: "Concorda l'aggettivo 'parvus, -a, -um' con il nome 'agricola' al dativo singolare.", answer: "parvo agricolae" },
    { question: "Concorda l'aggettivo 'saevus, -a, -um' con 'pirata' al genitivo plurale.", answer: "saevorum piratarum" },
    { question: "In quale caso si esprime il complemento di termine?", answer: "Dativo" },
    { question: "Quale caso si usa solitamente per il complemento di mezzo o strumento?", answer: "Ablativo semplice (senza preposizioni)" }
  ]
};

// Database completo delle caselle (Ora indicano solo categoria e punti, la domanda è pescata casualmente)
const boardData = [
  { id: 0, type: "start", label: "Roma", icon: "🏛️" },
  { id: 1, type: "question", category: "Morfologia", points: 10, penalty: -1 },
  { id: 2, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 3, type: "goose", label: "Favore degli Dèi", description: "Vento in poppa! Il viaggio inizia bene. Avanza di 2 caselle.", effect: 2, icon: "🦅" },
  { id: 4, type: "question", category: "Morfologia", points: 10, penalty: -1 },
  { id: 5, type: "question", category: "Traduzione", points: 20, penalty: -2 },
  { id: 6, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 7, type: "trap", label: "Attacco nei Boschi", description: "Imboscata dei briganti! Retrocedi di 3 caselle.", effect: -3, icon: "⚔️" },
  { id: 8, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 9, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 10, type: "goose", label: "Via Appia", description: "La strada è ben lastricata e sicura. Spostati avanti di 3 caselle.", effect: 3, icon: "🛣️" },
  { id: 11, type: "question", category: "Traduzione", points: 15, penalty: -1 },
  { id: 12, type: "question", category: "Morfologia", points: 20, penalty: -2 },
  { id: 13, type: "question", category: "Morfologia", points: 10, penalty: -1 },
  { id: 14, type: "trap", label: "Tempesta", description: "Pioggia torrenziale! Le truppe si fermano. Torna indietro di 2 caselle.", effect: -2, icon: "⛈️" },
  { id: 15, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 16, type: "question", category: "Traduzione", points: 15, penalty: -1 },
  { id: 17, type: "goose", label: "Castra", description: "Riposo nell'accampamento. Riprendi fiato e avanza di 1 casella.", effect: 1, icon: "⛺" },
  { id: 18, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 19, type: "question", category: "Morfologia", points: 10, penalty: 0 },
  { id: 20, type: "question", category: "Sintassi", points: 25, penalty: -2 },
  { id: 21, type: "trap", label: "Disorientamento", description: "Vi siete persi nel foro di una città! Retrocedi di 4 caselle.", effect: -4, icon: "😵" },
  { id: 22, type: "question", category: "Traduzione", points: 15, penalty: -1 },
  { id: 23, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 24, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 25, type: "goose", label: "Oca del Campidoglio", description: "Le oche ti avvisano del pericolo! Salta avanti di 2 caselle.", effect: 2, icon: "🦢" },
  { id: 26, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 27, type: "question", category: "Traduzione", points: 20, penalty: -2 },
  { id: 28, type: "trap", label: "Carro Danneggiato", description: "Le ruote del carro si rompono. Cadi indietro di 1 casella.", effect: -1, icon: "🪵" },
  { id: 29, type: "question", category: "Morfologia", points: 15, penalty: -1 },
  { id: 30, type: "question", category: "Morfologia", points: 10, penalty: 0 },
  { id: 31, type: "question", category: "Morfologia", points: 10, penalty: -1 },
  { id: 32, type: "goose", label: "Profumo di Vittoria", description: "Il traguardo è vicino. Vai dritto di 3 caselle!", effect: 3, icon: "🏃" },
  { id: 33, type: "question", category: "Traduzione", points: 15, penalty: 0 },
  { id: 34, type: "trap", label: "Tradimento", description: "Falsi alleati ti depistano! Fuggi indietro di 3 caselle.", effect: -3, icon: "🐍" },
  { id: 35, type: "end", label: "Trionfo", description: "Hai completato il percorso!", icon: "🏆" }
];

// Garantisce che l'array abbia esattamente TOTAL_TILES elementi in caso di errori
const fullBoardData = Array.from({ length: TOTAL_TILES }, (_, i) => {
  return boardData.find(t => t.id === i) || { id: i, type: "neutral", label: `Casella ${i}` };
});

const INITIAL_PLAYERS = [
  { id: 0, name: "Familia Iulia", color: "bg-red-500", border: "border-red-700", position: 0, score: 0 },
  { id: 1, name: "Familia Claudia", color: "bg-blue-500", border: "border-blue-700", position: 0, score: 0 },
  { id: 2, name: "Familia Flavia", color: "bg-yellow-400", border: "border-yellow-600", position: 0, score: 0 },
  { id: 3, name: "Familia Cornelia", color: "bg-green-500", border: "border-green-700", position: 0, score: 0 },
];

// Funzione per mappare l'ID della casella (0-35) su una griglia CSS 8x8 a forma di serpentina
const getGridPosition = (id) => {
  if (id >= 0 && id <= 7) return { row: 1, col: id + 1 };               // Riga 1: Destra
  if (id === 8) return { row: 2, col: 8 };                              // Riga 2: Scende
  if (id >= 9 && id <= 16) return { row: 3, col: 17 - id };             // Riga 3: Sinistra
  if (id === 17) return { row: 4, col: 1 };                             // Riga 4: Scende
  if (id >= 18 && id <= 25) return { row: 5, col: id - 17 };            // Riga 5: Destra
  if (id === 26) return { row: 6, col: 8 };                             // Riga 6: Scende
  if (id >= 27 && id <= 34) return { row: 7, col: 35 - id };            // Riga 7: Sinistra
  if (id === 35) return { row: 8, col: 1 };                             // Riga 8: Fine
  return { row: 1, col: 1 };
};

export default function IterRomanum() {
  // Game State
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [turnIndex, setTurnIndex] = useState(0);
  const [gameState, setGameState] = useState("IDLE"); // IDLE, ROLLING, MOVING, ACTION, ENDGAME
  const [diceResult, setDiceResult] = useState(null);
  
  // Modal State
  const [modalContent, setModalContent] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const movementRef = useRef(null);
  const timerRef = useRef(null);

  const currentPlayer = players[turnIndex];

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);
  const stopTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(30);
  };

  // --- GAMEPLAY LOGIC ---
  const rollDice = () => {
    if (gameState !== "IDLE") return;
    
    setGameState("ROLLING");
    
    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        setTimeout(() => movePlayer(finalResult), 500);
      }
    }, 50);
  };

  const movePlayer = (steps, isEventMovement = false) => {
    setGameState("MOVING");
    let currentStep = 0;
    let currentPos = isEventMovement ? players[turnIndex].position : players[turnIndex].position;
    
    const direction = steps > 0 ? 1 : -1;
    const absSteps = Math.abs(steps);

    movementRef.current = setInterval(() => {
      if (currentStep < absSteps) {
        currentPos += direction;
        
        if (currentPos >= TOTAL_TILES - 1) {
          currentPos = TOTAL_TILES - 1;
          clearInterval(movementRef.current);
          updatePlayerPosition(currentPos, isEventMovement);
          return;
        }
        if (currentPos < 0) currentPos = 0;

        setPlayers(prev => prev.map((p, idx) => 
          idx === turnIndex ? { ...p, position: currentPos } : p
        ));
        currentStep++;
      } else {
        clearInterval(movementRef.current);
        updatePlayerPosition(currentPos, isEventMovement);
      }
    }, 600); // Velocità del passo rallentata (da 300 a 600ms)
  };

  const updatePlayerPosition = (finalPos, isEventMovement) => {
    setPlayers(prev => prev.map((p, idx) => 
      idx === turnIndex ? { ...p, position: finalPos } : p
    ));

    if (finalPos >= TOTAL_TILES - 1) {
      setGameState("ENDGAME");
      return;
    }

    // Aggiunto ritardo di 800ms e valutata SEMPRE la casella di arrivo,
    // anche se il movimento è stato generato da un bonus/malus.
    setTimeout(() => {
      evaluateTile(finalPos);
    }, 800);
  };

  const evaluateTile = (position) => {
    const tile = fullBoardData[position];
    
    if (tile.type === "neutral" || tile.type === "start") {
      setTimeout(endTurn, 1000);
    } else {
      setGameState("ACTION");
      
      let tileContent = { ...tile };
      
      // Se è una domanda, pesca casualmente dal database in base alla categoria
      if (tile.type === "question" && QUESTION_BANK[tile.category]) {
        const pool = QUESTION_BANK[tile.category];
        const randomQuestion = pool[Math.floor(Math.random() * pool.length)];
        tileContent = { ...tileContent, ...randomQuestion };
      }

      setModalContent(tileContent);
      setShowAnswer(false);
      resetTimer();
    }
  };

  const handleQuestionResult = (isCorrect) => {
    if (!modalContent) return;
    
    const pld = players[turnIndex];
    let newScore = pld.score;
    let movement = 0;

    if (isCorrect) {
      newScore += modalContent.points || 0;
    } else {
      movement = modalContent.penalty || 0;
    }

    setPlayers(prev => prev.map((p, idx) => 
      idx === turnIndex ? { ...p, score: newScore } : p
    ));

    closeModal();

    if (movement !== 0) {
      movePlayer(movement, true);
    } else {
      endTurn();
    }
  };

  const handleEventResult = () => {
    if (!modalContent) return;
    const movement = modalContent.effect || 0;
    closeModal();
    if (movement !== 0) {
      movePlayer(movement, true);
    } else {
      endTurn();
    }
  };

  const closeModal = () => {
    setModalContent(null);
    resetTimer();
  };

  const endTurn = () => {
    setTurnIndex((prev) => (prev + 1) % players.length);
    setGameState("IDLE");
    setDiceResult(null);
  };

  return (
    <div className="flex h-screen w-full bg-stone-100 font-sans text-stone-800 overflow-hidden selection:bg-amber-200">
      
      {/* LEFT: MAIN BOARD (75%) */}
      <div className="w-3/4 p-4 sm:p-8 flex flex-col items-center justify-center relative bg-gradient-to-br from-stone-200 to-stone-300 border-r-4 border-stone-800 shadow-xl z-10">
        
        <div className="absolute top-4 left-6 bg-stone-800 text-amber-50 px-6 py-2 rounded-xl shadow-lg border-2 border-amber-600 z-20">
          <h1 className="text-3xl font-bold uppercase tracking-widest font-serif">Iter Romanum</h1>
          <p className="text-sm text-amber-200 text-center tracking-wide">Ludi Magister</p>
        </div>

        {/* Tabellone con Griglia 8x8 per il percorso a isole separate */}
        <div 
          className="w-full h-full max-h-[90vh] grid gap-2 sm:gap-4 p-4 bg-transparent relative"
          style={{ 
            gridTemplateColumns: `repeat(8, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(8, minmax(0, 1fr))`
          }}
        >
          {fullBoardData.map((tile) => {
            const pos = getGridPosition(tile.id);
            const playersOnTile = players.filter(p => p.position === tile.id);
            
            let tileStyle = "bg-stone-100 border-stone-300";
            if (tile.type === "question") tileStyle = "bg-amber-100 border-amber-300";
            if (tile.type === "goose") tileStyle = "bg-emerald-100 border-emerald-400";
            if (tile.type === "trap") tileStyle = "bg-rose-100 border-rose-400";
            if (tile.type === "start" || tile.type === "end") tileStyle = "bg-purple-100 border-purple-400";

            return (
              <div 
                key={tile.id}
                className={`relative w-full h-full flex flex-col items-center justify-center border-4 rounded-2xl shadow-xl ${tileStyle} transition-all duration-300 hover:scale-105`}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
              >
                <span className="absolute top-1 left-2 text-xs sm:text-sm font-bold text-stone-500 opacity-70">{tile.id}</span>
                
                <div className="text-2xl sm:text-4xl mb-1 drop-shadow-md">
                  {tile.icon || (tile.type === "question" ? "📜" : "🏛️")}
                </div>
                {tile.category && <div className="hidden sm:block text-[9px] xl:text-[11px] font-bold uppercase tracking-tighter text-stone-600 bg-white/60 px-1 rounded truncate max-w-[90%]">{tile.category}</div>}
                
                <div className="absolute bottom-1 w-full flex justify-center gap-1 flex-wrap px-1">
                  {playersOnTile.map(p => (
                    <div 
                      key={p.id} 
                      className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg ${p.color} ${p.border} transform transition-transform hover:scale-110 z-10`}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: SIDEBAR (25%) */}
      <div className="w-1/4 bg-stone-800 flex flex-col p-6 shadow-2xl z-20 text-stone-100 relative">
        
        <div className="mb-8 bg-stone-900 p-4 rounded-xl border border-stone-700 shadow-inner">
          <h2 className="text-xl font-semibold mb-2 text-stone-400 uppercase tracking-wider text-center">Fase Attuale</h2>
          <div className="text-center font-bold text-2xl text-amber-400 h-10 flex items-center justify-center">
            {gameState === "IDLE" && "Turno di gioco"}
            {gameState === "ROLLING" && "Lancio dadi..."}
            {gameState === "MOVING" && "In movimento..."}
            {gameState === "ACTION" && "Azione in corso!"}
            {gameState === "ENDGAME" && "Vittoria!"}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <div 
            className={`w-32 h-32 bg-stone-100 rounded-2xl flex items-center justify-center text-7xl shadow-xl border-8 transition-all duration-200 
              ${gameState === "IDLE" ? "cursor-pointer hover:scale-105 active:scale-95 border-amber-500 shadow-amber-500/50" : "cursor-not-allowed border-stone-600 opacity-80"}
              ${gameState === "ROLLING" ? "animate-bounce" : ""}
            `}
            onClick={rollDice}
          >
            <span className={`text-stone-800 ${gameState === "ROLLING" ? 'blur-[1px]' : ''}`}>
              {!diceResult ? "🎲" : 
                diceResult === 1 ? "⚀" : 
                diceResult === 2 ? "⚁" : 
                diceResult === 3 ? "⚂" : 
                diceResult === 4 ? "⚃" : 
                diceResult === 5 ? "⚄" : "⚅"}
            </span>
          </div>
          {gameState === "IDLE" && <p className="mt-4 text-amber-200 font-bold animate-pulse">Tocca per lanciare!</p>}
        </div>

        <div className="bg-stone-900 rounded-xl p-4 border border-stone-700 flex-1 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 border-b border-stone-700 pb-2 text-stone-300">Familiae (Classifica)</h3>
          <div className="space-y-3">
            {[...players].sort((a,b) => b.position - a.position || b.score - a.score).map((p) => (
              <div 
                key={p.id} 
                className={`p-3 rounded-lg flex items-center justify-between border-2 transition-colors
                  ${p.id === currentPlayer.id ? "bg-stone-800 border-amber-500" : "bg-stone-900 border-transparent opacity-80"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 ${p.color} ${p.border}`} />
                  <div>
                    <div className={`font-bold ${p.id === currentPlayer.id ? 'text-amber-400' : 'text-stone-200'}`}>{p.name}</div>
                    <div className="text-xs text-stone-400">Casella {p.position}</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-xl text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">
                  {p.score} <span className="text-xs text-emerald-600">pt</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL OVERLAY */}
      {gameState === "ACTION" && modalContent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-8">
          
          <div className="bg-stone-100 w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-stone-300 overflow-hidden flex flex-col max-h-full">
            
            <div className={`p-6 text-center text-white 
              ${modalContent.type === 'question' ? 'bg-amber-600' : 
                modalContent.type === 'goose' ? 'bg-emerald-600' : 'bg-rose-600'}
            `}>
              <h2 className="text-4xl font-bold uppercase tracking-wider flex items-center justify-center gap-4">
                <span className="text-5xl">{modalContent.icon || (modalContent.type === 'question' ? '📜' : '⁉️')}</span>
                {modalContent.type === 'question' ? `Quesito: ${modalContent.category}` : modalContent.label}
              </h2>
            </div>

            <div className="p-10 flex-1 flex flex-col items-center justify-center text-center">
              
              {modalContent.type === 'question' ? (
                <>
                  <p className="text-4xl font-medium text-stone-800 leading-tight mb-8">
                    "{modalContent.question}"
                  </p>
                  
                  {!showAnswer && (
                    <div className="flex flex-col items-center mb-8">
                      <div className={`text-6xl font-mono font-bold mb-4 ${timer <= 10 ? 'text-rose-600 animate-pulse' : 'text-stone-700'}`}>
                        {timer}s
                      </div>
                      <div className="flex gap-4">
                        {!isTimerRunning && timer > 0 ? (
                          <button onClick={startTimer} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-md active:bg-emerald-600 text-xl">Avvia Tempo</button>
                        ) : (
                          <button onClick={stopTimer} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-md active:bg-amber-600 text-xl">Pausa</button>
                        )}
                        <button onClick={resetTimer} className="px-4 py-3 bg-stone-300 text-stone-700 rounded-xl font-bold shadow-md active:bg-stone-400 text-xl">Reset</button>
                      </div>
                    </div>
                  )}

                  <div className="w-full mt-auto pt-8 border-t-2 border-stone-200">
                    {!showAnswer ? (
                      <button 
                        onClick={() => { setShowAnswer(true); stopTimer(); }}
                        className="w-full py-5 bg-stone-800 text-white text-2xl font-bold rounded-xl shadow-lg hover:bg-stone-700 transition-colors"
                      >
                        Rivela Risposta (Docente)
                      </button>
                    ) : (
                      <div className="animate-fade-in-up">
                        <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-6 mb-8">
                          <p className="text-lg text-amber-800 mb-2 uppercase font-bold text-left">Risposta Corretta:</p>
                          <p className="text-3xl font-bold text-stone-800">{modalContent.answer}</p>
                        </div>
                        
                        <div className="flex gap-6">
                          <button 
                            onClick={() => handleQuestionResult(true)}
                            className="flex-1 py-6 bg-emerald-500 text-white text-3xl font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors flex flex-col items-center"
                          >
                            <span>ESATTA</span>
                            <span className="text-lg font-normal opacity-80">+ {modalContent.points} pt</span>
                          </button>
                          <button 
                            onClick={() => handleQuestionResult(false)}
                            className="flex-1 py-6 bg-rose-500 text-white text-3xl font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-colors flex flex-col items-center"
                          >
                            <span>ERRATA</span>
                            <span className="text-lg font-normal opacity-80">{modalContent.penalty < 0 ? `Retrocede di ${Math.abs(modalContent.penalty)}` : 'Nessuna penalità'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-4xl font-medium text-stone-800 leading-tight mb-12">
                    {modalContent.description}
                  </p>
                  
                  <button 
                    onClick={handleEventResult}
                    className="mt-auto px-12 py-5 bg-stone-800 text-white text-3xl font-bold rounded-xl shadow-lg hover:bg-stone-700 transition-colors w-full"
                  >
                    Continua ({modalContent.effect > 0 ? `+${modalContent.effect}` : modalContent.effect} Caselle)
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ENDGAME OVERLAY */}
      {gameState === "ENDGAME" && (
         <div className="absolute inset-0 z-[60] flex items-center justify-center bg-stone-900/95 p-8">
            <div className="text-center">
               <h1 className="text-7xl mb-8">🏆</h1>
               <h2 className="text-6xl font-bold text-amber-400 mb-4 font-serif uppercase tracking-widest">Trionfo!</h2>
               <p className="text-3xl text-stone-200 mb-12">La <span className="font-bold text-white">{players.find(p => p.position >= TOTAL_TILES -1)?.name}</span> ha conquistato l'Impero!</p>
               <button onClick={() => window.location.reload()} className="px-8 py-4 bg-amber-600 text-white text-2xl font-bold rounded-xl hover:bg-amber-500">
                  Nuova Partita
               </button>
            </div>
         </div>
      )}

    </div>
  );
}