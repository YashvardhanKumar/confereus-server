"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkedinUser = void 0;
const user_model_1 = require("../models/User Profile Models/user.model");
const user_services_1 = __importDefault(require("../services/user.services"));
const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile = 'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))';
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';
function getLinkedinUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, profilePicture, email } = req.body;
        console.log(req.body);
        const accessToken = user_services_1.default.generateToken({ email }, 15 * 60);
        const refreshToken = user_services_1.default.generateToken({ email }, 30 * 24 * 60 * 60);
        res.cookie("login_access_token", accessToken);
        res.cookie("login_refresh_token", refreshToken);
        // const accessToken = getAccessToken(code);
        // const userProfile = getUserProfile(accessToken);
        // const userEmail = getUserEmail(accessToken);
        // console.log(userEmail);
        // let resStatus = 400;
        // if(!(accessToken === null || userProfile === null || userEmail === null)) {
        let user = yield userBuilder({ firstName, lastName, profilePicture }, email);
        let resStatus = 200;
        console.log(user._id);
        // }
        res.status(resStatus).json({ token: accessToken, userId: user });
    });
}
exports.getLinkedinUser = getLinkedinUser;
// function getAccessToken(code) {
//   let accessToken = null;
//   const config = {
//     headers: { "Content-Type": 'application/x-www-form-urlencoded' }
//   };
//   const parameters = {
//     "grant_type": "authorization_code",
//     "code": code,
//     "redirect_uri": "http://localhost:3000/signin-linkedin",
//     "client_id": process.env.CLIENT_ID,
//     "client_secret": process.env.CLIENT_SECRET,
//   };
//   axios
//     .post(
//       urlToGetLinkedInAccessToken,
//       qs.stringify(parameters),
//       config)
//     .then(response => {
//       accessToken = response.data["access_token"];
//     })
//     .catch(err => {
//       console.log("Error getting LinkedIn access token");
//     })
//     return accessToken;
// }
// function getUserProfile(accessToken) {
//   let userProfile = null;
//   const config = {
//     headers: {
//       "Authorization": `Bearer ${accessToken}`
//     }
//   }
//   axios
//     .get(urlToGetUserProfile, config)
//     .then(response => {
//       userProfile.firstName = response.data["localizedFirstName"];
//       userProfile.lastName = response.data["localizedLastName"];
//       userProfile.profileImageURL = response.data.profilePicture["displayImage~"].elements[0].identifiers[0].identifier;
//       // I mean, couldn't they have burried it any deeper?
//     })
//     .catch(error => console.log("Error grabbing user profile"))
//   return userProfile;
// }
// function getUserEmail(accessToken) {
//   let email = null;
//   const config = {
//     headers: {
//       "Authorization": `Bearer ${accessToken}`
//     }
//   };
//   axios
//     .get(urlToGetUserEmail, config)
//     .then(response => {
//       email = response.data.elements[0]["handle~"];
//     })
//     .catch(error => console.log("Error getting user email"))
//   return email;
// }
function userBuilder(userProfile, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_model_1.User.findOne({
            email: userEmail,
            // provider: 'linkedin_login'
        });
        let data = {
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            profileImageURL: userProfile.profilePicture,
            email: userEmail,
            password: null,
            // dob: user.dob,
            emailVerified: true,
            provider: 'linkedin_login'
        };
        if (!user) {
            user = new user_model_1.User(data);
            yield user.save();
            return user._id;
        }
        if (user.provider == 'linkedin_login') {
            // await User.insertMany(data);
            // user = await User.findOne({ email: userEmail, provider: { $ne: 'linkedin_login' } });
            return user._id;
        }
        else {
            yield user.updateOne({
                $set: data,
            });
        }
        return user._id;
    });
}
//# sourceMappingURL=linkedin.config.js.map