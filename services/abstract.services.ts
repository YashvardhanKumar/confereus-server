import { Types } from "mongoose";
import { Abstract } from "../models/abstract.model";
import { Request } from "express";
import { Conference } from "../models/conference.model";
import { createTransport } from "nodemailer";
import { User } from "../models/User Profile Models/user.model";
import ical, { ICalCalendarMethod } from "ical-generator";
import { Event } from "../models/events.model";
import { EventServices } from "./event.services";

export class AbstractServices {
    static async fetchAbstract(confId: string, eventId: string) {
        let match = {};
        if (eventId) {
            match = {
                conferenceId: new Types.ObjectId(confId),
                eventId: new Types.ObjectId(eventId)
            }
        }
        else {
            match = {
                conferenceId: new Types.ObjectId(confId),
            }
        }

        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        return await Abstract.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'conferences',
                    localField: 'conferenceId',
                    foreignField: '_id',
                    as: 'conference',
                    pipeline: [
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
                    ]
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'event',
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users',
                    pipeline: [
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
                    ]
                }
            }
        ]);
    }
    static async fetchAbstractOne(abstractId: string) {
        let match = {};
        match = {
            abstractId: new Types.ObjectId(abstractId),
        }


        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        return await Abstract.aggregate([
            {
                $match: match
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: 'conferences',
                    localField: 'conferenceId',
                    foreignField: '_id',
                    as: 'conference',
                    pipeline: [
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
                    ]
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'event',
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users',
                    pipeline: [
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
                    ]
                }
            }
        ]);
    }
    static async addAbstract(confId: string, userId: string, eventId: string, paperName: string, abstract: string, paperLink: string) {
        let ttl = (await Event.findById(eventId)).endTime
        
        let data = new Abstract({ conferenceId: confId, eventId, userId, paperLink, abstract, paperName, endAt: ttl });
        // Abstract.watch().on('change', data => // console.log(data));
        await data.save();
        return data;
    }

    static async editAbstract(bodydata: any, absId: string) {
        return await Abstract.findByIdAndUpdate(absId, {
            $set: bodydata,
        });
    }

    static async deleteAbstract(absId: string) {
        let data = await Abstract.findById(absId);
        await Abstract.findByIdAndDelete(absId);
        return data;
    }

    static async approveAbstract(bodydata: any, absId: string) {
        let data = await Abstract.findByIdAndUpdate(absId, {
            $set: bodydata,
        });
        let approve = bodydata.isApproved;
        let conferences = await Conference.findById(data.conferenceId);
        let event = await Event.findById(data.eventId);
        const cal = ical({ name: conferences.subject });
        cal.method(ICalCalendarMethod.REQUEST);
        let startTime = event.get('startTime', Date).toLocaleString();
        // 'en-IN', { timeZone: 'UTC' }
        let endTime = event.get('endTime', Date).toLocaleString();
        // cal.url("mytestwebsite.com");
        if (approve) {
            cal.createEvent({
                start: new Date(startTime),         // eg : moment()
                end: new Date(endTime),             // eg : moment(1,'days')
                summary: conferences.subject,         // 'Summary of your event'
                description: conferences.about, // 'More description'
                location: conferences.location,       // 'Delhi'
            });
        }
        for (let index = 0; index < data.userId.length; index++) {
            const element = data.userId[index];
            let user = await User.findById(element);
            const transporter = createTransport({
                secure: true,
                service: 'gmail',
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: { rejectUnauthorized: false }
            })
            if (approve) {
                let alternatives = {
                    "Content-Type": "text/calendar",
                    "method": "REQUEST",
                    "content": Buffer.from(cal.toString()),
                    "component": "VEVENT",
                    "Content-Class": "urn:content-classes:calendarmessage"
                }
                transporter['alternatives'] = alternatives;
                // transporter['alternatives']['contentType'] = 'text/calendar'
                // transporter['alternatives']['content'] = Buffer.from(cal.toString())
            }
            const message = {
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                to: user.email,
                subject: `Regarding your paper on ${conferences.subject} `,
                html: `<div>
                    <h3>Hello ${user.name},</h3>
                    ${conferences.eventLogo ? `<img src="${conferences.eventLogo}" alt="eventlogo"/>` : ""}
                    <p>${approve ? "Congratulations!" : ""} Your abstract was ${approve ? "<b>Approved</b>" : "<b>Rejected</b>"} by the reviewers!</p>
                    <p>${approve ? "Your presentation on <b>" + event.subject + "</b> is scheduled on <b>" + startTime + "</b> till <b>" + endTime +
                        "</b> located at <b>" + conferences.location + "</b>. A person from the conference administration may connect to you soon via. mail!" : ""}</p>
                    <p>If you didn't recognize this mail, you can ignore this email or reply back to this mail if issue persists!</p>
                    <p>Regards,</p>
                    <p>Confereus team</p>
                    </div>`
            }
            const info = await transporter.sendMail(message);
        }
        await Event.findByIdAndUpdate(data.eventId, {
            $push: {
                presenter: data.userId
            }
        })
        return data;
    }
}
