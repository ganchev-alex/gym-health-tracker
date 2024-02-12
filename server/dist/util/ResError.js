"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResError extends Error {
    constructor(aMessage, aStatus) {
        super(aMessage);
        this.status = 500;
        this.status = aStatus;
    }
}
exports.default = ResError;
//# sourceMappingURL=ResError.js.map