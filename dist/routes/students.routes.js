"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/register", student_controller_1.registerStudent);
router.get("/:bagNumber/status", auth_middleware_1.authenticate, student_controller_1.getLaundryStatus);
exports.default = router;
//# sourceMappingURL=students.routes.js.map