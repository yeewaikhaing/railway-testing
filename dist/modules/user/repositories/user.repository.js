"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@medusajs/medusa/dist/repositories/user");
const medusa_extender_1 = require("medusa-extender");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const lodash_1 = require("lodash");
let UserRepository = class UserRepository extends medusa_extender_1.Utils.repositoryMixin(user_1.UserRepository) {
    async findWithRelations(relations = [], idsOrOptionsWithoutRelations = {}) {
        let entities = [];
        let count = 0;
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
            entities = await this.findByIds(idsOrOptionsWithoutRelations);
            count = idsOrOptionsWithoutRelations.length;
        }
        else {
            const [results, resultCount] = await this.findAndCount(idsOrOptionsWithoutRelations);
            entities = results;
            count = resultCount;
        }
        const entitiesIds = entities.map(({ id }) => id);
        const groupedRelations = {};
        for (const rel of relations) {
            const [topLevel] = rel.split(".");
            if (groupedRelations[topLevel]) {
                groupedRelations[topLevel].push(rel);
            }
            else {
                groupedRelations[topLevel] = [rel];
            }
        }
        const entitiesIdsWithRelations = await Promise.all(Object.entries(groupedRelations).map(([_, rels]) => {
            return this.findByIds(entitiesIds, {
                select: ["id"],
                relations: rels,
            });
        })).then(lodash_1.flatten);
        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities);
        const entitiesAndRelationsById = (0, lodash_1.groupBy)(entitiesAndRelations, "id");
        return [
            Object.values(entitiesAndRelationsById).map((v) => (0, lodash_1.merge)({}, ...v)),
            count,
        ];
    }
    async findOneWithRelations(relations = [], optionsWithoutRelations = {}) {
        // Limit 1
        optionsWithoutRelations.take = 1;
        const [result] = await this.findWithRelations(relations, optionsWithoutRelations);
        return result[0];
    }
    async getFreeTextSearchResultsAndCount(q, options = {
        where: {},
    }) {
        var _a;
        const options_ = Object.assign({}, options);
        (_a = options_ === null || options_ === void 0 ? void 0 : options_.where) === null || _a === void 0 ? true : delete _a.email;
        let qb = this.createQueryBuilder("user")
            .select()
            .where(options_.where)
            .andWhere(new typeorm_1.Brackets((qb) => {
            qb.where(`user.email ILIKE :q`, {
                q: `%${q}%`,
            })
                .orWhere(`user.phone ILIKE :q`, { q: `%${q}%` })
                .orWhere(`user.user_name ILIKE :q`, { q: `%${q}%` })
                .orWhere(`user.first_name ILIKE :q`, { q: `%${q}%` })
                .orWhere(`user.last_name ILIKE :q`, { q: `%${q}%` });
        }))
            .skip(options.skip)
            .take(options.take);
        if (options.withDeleted) {
            qb = qb.withDeleted();
        }
        return await qb.getManyAndCount();
    }
};
UserRepository = __decorate([
    (0, medusa_extender_1.Repository)({ override: user_1.UserRepository }),
    (0, typeorm_1.EntityRepository)(user_entity_1.User)
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map