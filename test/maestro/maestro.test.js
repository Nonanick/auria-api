"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Maestro_1 = require("../../dist/maestro/Maestro");
const chai_1 = require("chai");
const Container_1 = require("../../dist/container/Container");
const Controller_1 = require("../../dist/controller/Controller");
const MockedAdapter_1 = require("../mock/adapter/MockedAdapter");
describe('Maestro', () => {
    let maestro;
    beforeEach(() => {
        maestro = new Maestro_1.Maestro();
    });
    it('Is created empty', () => {
        chai_1.expect(maestro.allRoutes().length).eq(0);
        chai_1.expect(maestro.containers().length).eq(0);
        chai_1.expect(maestro.controllers().length).eq(0);
    });
    it('Add containers', () => {
        const container = new class extends Container_1.Container {
            constructor() {
                super(...arguments);
                this.baseURL = '';
            }
        };
        maestro.add(container);
        chai_1.expect(maestro.containers().length).eq(1);
    });
    it('Remove containers', () => {
        const container = new class extends Container_1.Container {
            constructor() {
                super(...arguments);
                this.baseURL = '';
            }
        };
        maestro.add(container);
        chai_1.expect(maestro.containers().length).eq(1);
        maestro.removeChildContainer(container);
        chai_1.expect(maestro.containers().length).eq(0);
    });
    it('Add controllers', () => {
        const controller = new class extends Controller_1.Controller {
            constructor() {
                super(...arguments);
                this.baseURL = '';
            }
        };
        maestro.add(controller);
        chai_1.expect(maestro.controllers().length).eq(1);
    });
    it('Remove controllers', () => {
        const controller = new class extends Controller_1.Controller {
            constructor() {
                super(...arguments);
                this.baseURL = '';
            }
        };
        maestro.add(controller);
        chai_1.expect(maestro.controllers().length).eq(1);
        maestro.removeController(controller);
        chai_1.expect(maestro.controllers().length).eq(0);
    });
    it('Add adapters', () => {
        const adapter = new MockedAdapter_1.MockedAdapter;
        maestro.addAdapter(adapter);
        chai_1.expect(Object.values(maestro.adapters).length).eq(1);
    });
    it('Remove adapters', () => {
        const adapter = new MockedAdapter_1.MockedAdapter;
        maestro.addAdapter(adapter);
        chai_1.expect(Object.values(maestro.adapters).length).eq(1);
        delete maestro.adapters[adapter.name];
        chai_1.expect(Object.values(maestro.adapters).length).eq(0);
    });
});
