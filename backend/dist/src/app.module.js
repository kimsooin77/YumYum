"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const snacks_module_1 = require("./snacks/snacks.module");
const categories_module_1 = require("./categories/categories.module");
const brands_module_1 = require("./brands/brands.module");
const favorites_module_1 = require("./favorites/favorites.module");
const reviews_module_1 = require("./reviews/reviews.module");
const recommendations_module_1 = require("./recommendations/recommendations.module");
const crawler_module_1 = require("./crawler/crawler.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            snacks_module_1.SnacksModule,
            categories_module_1.CategoriesModule,
            brands_module_1.BrandsModule,
            favorites_module_1.FavoritesModule,
            reviews_module_1.ReviewsModule,
            recommendations_module_1.RecommendationsModule,
            crawler_module_1.CrawlerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map