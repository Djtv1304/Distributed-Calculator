'use client';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

type Operation = '+' | '-' | '×' | '÷' | null;

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNumberClick = (num: string) => {
    setError(null);
    if (waitingForSecondNumber) {
      setDisplay(num);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperationClick = (op: Operation) => {
    setError(null);
    setFirstNumber(display);
    setOperation(op);
    setWaitingForSecondNumber(true);
  };

  const clear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false);
    setError(null);
  };

  const calculateResult = async () => {
    if (!firstNumber || !operation) return;

    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(display);

    if (operation === '÷' && num2 === 0) {
      setError('Cannot divide by zero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (operation) {
        case '+':
          endpoint = `/api/add?a=${num1}&b=${num2}`;
          break;
        case '-':
          endpoint = `/api/subtract?a=${num1}&b=${num2}`;
          break;
        case '×':
          endpoint = `/api/multiply?a=${num1}&b=${num2}`;
          break;
        case '÷':
          endpoint = `/api/divide?a=${num1}&b=${num2}`;
          break;
      }

      const response = await axios.get(`http://localhost:3000${endpoint}`);
      setDisplay(response.data.result.toString());
    } catch (error: unknown) {

      if (error instanceof AxiosError) {
        setError(`Calculation failed: ${error.message}`);
      } else {
        setError('Calculation failed: An unknown error occurred');
      }
    } finally {
      setLoading(false);
      setFirstNumber(null);
      setOperation(null);
    }
  };

  const buttonClass = "w-16 h-16 md:w-20 md:h-20 rounded-full m-1 text-xl font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-400/30";
  const numberClass = `${buttonClass} bg-slate-700/80 text-slate-100 hover:bg-slate-600/90 shadow-lg backdrop-blur-sm`;
  const operationClass = `${buttonClass} bg-indigo-600/90 text-white hover:bg-indigo-500/90 shadow-lg`;
  const specialClass = `${buttonClass} bg-slate-600/70 text-slate-200 hover:bg-slate-500/80 shadow-lg backdrop-blur-sm`;

  return (
    <div className="bg-slate-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-[26rem] border border-slate-700/50">
      {/* Display */}
      <div className="relative bg-slate-900 rounded-2xl p-6 mb-6 h-28 flex flex-col justify-end items-end shadow-inner ring-1 ring-slate-700/50">
        {error && (
          <div className="absolute top-3 left-0 w-full text-center text-rose-400 text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="absolute top-3 right-3">
            <Loader2 className="animate-spin text-indigo-400" size={20} />
          </div>
        )}
        <div className="text-4xl text-slate-100 font-light tracking-wider overflow-x-auto max-w-full">
          {display}
        </div>
        <div className="text-slate-400 text-sm mt-1">
          {firstNumber} {operation}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={clear} className={specialClass}>AC</button>
        <button className={specialClass}>±</button>
        <button className={specialClass}>%</button>
        <button onClick={() => handleOperationClick('÷')} className={operationClass}>÷</button>

        <button onClick={() => handleNumberClick('7')} className={numberClass}>7</button>
        <button onClick={() => handleNumberClick('8')} className={numberClass}>8</button>
        <button onClick={() => handleNumberClick('9')} className={numberClass}>9</button>
        <button onClick={() => handleOperationClick('×')} className={operationClass}>×</button>

        <button onClick={() => handleNumberClick('4')} className={numberClass}>4</button>
        <button onClick={() => handleNumberClick('5')} className={numberClass}>5</button>
        <button onClick={() => handleNumberClick('6')} className={numberClass}>6</button>
        <button onClick={() => handleOperationClick('-')} className={operationClass}>-</button>

        <button onClick={() => handleNumberClick('1')} className={numberClass}>1</button>
        <button onClick={() => handleNumberClick('2')} className={numberClass}>2</button>
        <button onClick={() => handleNumberClick('3')} className={numberClass}>3</button>
        <button onClick={() => handleOperationClick('+')} className={operationClass}>+</button>

        <button onClick={() => handleNumberClick('0')} className={`${numberClass} col-span-2`}>0</button>
        <button onClick={() => handleNumberClick('.')} className={numberClass}>.</button>
        <button onClick={calculateResult} className={`${buttonClass} bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg ring-1 ring-indigo-400/50`}>=</button>
      </div>
    </div>
  );
};

export default Calculator;