import './AppCalculator.css';
import { useState, useEffect, useReducer } from 'react';
import { AppButton } from './AppButton';
import { AppCalculationHistory } from './AppCalculationHistory';
import { useKalkulator } from './useKalkulator';

export function komunikatReducer(state, action) {
    switch (action.type) {
        case 'RESET':
            return 'Brak';
        case 'ZMIANA_A':
            return 'Zmodyfikowano wartość liczby A';
        case 'ZMIANA_B':
            return 'Zmodyfikowano wartość liczby B';
        case 'OBLICZENIA':
            return 'Wykonano obliczenia';
        case 'PRZYWROCENIE':
            return 'Przywrócono historyczny stan';
        default:
            return state;
    }
}

export function AppCalculator() {
    const [liczbaA, setLiczbaA] = useState(null);
    const [liczbaB, setLiczbaB] = useState(null);
    const [wynik, setWynik] = useState(null);
    const [historia, setHistoria] = useState([]);
    const [porownanie, setPorownanie] = useState('');

    const [komunikat, dispatch] = useReducer(komunikatReducer, 'Brak');

    useEffect(() => {
        const zapisanaHistoria = sessionStorage.getItem('historia');

        if (!zapisanaHistoria) return;

        const parsedHistoria = JSON.parse(zapisanaHistoria);

        if (parsedHistoria.length === 0) return;

        const ostatniElement = parsedHistoria[parsedHistoria.length - 1];

        setHistoria(parsedHistoria);

        setLiczbaA(ostatniElement.a);
        setLiczbaB(ostatniElement.b);
        setWynik(ostatniElement.wynik);
    }, []);


    useEffect(() => {
        sessionStorage.setItem('historia', JSON.stringify(historia));
    }, [historia]);

    useEffect(() => {
        if (liczbaA == null || liczbaB == null) {
            setPorownanie('');
        } else if (liczbaA === liczbaB) {
            setPorownanie('Liczba A jest równa liczbie B.');
        } else if (liczbaA > liczbaB) {
            setPorownanie('Liczba A jest większa od liczby B.');
        } else {
            setPorownanie('Liczba B jest większa od liczby A.');
        }
    }, [liczbaA, liczbaB]);

    const { dodaj, odejmij, pomnoz, podziel } = useKalkulator({
        liczbaA,
        liczbaB,
        historia,
        setHistoria,
        setWynik
    });

    function parsujLiczbe(value) {
        const sparsowanaLiczba = parseFloat(value);
        return isNaN(sparsowanaLiczba) ? null : sparsowanaLiczba;
    }

    function liczbaAOnChange(value) {
        setLiczbaA(parsujLiczbe(value));
        dispatch({ type: 'ZMIANA_A' });
    }

    function liczbaBOnChange(value) {
        setLiczbaB(parsujLiczbe(value));
        dispatch({ type: 'ZMIANA_B' });
    }

    function onAppCalculationHistoryClick(index) {
        const nowaHistoria = historia.slice(0, index + 1);
        setHistoria(nowaHistoria);
        setLiczbaA(historia[index].a);
        setLiczbaB(historia[index].b);
        setWynik(historia[index].wynik);
        dispatch({ type: 'PRZYWROCENIE' });
    }

    const zablokujPrzyciski = liczbaA == null || liczbaB == null;
    const zablokujDzielenie = zablokujPrzyciski || liczbaB === 0;

    const oblicz = (fn) => {
        fn();
        dispatch({ type: 'OBLICZENIA' });
    };

    return (
        <div className='app-calculator'>
            <div className='app-calculator-pole'>
                <label>Wynik: </label>
                <span>{wynik}</span>
            </div>

            <hr />

            <div className='app-calculator-pole'>
                <label>Dynamiczne porównanie liczb: </label>
                <span>{porownanie}</span>
            </div>

            <hr />

            <div className='app-calculator-pole'>
                <label>Liczba 1</label>
                <input
                    type="number"
                    value={liczbaA ?? ''}
                    onChange={(e) => liczbaAOnChange(e.target.value)}
                />
            </div>

            <div className='app-calculator-pole'>
                <label>Liczba 2</label>
                <input
                    type="number"
                    value={liczbaB ?? ''}
                    onChange={(e) => liczbaBOnChange(e.target.value)}
                />
            </div>

            <hr />

            <div className='app-calculator-przyciski'>
                <AppButton disabled={zablokujPrzyciski} title="+" onClick={() => oblicz(dodaj)} />
                <AppButton disabled={zablokujPrzyciski} title="-" onClick={() => oblicz(odejmij)} />
                <AppButton disabled={zablokujPrzyciski} title="*" onClick={() => oblicz(pomnoz)} />
                <AppButton disabled={zablokujDzielenie} title="/" onClick={() => oblicz(podziel)} />
            </div>

            <hr />

            <div className='app-calculator-pole'>
                <label>Ostatnia czynność: </label>
                <span>{komunikat}</span>
            </div>

            <hr />

            <div className='app-calculator-historia'>
                <AppCalculationHistory
                    historia={historia}
                    onClick={onAppCalculationHistoryClick}
                />
            </div>
        </div>
    );
}
