"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekNumber = void 0;
const getWeekNumber = function (date) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
    return weekNumber;
};
exports.getWeekNumber = getWeekNumber;
//# sourceMappingURL=dateModification.js.map