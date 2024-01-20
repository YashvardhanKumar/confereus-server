import { Request, Response } from "express";
import { Conference } from "../models/conference.model";
import mongoose, { Schema, Types } from "mongoose";
import { EventServices } from "../services/event.services";
import {io} from "../app";

export async function getEvent(req: Request, res: Response) {
    const confId = req.params.confId;
    try {
        let data = await EventServices.fetchEvents(confId);
        res.json({ status: true, data });
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
} export async function addEvent(req: Request<{ id: string, confId: string }>, res: Response) {
    const { subject, presenter, startTime, endTime, location } = req.body.data;
    const confId = req.params.confId;
    try {

        let data = await EventServices.addEvents(subject, presenter, startTime, endTime, location,confId);
        io.emit("events",await EventServices.fetchEvents(confId))
        io.emit("events-add",data)
        res.json({ status: true, data });
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function editEvent(req: Request<{ id: string, confId: string, eventId: string }>, res: Response) {
    const eventId = req.params.eventId;

    try {
        let data = await EventServices.editEvents(req.body.data,eventId)
        io.emit("events",await EventServices.fetchEvents(req.params.confId))
        io.emit("events-edit",data)
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}

export async function deleteEvent(req: Request<{ id: string, confId: string, eventId: string }>, res: Response) {
    const eventId = req.params.eventId;
    const confId = req.params.confId;
    try {
        let data = await EventServices.deleteEvents(eventId,confId);
        io.emit("events",await EventServices.fetchEvents(req.params.confId))
        io.emit("events-delete",data);
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}