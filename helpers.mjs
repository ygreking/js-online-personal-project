import dataJSON from './data.json';

export async function simulateAsync(value) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(Math.floor(Math.random() * 1000));
    return value;
}

export async function fetchData() {
    return await simulateAsync(dataJSON);
}

export function cloneStore(store) {
    return {
        usd: { ...store.usd },
        eur: { ...store.eur },
        exchange: { ...store.exchange },
        operation: { ...store.operation },
    };
}

export function stepResult(data) {
    const { usd, eur, exchange } = data;
    return `usd: ${usd.balance}, isFrozen: ${usd.isFrozen} | eur: ${eur.balance}, isFrozen: ${eur.isFrozen} | exchange (usd: ${exchange.usd}, eur: ${exchange.eur})`;
}
