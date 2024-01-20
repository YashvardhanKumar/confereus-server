
import { Event } from "../models/events.model";
import { Conference } from "../models/conference.model";
import { Types } from "mongoose";
import { deleteConference } from "../controller/conference.controller";
class ConferenceServices {
    static async fetchConferences(type: any) {
        if (!type)
            type = "public";
        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        let data = await Conference.aggregate([
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventsId',
                    foreignField: '_id',
                    as: 'events_data',
                    pipeline: [
                        { $sort: { startTime: 1 } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'admin',
                    foreignField: '_id',
                    as: 'admin_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewer',
                    foreignField: '_id',
                    as: 'reviewer_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
        ]);
        // // console.log("data");
        // // console.log(data);

        return data;
    }
    static async fetchConferencesOne(type: any, confId: string) {
        if (!type)
            type = "public";
        // // console.log(confId);

        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        let data = await Conference.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(confId),
                }
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventsId',
                    foreignField: '_id',
                    as: 'events_data',
                    pipeline: [
                        { $sort: { startTime: 1 } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'admin',
                    foreignField: '_id',
                    as: 'admin_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewer',
                    foreignField: '_id',
                    as: 'reviewer_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
        ]);
        return data[0];
    }

    static async fetchRegisteredConferences(type: any, userId: string,) {
        if (!type)
            type = "public";
        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        let data = await Conference.aggregate([
            {
                $match: {
                    registered: new Types.ObjectId(userId),
                }
            },
            {
                $sort: { startTime: 1 }
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'events',
                    foreignField: '_id',
                    as: 'events_data',
                    pipeline: [
                        { $sort: { startTime: 1 } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'admin',
                    foreignField: '_id',
                    as: 'admin_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewer',
                    foreignField: '_id',
                    as: 'reviewer_data',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'work_experiences',
                                localField: 'workExperience',
                                foreignField: '_id',
                                as: 'workExperience_data',
                            }
                        },
                        {
                            $lookup: {
                                from: 'educations',
                                localField: 'education',
                                foreignField: '_id',
                                as: 'education_data',
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
                    ]
                }
            },
        ]);
        return data;
    }

    static async addConferences(subject: string, about: string, startTime: any, endTime: any, admin: string, id: string, location: string) {
        let data = new Conference({ subject, about, startTime, endTime, admin, creator: id, location });
        await data.save();
        // let userList = await User.find();
        return data
    }

    static async editConferences(conferenceId: string, bodydata: any) {
        let data = await Conference.findByIdAndUpdate(conferenceId, {
            $set: bodydata,
        });
        return data;
    }

    static async registerConferences(conferenceId: string, userId: string) {
        let data = await Conference.findByIdAndUpdate(conferenceId, { $push: { registered: userId } });
        return data;
    }

    static async editLogo(filepath: any, confId: string) {
        let edit = await Conference.findByIdAndUpdate(confId, {
            $set: {
                eventLogo: filepath
            },
        },
            { new: true },
        );
        return edit;
    }
    static async deleteConference(conferenceId: string) {
        let data = await Conference.findById(conferenceId);
        await Event.deleteMany({ _id: { $in: data.eventsId } });
        await Conference.findByIdAndDelete(conferenceId);
        return data;
    }

    static async conferenceReminderMail(name: string, dob: Date, email: string, password: string) {
        try {

            // const createUser = new User({ name, email, password, dob })
        } catch (error) {
            throw error;
        }
    }

    static async conferenceUpdationMail(name: string, dob: Date, email: string, password: string) {
        try {

            // const createUser = new User({ name, email, password, dob })

        } catch (error) {
            throw error;
        }
    }
}

export default ConferenceServices;