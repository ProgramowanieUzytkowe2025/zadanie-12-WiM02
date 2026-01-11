export function useKalkulator({
    liczbaA,
    liczbaB,
    historia,
    setHistoria,
    setWynik
}) {
    function aktualizujHistorie(operation, wynik) {
        const nowaHistoria = [
            ...historia,
            { a: liczbaA, b: liczbaB, operation, wynik }
        ];
        setHistoria(nowaHistoria);
        setWynik(wynik);
    }

    function dodaj() {
        aktualizujHistorie('+', liczbaA + liczbaB);
    }

    function odejmij() {
        aktualizujHistorie('-', liczbaA - liczbaB);
    }

    function pomnoz() {
        aktualizujHistorie('*', liczbaA * liczbaB);
    }

    function podziel() {
        if (liczbaB !== 0) {
            aktualizujHistorie('/', liczbaA / liczbaB);
        }
    }

    return {
        dodaj,
        odejmij,
        pomnoz,
        podziel
    };
}
