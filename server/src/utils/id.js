"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdGenerator {
    constructor() {
        this.resetIds();
    }
    getNextId() {
        return this.currentId++;
    }
    resetIds() {
        this.currentId = 0;
    }
}
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=id.js.map