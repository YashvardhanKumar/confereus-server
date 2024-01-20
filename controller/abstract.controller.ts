import { Request, Response } from "express";
import {io} from "../app";
import { AbstractServices } from "../services/abstract.services";

export async function fetchAbstract(req: Request<{ id: string, confId: string, eventId: string }>, res: Response) {
    // let type = req.query.type;
    let { confId, eventId } = req.params;
    // console.log(req.params.confId);
    try {
        let data = await AbstractServices.fetchAbstract(confId, eventId)
        // console.log(data);
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

        let data = await AbstractServices.addAbstract(confId, id, eventId, paperName, abstract, paperLink);
        io.emit("abstracts", await AbstractServices.fetchAbstract(confId, null));
        io.emit("abstracts-add",data)
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
        let data = await AbstractServices.editAbstract(req.body.data, absId);
        io.emit("abstracts", await AbstractServices.fetchAbstract(req.body.confId, null));
        io.emit("abstracts-edit",data)
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
        let data = await AbstractServices.deleteAbstract(absId);
        io.emit("abstracts", await AbstractServices.fetchAbstract(req.body.confId, null));
        io.emit("abstracts-delete",data)
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
    res.json({ status: true });
}

export async function approveAbstract(req: Request<{ id: string, absId: string }>, res: Response) {
    const absId = req.params.absId;

    try {
        let data = AbstractServices.approveAbstract(req.body.data, absId);
        res.json({ status: true, data });

    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong" });
    }
}