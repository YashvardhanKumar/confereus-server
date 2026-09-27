import { User } from "../models/user_profile/user.model";
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
        const privateKey = getPrivateKey();
        try {
            return jwt.sign(payload, privateKey, { expiresIn: jwt_expire, algorithm: 'RS256' });
        } catch (err) {
            // console.log(err);
            return null;
        }
    }

    static verifyToken(token: string, onError: () => void = () => {

    }) {
        const publicKey = getPublicKey();

        try {
            return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        } catch (err) {
            // console.log(err);
            onError();
            return err;
        }
    }
}

function getPrivateKey(): string {
    if (process.env.PRIVATE_KEY) {
        return process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    }
    const possiblePaths = [
        path.join(__dirname, '..', 'keys', 'rsa.key'),
        path.join(process.cwd(), 'keys', 'rsa.key'),
        path.join(__dirname, 'keys', 'rsa.key'),
    ];
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return fs.readFileSync(p, 'utf8');
        }
    }
    return '';
}

function getPublicKey(): string {
    if (process.env.PUBLIC_KEY) {
        return process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
    }
    const possiblePaths = [
        path.join(__dirname, '..', 'keys', 'rsa.key.pub'),
        path.join(process.cwd(), 'keys', 'rsa.key.pub'),
        path.join(__dirname, 'keys', 'rsa.key.pub'),
    ];
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return fs.readFileSync(p, 'utf8');
        }
    }
    return '';
}

export default UserService;
