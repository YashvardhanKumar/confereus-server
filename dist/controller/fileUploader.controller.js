"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editLogoConf = void 0;
const conference_services_1 = __importDefault(require("../services/conference.services"));
function editLogoConf(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield conference_services_1.default.editLogo(req.file.path, req.params.confId);
            const response = { status: true, data };
            return res.status(200).json(response);
        }
        catch (err) {
            return res.status(500).json({ status: false });
        }
        // (err, profile) => {
        //     if (err) return res.status(500).send(err);
        //     const response = {
        //       message: "image added successfully updated",
        //       data: profile,
        //     };
        //     return res.status(200).send(response);
        //   }
    });
}
exports.editLogoConf = editLogoConf;
//# sourceMappingURL=fileUploader.controller.js.map