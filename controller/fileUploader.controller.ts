import { Request, Response } from "express";
import UserService from "../services/user.services";
import { User } from "../models/User Profile Models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { Conference } from "../models/conference.model";
import ConferenceServices from "../services/conference.services";



export async function editLogoConf(req: Request, res: Response) {
    
    try {
        let data = await ConferenceServices.editLogo(req.file.path,req.params.confId);
        const response = { status: true, data };
        return res.status(200).json(response);
    } catch (err) {
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
}
