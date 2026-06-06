"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnacksModule = void 0;
const common_1 = require("@nestjs/common");
const snacks_controller_1 = require("./snacks.controller");
const snacks_service_1 = require("./snacks.service");
const snacks_repository_1 = require("./snacks.repository");
let SnacksModule = class SnacksModule {
};
exports.SnacksModule = SnacksModule;
exports.SnacksModule = SnacksModule = __decorate([
    (0, common_1.Module)({
        controllers: [snacks_controller_1.SnacksController],
        providers: [snacks_service_1.SnacksService, snacks_repository_1.SnacksRepository],
        exports: [snacks_service_1.SnacksService, snacks_repository_1.SnacksRepository],
    })
], SnacksModule);
//# sourceMappingURL=snacks.module.js.map