// Math problem generation utilities

export interface ProblemConfig {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface GeneratedProblem {
  id: string;
  question: string;
  correctAnswer: number;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: number;
  hint?: string;
  explanation?: string;
}

// Problem generation functions
export const generateAdditionProblems = (difficulty: number, count: number): GeneratedProblem[] => {
  const problems: GeneratedProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    let a: number, b: number;
    
    switch (difficulty) {
      case 1: // Single digit
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
        break;
      case 2: // Double digit
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 90) + 10;
        break;
      case 3: // Triple digit
        a = Math.floor(Math.random() * 900) + 100;
        b = Math.floor(Math.random() * 900) + 100;
        break;
      default:
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
    }
    
    problems.push({
      id: `add-${i}-${Date.now()}`,
      question: `${a} + ${b} = ?`,
      correctAnswer: a + b,
      type: 'addition',
      difficulty,
      hint: `Start with ${a} and count up ${b} more`,
      explanation: `${a} + ${b} = ${a + b}`
    });
  }
  
  return problems;
};

export const generateSubtractionProblems = (difficulty: number, count: number): GeneratedProblem[] => {
  const problems: GeneratedProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    let a: number, b: number;
    
    switch (difficulty) {
      case 1: // Single digit, no negative results
        a = Math.floor(Math.random() * 9) + 5;
        b = Math.floor(Math.random() * a) + 1;
        break;
      case 2: // Double digit
        a = Math.floor(Math.random() * 90) + 50;
        b = Math.floor(Math.random() * 40) + 10;
        break;
      case 3: // Triple digit
        a = Math.floor(Math.random() * 900) + 200;
        b = Math.floor(Math.random() * 150) + 50;
        break;
      default:
        a = Math.floor(Math.random() * 9) + 5;
        b = Math.floor(Math.random() * a) + 1;
    }
    
    problems.push({
      id: `sub-${i}-${Date.now()}`,
      question: `${a} - ${b} = ?`,
      correctAnswer: a - b,
      type: 'subtraction',
      difficulty,
      hint: `Think: what number plus ${b} equals ${a}?`,
      explanation: `${a} - ${b} = ${a - b}`
    });
  }
  
  return problems;
};

export const generateMultiplicationProblems = (difficulty: number, count: number): GeneratedProblem[] => {
  const problems: GeneratedProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    let a: number, b: number;
    
    switch (difficulty) {
      case 1: // Tables 1-5
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case 2: // Tables 1-10
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case 3: // Tables 1-12
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        break;
      case 4: // Two-digit × single-digit
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 9) + 1;
        break;
      default:
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
    }
    
    problems.push({
      id: `mult-${i}-${Date.now()}`,
      question: `${a} × ${b} = ?`,
      correctAnswer: a * b,
      type: 'multiplication',
      difficulty,
      hint: `Think of ${a} groups of ${b}, or ${b} groups of ${a}`,
      explanation: `${a} × ${b} = ${a * b}`
    });
  }
  
  return problems;
};

export const generateDivisionProblems = (difficulty: number, count: number): GeneratedProblem[] => {
  const problems: GeneratedProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    let quotient: number, divisor: number;
    
    switch (difficulty) {
      case 1: // Simple division, quotients 1-10
        quotient = Math.floor(Math.random() * 10) + 1;
        divisor = Math.floor(Math.random() * 9) + 2;
        break;
      case 2: // Quotients up to 20
        quotient = Math.floor(Math.random() * 20) + 1;
        divisor = Math.floor(Math.random() * 9) + 2;
        break;
      case 3: // Larger numbers
        quotient = Math.floor(Math.random() * 50) + 1;
        divisor = Math.floor(Math.random() * 12) + 2;
        break;
      default:
        quotient = Math.floor(Math.random() * 10) + 1;
        divisor = Math.floor(Math.random() * 9) + 2;
    }
    
    const dividend = quotient * divisor;
    
    problems.push({
      id: `div-${i}-${Date.now()}`,
      question: `${dividend} ÷ ${divisor} = ?`,
      correctAnswer: quotient,
      type: 'division',
      difficulty,
      hint: `Think: ${divisor} times what number equals ${dividend}?`,
      explanation: `${dividend} ÷ ${divisor} = ${quotient}`
    });
  }
  
  return problems;
};

// Mixed problem generator
export const generateMixedProblems = (configs: ProblemConfig[]): GeneratedProblem[] => {
  const allProblems: GeneratedProblem[] = [];
  
  configs.forEach(config => {
    switch (config.type) {
      case 'addition':
        allProblems.push(...generateAdditionProblems(config.difficulty, config.count));
        break;
      case 'subtraction':
        allProblems.push(...generateSubtractionProblems(config.difficulty, config.count));
        break;
      case 'multiplication':
        allProblems.push(...generateMultiplicationProblems(config.difficulty, config.count));
        break;
      case 'division':
        allProblems.push(...generateDivisionProblems(config.difficulty, config.count));
        break;
    }
  });
  
  // Shuffle the problems
  for (let i = allProblems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProblems[i], allProblems[j]] = [allProblems[j], allProblems[i]];
  }
  
  return allProblems;
};

// Predefined lesson configurations
export const lessonConfigs = {
  'basic-arithmetic': [
    { type: 'addition' as const, difficulty: 1 as const, count: 5 },
    { type: 'subtraction' as const, difficulty: 1 as const, count: 5 }
  ],
  'multiplication-mastery': [
    { type: 'multiplication' as const, difficulty: 2 as const, count: 10 }
  ],
  'division-basics': [
    { type: 'division' as const, difficulty: 1 as const, count: 8 }
  ],
  'mixed-practice': [
    { type: 'addition' as const, difficulty: 2 as const, count: 3 },
    { type: 'subtraction' as const, difficulty: 2 as const, count: 3 },
    { type: 'multiplication' as const, difficulty: 1 as const, count: 2 },
    { type: 'division' as const, difficulty: 1 as const, count: 2 }
  ]
};
