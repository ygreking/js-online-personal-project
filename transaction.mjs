export default class Transaction {
    constructor() {
        this.store = new Map();
        this.logs = [];
        this.status = null;
    }

    async dispatch(scenario) {
        try {
            for (const step of scenario) {
                await this.executeStep(step);
            }
            this.status = 'Transaction completed successfully.';
        } catch (e) {
            try {
                console.log(
                    `\nTransaction aborted at step ${this.logs.length}. ${e.message}`,
                    '\nRolling back to initial state...',
                    '\n'
                );
                await this.rollback(scenario);
                this.status = 'Transaction restored successfully.';
            } catch (e) {
                this.status = `Transaction restored unsuccessfully. ${e.name}: ${e.message}`;
            }
        }
    }

    async rollback(scenario) {
        const currentStep = this.logs.length;
        for (let index = currentStep - 1; index >= 0; index--) {
            await this.restoreStep(scenario[index]);
        }
    }

    async executeStep(step) {
        const { index, meta, call } = step;

        console.log(`Executing step ${index}:`, meta.title);

        const logIndex = this.logs.push({ index, meta, error: null }) - 1;
        const store = index > 1 ? this.store.get(index - 1) : {};

        try {
            const data = await call(store, this.logs[logIndex]);
            this.store.set(index, data);
        } catch (e) {
            this.logs[logIndex].error = {
                name: e.name,
                message: e.message,
                stack: e.stack,
            };
            throw new Error(e);
        }
    }

    async restoreStep(step) {
        const { index, meta, restore } = step;

        console.log(`Restoring step ${index}:`, meta.title);

        const store = index > 1 ? this.store.get(index - 1) : {};

        try {
            await restore(store, this.logs[index - 1]);
            this.status = 'Transaction completed successfully.';
        } catch (e) {
            throw new Error(e);
        }
    }
}
