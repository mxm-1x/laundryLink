"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staff_controller_1 = require("../controllers/staff.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.get("/", auth_middleware_1.authenticate, staff_controller_1.getAllLaundry);
router.put("/:id", auth_middleware_1.authenticate, staff_controller_1.updateLaundryStatus);
router.patch("/:id", auth_middleware_1.authenticate, staff_controller_1.updateLaundryStatus);
router.patch("/:id/issue", auth_middleware_1.authenticate, staff_controller_1.updateLaundryIssue);
router.put("/:id/issue", auth_middleware_1.authenticate, staff_controller_1.updateLaundryIssue);
exports.default = router;
//# sourceMappingURL=staff.routes.js.map