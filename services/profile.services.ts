import { Types } from "mongoose";
import { User } from "../models/User Profile Models/user.model";

export class ProfileController {
    static async fetchProfileOne(id: string) {
        const { ObjectId } = Types;
        return await User.aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: 'work_experiences',
                    localField: 'workExperience',
                    foreignField: '_id',
                    as: 'workExperience_data',
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
                    as: 'education_data',
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
                    as: 'skills_data',
                }
            },
            { $limit: 1 },
        ]);
    }

    static async fetchProfile() {
        const { ObjectId } = Types;
        return await User.aggregate([
            {
                $lookup: {
                    from: 'work_experiences',
                    localField: 'workExperience',
                    foreignField: '_id',
                    as: 'workExperience_data',
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
                    as: 'education_data',
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
                    as: 'skills_data',
                }
            },
            { $limit: 1 },
        ]);
    }

     static async editProfile(id:string,bodydata:any) {
        const data = await User.findByIdAndUpdate(id, { $set: bodydata });
        return data;
     }
}