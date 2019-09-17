import Transaction from './transaction.mjs';
import { scenario } from './scenario.mjs';

const transaction = new Transaction();

(async () => {
    try {
        await transaction.dispatch(scenario);
        const { store, logs, status } = transaction;
        console.log('\nTransaction data store:\n', store);
        console.log('\nTransaction log:\n', logs);
        console.log('\nStatus:', status);
    } catch (e) {
        console.log(`${e.name}: ${e.message}`);
    }
})();
