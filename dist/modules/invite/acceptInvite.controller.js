"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const invite_service_1 = require("./invite.service");
const medusa_core_utils_1 = require("medusa-core-utils");
const validator_1 = require("@medusajs/medusa/dist/utils/validator");
exports.default = async (req, res) => {
    const validated = await (0, validator_1.validator)(medusa_1.AdminPostInvitesInviteAcceptReq, req.body);
    const inviteService = req.scope.resolve(invite_service_1.InviteService.resolutionKey);
    const manager = req.scope.resolve("manager");
    await manager.transaction(async (m) => {
        //retrieve invite
        let decoded;
        try {
            decoded = inviteService
                .withTransaction(m)
                .verifyToken(validated.token);
        }
        catch (err) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Token is not valid");
        }
        const invite = await inviteService
            .withTransaction(m)
            .retrieve(decoded.invite_id);
        let store_id = invite ? invite.store_id : null;
        const user = await inviteService
            .withTransaction(m)
            .accept(validated.token, validated.user);
        if (store_id) {
            const userService = req.scope.resolve("userService");
            await userService
                .withTransaction(m)
                .addUserToStore(user.id, store_id);
        }
        else {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `No store id assocaited with the invite of id: ${decoded.invite_id}`);
        }
        res.sendStatus(200);
    });
};
//   await userService
//       .withTransaction(m)
//       .addUserToStore(user.id, store_id);
//     }
//     res.sendStatus(200)
//   })
// }
//# sourceMappingURL=acceptInvite.controller.js.map