import { User } from "../models/User Profile Models/user.model";
import * as jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
class UserService {
    static async signUpWithEmailAndPassword(name: string, dob: Date, email: string, password: string) {
        try {

            const createUser = new User({ name, email, password, dob, provider: 'email_login' });
            await createUser.save();
            return createUser;
        } catch (error) {
            throw error;
        }
    }
    static async userBuilder(userProfile, userEmail) {
        let user = await User.findOne({
            email: userEmail,
        });
        let data = {
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            profileImageURL: userProfile.profilePicture,
            email: userEmail,
            password: null,
            emailVerified: true,
            provider: 'linkedin_login'
        }
        if (!user) {
            user = new User(data);
            await user.save();
            return user._id;
        }
        if (user.provider == 'linkedin_login') {
            return user._id;
        } else {

            await user.updateOne({
                $set: data,
            })
        }
        return user._id;
    }

    static async updatePass(email: string, password: string) {
        try {
            const userId = await User.findOneAndUpdate({ email }, { $set: { password } });

            return userId;
        } catch (error) {
            return "Something Went Wrong!";
        }
    }

    static async signUpWithFacebook(name: string, dob: Date, email: string, password: string) {
        try {

            const createUser = new User({ name, email, password, dob })
        } catch (error) {
            throw error;
        }
    }


    static async signUpWithTwitter(name: string, dob: Date, email: string, password: string) {
        try {

            const createUser = new User({ name, email, password, dob })

        } catch (error) {
            throw error;
        }
    }
    static generateToken(payload: jwt.JwtPayload, jwt_expire: number) {
        const privateKey = process.env.PRIVATE_KEY;
        try {
            return jwt.sign(payload, privateKey, { expiresIn: jwt_expire, algorithm: 'RS256' });
        } catch (err) {
            // console.log(err);
            return null;
        }
    }

    static verifyToken(token: string, onError: Function = () => {

    }) {
        const publicKey = process.env.PUBLIC_KEY;

        try {
            return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        } catch (err) {
            // console.log(err);
            onError();
            return err;
        }
    }
}

export default UserService;
