"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = catchAsync => {
    return (req, res, next) => {
        catchAsync(req, res, next).catch(next);
    };
};
//# sourceMappingURL=catchAsync.js.map