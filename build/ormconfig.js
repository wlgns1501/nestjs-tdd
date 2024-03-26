"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
var common_1 = require("@nestjs/common");
var TypeOrmConfigService = /** @class */ (function () {
    function TypeOrmConfigService() {
    }
    TypeOrmConfigService.prototype.createTypeOrmOptions = function () {
        return {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            synchronize: false,
            logging: true,
            entities: ['dist/src/entities/**/*{.js,.ts}'],
            migrations: ['dist/migration/**/*{.js,.ts}'],
            subscribers: ['dist/subscribers/**/*{.js,.ts}'],
        };
    };
    TypeOrmConfigService = __decorate([
        (0, common_1.Injectable)()
    ], TypeOrmConfigService);
    return TypeOrmConfigService;
}());
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=ormconfig.js.map