import {
    simulateAsync,
    fetchData,
    cloneStore,
    stepResult,
} from './helpers.mjs';

export const scenario = [
    {
        index: 1,
        meta: {
            title: 'Collect backup information.',
            description:
                'Collects pieces of data required for restoring scenario',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = await fetchData();

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
            return await simulateAsync(store);
        },
    },
    {
        index: 2,
        meta: {
            title: 'Withdraw funds from source account.',
            description:
                'Takes off funds from source account and freezes it until entire scenario ends successfully or unsuccessfully.',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = cloneStore(store);
            const { amount, source } = data.operation;

            if (data[source].balance < amount) {
                throw new Error('Insufficient funds on source account.');
            }

            data[source].balance = data[source].balance - amount;
            data.exchange[source] = amount;
            data[source].isFrozen = true;

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
            return await simulateAsync(store);
        },
    },
    {
        index: 3,
        meta: {
            title: 'Convert funds from source to destination currency.',
            description:
                'Get the exchange rate and calculate the amount of funds in destination currency after conversion.',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = cloneStore(store);
            const { source, destination } = data.operation;

            data.exchange[destination] =
                data.exchange[source] * data.exchange.rate;
            data.exchange[source] = 0;

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
            return await simulateAsync(store);
        },
    },
    {
        index: 4,
        meta: {
            title: 'Deposit funds to desitnation account.',
            description:
                'Deposit funds to destination account and freezes it until entire scenario ends successfully or unsuccessfully.',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = cloneStore(store);
            const { destination } = data.operation;

            data[destination].balance =
                data[destination].balance + data.exchange[destination];
            data.exchange[destination] = 0;
            data[destination].isFrozen = true;

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
        },
    },
    {
        index: 5,
        meta: {
            title: 'Unfreeze destination account.',
            description: 'Unfreeze destination account.',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = cloneStore(store);
            const { destination } = data.operation;

            data[destination].isFrozen = false;

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
            return await simulateAsync(store);
        },
    },
    {
        index: 6,
        meta: {
            title: 'Unfreeze source account.',
            description: 'Unfreeze source account.',
        },
        async call(store, logs) {
            // Логика выполнения шага
            const data = cloneStore(store);
            const { source } = data.operation;

            data[source].isFrozen = false;

            logs.stepResult = stepResult(data);
            return await simulateAsync(data);
        },
        async restore(store, logs) {
            // Логика отката шага
            return await simulateAsync(store);
        },
    },
];
