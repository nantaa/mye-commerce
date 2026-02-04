"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
router.post('/track-view', analytics_controller_1.trackProductView);
router.get('/dashboard', analytics_controller_1.getDashboardStats);
exports.default = router;
