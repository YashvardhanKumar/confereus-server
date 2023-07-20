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
exports.deleteSkills = exports.editSkill = exports.addSkill = exports.deleteEducation = exports.editEducation = exports.addEducation = exports.deleteWorkSpace = exports.editWorkSpace = exports.addWorkSpace = exports.editProfile = exports.fetchProfile = void 0;
const user_model_1 = require("../models/User Profile Models/user.model");
const work_experience_model_1 = require("../models/User Profile Models/sub_documents/work_experience.model");
const education_model_1 = require("../models/User Profile Models/sub_documents/education.model");
const skills_model_1 = require("../models/User Profile Models/sub_documents/skills.model");
const mongoose_1 = require("mongoose");
function fetchProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log(id);
        const { ObjectId } = mongoose_1.Types;
        try {
            const data = yield user_model_1.User.aggregate([
                { $match: { _id: new ObjectId(id) } },
                {
                    $lookup: {
                        from: 'work_experiences',
                        localField: 'workExperience',
                        foreignField: '_id',
                        as: 'workExperience',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'educations',
                        localField: 'education',
                        foreignField: '_id',
                        as: 'education',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'skills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills',
                    }
                },
                { $limit: 1 },
            ]);
            // .findById(id).populate(['workExperience', 'education', 'skills']);
            console.log(data);
            res.json({ status: true, data: data[0] });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchProfile = fetchProfile;
function editProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const data = yield user_model_1.User.findByIdAndUpdate(id, { $set: req.body.data });
            console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editProfile = editProfile;
function addWorkSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const data = new work_experience_model_1.WorkExperience(req.body.data);
            yield data.save();
            console.log(data);
            const user = yield user_model_1.User.findByIdAndUpdate(id, { $push: { workExperience: data._id } });
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addWorkSpace = addWorkSpace;
function editWorkSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const wid = req.params.wid;
        try {
            const data = yield work_experience_model_1.WorkExperience.findByIdAndUpdate(wid, { $set: req.body.data });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editWorkSpace = editWorkSpace;
function deleteWorkSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const wid = req.params.wid;
        try {
            const user = yield work_experience_model_1.WorkExperience.findByIdAndDelete(wid);
            yield user_model_1.User.findByIdAndUpdate(id, { $pull: { workExperience: user._id } });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            res.json({ status: true });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.deleteWorkSpace = deleteWorkSpace;
function addEducation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const data = new education_model_1.Education(req.body.data);
            yield data.save();
            yield user_model_1.User.findByIdAndUpdate(id, { $push: { education: data._id } });
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addEducation = addEducation;
function editEducation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const eid = req.params.eid;
        try {
            // const user = await Education.findByIdAndUpdate(eid,{$set: req.body.data });
            const user = yield education_model_1.Education.findByIdAndUpdate(eid, { $set: req.body.data });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            let data = user;
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editEducation = editEducation;
function deleteEducation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const eid = req.params.eid;
        try {
            const data = yield education_model_1.Education.findByIdAndDelete(eid);
            yield user_model_1.User.findByIdAndUpdate(id, { $pull: { education: data._id } });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            res.json({ status: true });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.deleteEducation = deleteEducation;
function addSkill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const data = new skills_model_1.Skills(req.body.data);
            yield data.save();
            yield user_model_1.User.findByIdAndUpdate(id, { $push: { skills: data } });
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addSkill = addSkill;
function editSkill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const sid = req.params.sid;
        try {
            // const user = await Skills.findByIdAndUpdate(sid,{$set: req.body.data});
            const data = yield skills_model_1.Skills.findByIdAndUpdate(sid, { $set: req.body.data });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editSkill = editSkill;
function deleteSkills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const sid = req.params.sid;
        try {
            const data = yield skills_model_1.Skills.findByIdAndDelete(sid);
            yield user_model_1.User.findByIdAndUpdate(id, { $pull: { skills: data._id } });
            // const data = new WorkExperience(req.body);
            // let workExperience = user.workExperience;
            // workExperience.push(data);
            res.json({ status: true });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.deleteSkills = deleteSkills;
//# sourceMappingURL=profile.controller.js.map