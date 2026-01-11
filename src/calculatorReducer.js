function komunikatReducer(state, action) {
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
