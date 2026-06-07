"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnacksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const snacks_service_1 = require("./snacks.service");
const snack_query_dto_1 = require("./dto/snack-query.dto");
const optional_jwt_auth_guard_1 = require("../common/guards/optional-jwt-auth.guard");
let SnacksController = class SnacksController {
    snacksService;
    constructor(snacksService) {
        this.snacksService = snacksService;
    }
    findAll(query, req) {
        return this.snacksService.findAll(query, req.user?.id ?? null);
    }
    findNew(page = '1', limit = '20') {
        return this.snacksService.findNew(Number(page), Number(limit));
    }
    search(query) {
        return this.snacksService.search(query);
    }
    getBlogReviews(id) {
        return this.snacksService.getBlogReviews(id);
    }
    findById(id) {
        return this.snacksService.findById(id);
    }
};
exports.SnacksController = SnacksController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '과자 목록 조회' }),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snack_query_dto_1.SnackQueryDto, Object]),
    __metadata("design:returntype", void 0)
], SnacksController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '신상품 목록 조회 (최근 30일)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, common_1.Get)('new'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SnacksController.prototype, "findNew", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '과자 검색' }),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snack_query_dto_1.SearchQueryDto]),
    __metadata("design:returntype", void 0)
], SnacksController.prototype, "search", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '과자 블로그 후기 조회 (네이버 블로그)' }),
    (0, common_1.Get)(':id/blog-reviews'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SnacksController.prototype, "getBlogReviews", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '과자 상세 조회' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SnacksController.prototype, "findById", null);
exports.SnacksController = SnacksController = __decorate([
    (0, swagger_1.ApiTags)('snacks'),
    (0, common_1.Controller)('snacks'),
    __metadata("design:paramtypes", [snacks_service_1.SnacksService])
], SnacksController);
//# sourceMappingURL=snacks.controller.js.map