/**
 * Safe math expression evaluator for transaction amounts.
 * Supports +, -, *, /, x, ÷, brackets, and spaces without using eval().
 */

export const isMathExpression = (str) => {
  if (typeof str !== 'string') return false;
  const clean = str.trim();
  return /[+\-*xX/÷]/.test(clean);
};

export const evaluateMathExpression = (rawExpr) => {
  if (!rawExpr || typeof rawExpr !== 'string') return null;

  let expr = rawExpr
    .replace(/x|X/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
    .replace(/,/g, '.');

  if (!/^[0-9+\-*/().]+$/.test(expr)) {
    return null;
  }

  if (/[+\-*/.]$/.test(expr)) {
    return null;
  }

  try {
    const tokens = [];
    let numberBuffer = '';

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (/[0-9.]/.test(char)) {
        numberBuffer += char;
      } else if (['+', '-', '*', '/', '(', ')'].includes(char)) {
        if (numberBuffer) {
          tokens.push(parseFloat(numberBuffer));
          numberBuffer = '';
        }
        if (char === '-' && (tokens.length === 0 || tokens[tokens.length - 1] === '(' || ['+', '-', '*', '/'].includes(tokens[tokens.length - 1]))) {
          numberBuffer = '-';
        } else {
          tokens.push(char);
        }
      }
    }

    if (numberBuffer && numberBuffer !== '-') {
      tokens.push(parseFloat(numberBuffer));
    }

    const outputQueue = [];
    const operatorStack = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (const token of tokens) {
      if (typeof token === 'number') {
        outputQueue.push(token);
      } else if (token in precedence) {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === '(') {
          operatorStack.pop();
        }
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop();
      if (op === '(' || op === ')') return null;
      outputQueue.push(op);
    }

    const evalStack = [];
    for (const token of outputQueue) {
      if (typeof token === 'number') {
        evalStack.push(token);
      } else {
        const b = evalStack.pop();
        const a = evalStack.pop();
        if (a === undefined || b === undefined) return null;

        switch (token) {
          case '+': evalStack.push(a + b); break;
          case '-': evalStack.push(a - b); break;
          case '*': evalStack.push(a * b); break;
          case '/':
            if (b === 0) return null;
            evalStack.push(a / b);
            break;
          default: return null;
        }
      }
    }

    if (evalStack.length !== 1 || isNaN(evalStack[0]) || !isFinite(evalStack[0])) {
      return null;
    }

    const result = Math.round(evalStack[0]);
    return result >= 0 ? result : 0;
  } catch {
    return null;
  }
};
