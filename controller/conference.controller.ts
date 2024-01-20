import { Request, Response } from "express";
import { User } from "../models/User Profile Models/user.model";
import { Conference } from "../models/conference.model";
import mongoose, { Schema, Types } from "mongoose";
import { createReadStream, createWriteStream, unlinkSync, writeFileSync } from "fs";
import ConferenceServices from "../services/conference.services";
import {io} from "../app";

export async function fetchConferences(req: Request, res: Response) {
    let type = req.query.type;
    
    try {
        let data = await ConferenceServices.fetchConferences(type);
        // console.log(data);
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function fetchConferencesOne(req: Request<{ confId: string }>, res: Response) {
    let type = req.query.type;
    
    try {
        let data = await ConferenceServices.fetchConferencesOne(type,req.params.confId);
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function addConference(req: Request<{ id: string }>, res: Response) {
    const { subject, about, admin, startTime, endTime,location } = req.body.data;
    const id = req.params.id;

    try {
        let data = await ConferenceServices.addConferences(subject, about, startTime, endTime, admin, id, location)
        io.emit("conferences",await ConferenceServices.fetchConferences(null))
        io.emit("conferences-add",data)
        res.json({ status: true, data });
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function editConference(req: Request<{ id: string, confId: string }>, res: Response) {
    const conferenceId = req.params.confId;

    try {
        let data = await ConferenceServices.editConferences(conferenceId,req.body.data);
        io.emit("conferences",await ConferenceServices.fetchConferences(null))
        io.emit("conferences-edit",await ConferenceServices.fetchConferencesOne(null,conferenceId))
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function deleteConference(req: Request<{ id: string, confId: string }>, res: Response) {
    const conferenceId = req.params.confId;
    let type = req.query.type;
    try {
        let data = await ConferenceServices.deleteConference(conferenceId)
        io.emit("conferences",await ConferenceServices.fetchConferences(null))
        io.emit("conferences-delete",data)
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}

export async function registerConference(req: Request<{ id: string, confId: string }>, res: Response) {
    const conferenceId = req.params.confId;
    const userId = req.params.id;
    try {
        let data = await Conference.findByIdAndUpdate(conferenceId, { $push: { registered: userId } });
        io.emit("conferences",await ConferenceServices.fetchConferences(null))
        io.emit("conferences-edit",data)
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}
export async function customizeRoles(req: Request<{ id: string, confId: string }>, res: Response) {
    const conferenceId = req.params.confId;
    const userId = req.params.id;
    const {reviewer, admin } = req.body.data;
    try {
        let data = await Conference.findByIdAndUpdate(conferenceId, {$set: {reviewer, admin}});
        io.emit("conferences",await ConferenceServices.fetchConferences(null))
        io.emit("conferences-edit",data)
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}

export async function fetchRegisteredConferences(req: Request<{ id: string }>, res: Response) {
    const userId = req.params.id;
    
    try {
        let data = await ConferenceServices.fetchRegisteredConferences(null,userId)
        // console.log(data);
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}