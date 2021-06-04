"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedAdapter = void 0;
const events_1 = require("events");
class MockedAdapter extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.name = "Mocked Adapter";
    }
    addContainer(container) {
        throw new Error('Method not implemented.');
    }
    setRequestHandler(handler) {
        throw new Error('Method not implemented.');
    }
    start() {
        throw new Error('Method not implemented.');
    }
}
exports.MockedAdapter = MockedAdapter;
