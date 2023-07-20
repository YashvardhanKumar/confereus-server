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
Object.defineProperty(exports, "__esModule", { value: true });
exports.editLogoConf = void 0;
const conference_model_1 = require("../models/conference.model");
function editLogoConf(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.params);
        try {
            let edit = yield conference_model_1.Conference.findByIdAndUpdate(req.params.confId, {
                $set: {
                    eventLogo: req.file.path
                },
            }, { new: true });
            const response = { status: true, data: edit };
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