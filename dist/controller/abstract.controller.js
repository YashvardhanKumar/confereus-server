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
exports.approveAbstract = exports.deleteAbstract = exports.editAbstract = exports.addAbstract = exports.fetchAbstract = void 0;
const app_1 = require("../app");
const abstract_services_1 = require("../services/abstract.services");
function fetchAbstract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // let type = req.query.type;
        let { confId, eventId } = req.params;
        // // console.log(req.params.confId);
        try {
            let data = yield abstract_services_1.AbstractServices.fetchAbstract(confId, eventId);
            // // console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchAbstract = fetchAbstract;
function addAbstract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { eventId, paperName, abstract, paperLink, isApproved } = req.body.data;
        const id = req.params.id;
        const confId = req.params.confId;
        // let user = await User.findById(id);
        // const _id = new Types.ObjectId(id);
        try {
            let data = yield abstract_services_1.AbstractServices.addAbstract(confId, id, eventId, paperName, abstract, paperLink);
            app_1.io.emit("abstracts", yield abstract_services_1.AbstractServices.fetchAbstract(confId, null));
            app_1.io.emit("abstracts-add", data);
            // let userList = await User.find();
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addAbstract = addAbstract;
function editAbstract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const absId = req.params.absId;
        try {
            let data = yield abstract_services_1.AbstractServices.editAbstract(req.body.data, absId);
            app_1.io.emit("abstracts", yield abstract_services_1.AbstractServices.fetchAbstract(req.body.confId, null));
            app_1.io.emit("abstracts-edit", data);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editAbstract = editAbstract;
function deleteAbstract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const absId = req.params.absId;
        let type = req.query.type;
        try {
            let data = yield abstract_services_1.AbstractServices.deleteAbstract(absId);
            app_1.io.emit("abstracts", yield abstract_services_1.AbstractServices.fetchAbstract(req.body.confId, null));
            app_1.io.emit("abstracts-delete", data);
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.deleteAbstract = deleteAbstract;
function approveAbstract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const absId = req.params.absId;
        try {
            let data = abstract_services_1.AbstractServices.approveAbstract(req.body.data, absId);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.approveAbstract = approveAbstract;
//# sourceMappingURL=abstract.controller.js.map