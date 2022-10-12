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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const invite_1 = __importDefault(require("@medusajs/medusa/dist/services/invite"));
const medusa_extender_1 = require("medusa-extender");
let InviteService = class InviteService extends invite_1.default {
    constructor(container, configModule) {
        super(container, configModule);
        this.manager = container.manager;
        this.container = container;
        this.inviteRepository = container.inviteRepository;
    }
    customBuildQuery(selector, config = {}) {
        if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
            selector['store_id'] = this.container.loggedInUser.store_id;
        }
        return super.buildQuery_(selector, config);
    }
    // buildQuery_(selector, config = {}): object {
    //   if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
    //       selector['store_id'] = this.container.loggedInUser.store_id;
    //   }
    //   return super.buildQuery_(selector, config);
    // }
    async retrieve(invite_id) {
        const query = this.customBuildQuery(invite_id);
        const invite = await this.inviteRepository.findOne(query);
        //return await inviteRepo.findOne({ where: { id: invite_id } })
        return invite;
        //   return await this.atomicPhase_(async (m) => {
        //   const inviteRepo: InviteRepository = m.getCustomRepository(
        //     this.inviteRepository
        //   )
        //   return await inviteRepo.findOne({ where: { id: invite_id } })
        // })
    }
};
InviteService.resolutionKey = "inviteService";
InviteService = __decorate([
    (0, medusa_extender_1.Service)({ scope: 'SCOPED', override: invite_1.default }),
    __metadata("design:paramtypes", [Object, Object])
], InviteService);
exports.InviteService = InviteService;
//# sourceMappingURL=invite.service.js.map