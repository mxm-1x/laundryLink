"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// STUDENT ROUTES
router.post('/student/register', auth_controller_1.studentRegister);
router.post('/student/login', auth_controller_1.studentLogin);
// STAFF ROUTES
router.post('/staff/register', auth_controller_1.staffRegister);
router.post('/staff/login', auth_controller_1.staffLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map