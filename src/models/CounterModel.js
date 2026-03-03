// simple model encapsulating the counter state
export default class CounterModel {
    constructor() {
        this.count = 0;
    }

    increment() {
        this.count += 1;
    }
}
