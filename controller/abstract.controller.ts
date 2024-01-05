import { Request, Response } from "express";
import { Abstract } from "../models/abstract.model";
import { Types } from "mongoose";
import { Conference, Event } from "../models/conference.model";
import { createTransport } from "nodemailer";
import UserService from "../services/user.services";
import { User } from "../models/User Profile Models/user.model";
import ical from "ical-generator"
import { Schema } from "mongoose";
import { app } from "../app";

export async function fetchAbstract(req: Request<{ id: string, confId: string, eventId: string }>, res: Response) {
    // let type = req.query.type;
    let { confId, eventId } = req.params;
    console.log(req.params.confId);

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
    try {

        // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
        let data = await Abstract.aggregate([
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
                                localField: 'events',
                                foreignField: '_id',
                                as: 'events',
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
                    ]
                }
            }
        ]);
        console.log(data[0])

        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function addAbstract(req: Request<{ id: string, confId: string }>, res: Response) {
    const { eventId, paperName, abstract, paperLink, isApproved } = req.body.data;
    const id = req.params.id;
    const confId = req.params.confId;
    // let user = await User.findById(id);
    // const _id = new Types.ObjectId(id);

    try {

        let data = new Abstract({ conferenceId: confId, eventId, userId: id, paperLink, abstract, paperName, isApproved });
        await data.save();
        // let userList = await User.find();

        res.json({ status: true, data });
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function editAbstract(req: Request<{ id: string, confId: string, absId: string }>, res: Response) {
    const absId = req.params.absId;

    try {
        let data = await Abstract.findByIdAndUpdate(absId, {
            $set: req.body.data,
        });
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function deleteAbstract(req: Request<{ id: string, absId: string }>, res: Response) {
    const absId = req.params.absId;
    let type = req.query.type;
    try {
        await Abstract.findByIdAndDelete(absId);
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}

export async function approveAbstract(req: Request<{ id: string, absId: string }>, res: Response) {
    const absId = req.params.absId;

    try {
        let data = await Abstract.findByIdAndUpdate(absId, {
            $set: req.body.data,
        });
        let approve = req.body.data.isApproved;
        let conferences = await Conference.findById(data.conferenceId);
        let event = await Event.findById(data.eventId);
        const cal = ical({ name: conferences.subject });
        let startTime = event.get('startTime', Date).toLocaleString('en-IN', { timeZone: 'UTC' });
        let endTime = event.get('endTime', Date).toLocaleString('en-IN', { timeZone: 'UTC' });
        // cal.url("mytestwebsite.com");
        if (approve) {
            cal.createEvent({
                start: event.get('startTime', Date),         // eg : moment()
                end: event.get('endTime', Date),             // eg : moment(1,'days')
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
                transporter['alternatives']['contentType'] = 'text/calendar'
                transporter['alternatives']['content'] = Buffer.from(cal.toString())
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
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}








function getIcalObjectInstance(starttime: Date, endtime: Date, summary, description, location, name) {
    const cal = ical({ name });
    // cal.url("mytestwebsite.com");
    cal.createEvent({
        start: starttime,         // eg : moment()
        end: endtime,             // eg : moment(1,'days')
        summary: summary,         // 'Summary of your event'
        description: description, // 'More description'
        location: location,       // 'Delhi'

    });
    return cal;
}