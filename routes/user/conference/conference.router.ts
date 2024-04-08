import { Router } from "express";
import { addConference, customizeRoles, deleteConference, editConference, fetchConferences, fetchConferencesOne, fetchRegisteredConferences, registerConference } from "../../../controller/conference.controller";
import { checkAccessToken, isAuthenticated, isTokenNotExpired } from "../../../middlewares/user.middleware";
import catchAsync from "../../../services/catchAsync";
// import { uploads } from "../../../config/utils/conflogo.upload";
import { editLogoConf } from "../../../controller/fileUploader.controller";

const conferenceRoute = Router({ mergeParams: true });

conferenceRoute.get('/registered', isAuthenticated, isTokenNotExpired, catchAsync(fetchRegisteredConferences))
    .post('/:confId/register', isAuthenticated, isTokenNotExpired, catchAsync(registerConference))
    .patch('/:confId/roleschange', isAuthenticated, isTokenNotExpired, catchAsync(customizeRoles));

conferenceRoute
    .get('/', isAuthenticated, isTokenNotExpired, catchAsync(fetchConferences))
    .get('/:confId', isAuthenticated, isTokenNotExpired, catchAsync(fetchConferencesOne))
    .patch('/:confId/uploadLogo', checkAccessToken, catchAsync(editLogoConf))
    .post('/add', isAuthenticated, isTokenNotExpired, catchAsync(addConference))
    .patch('/edit/:confId', isAuthenticated, isTokenNotExpired, catchAsync(editConference))
    .delete('/delete/:confId', isAuthenticated, isTokenNotExpired, catchAsync(deleteConference))



export default conferenceRoute;