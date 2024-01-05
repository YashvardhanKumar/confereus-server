import { Router } from "express";
import { isAuthenticated, isTokenNotExpired } from "../../../middlewares/user.middleware";
import catchAsync from "../../../services/catchAsync";
import { addAbstract, approveAbstract, deleteAbstract, editAbstract, fetchAbstract } from "../../../controller/abstract.controller";

const abstractRoute = Router({ mergeParams: true });

abstractRoute.get('/', isAuthenticated, isTokenNotExpired, catchAsync(fetchAbstract))
    .get('/:eventId', isAuthenticated, isTokenNotExpired, catchAsync(fetchAbstract))
    .post('/add', isAuthenticated, isTokenNotExpired, catchAsync(addAbstract))
    .patch('/edit/:absId', isAuthenticated, isTokenNotExpired, catchAsync(editAbstract))
    .patch('/approve/:absId', isAuthenticated, isTokenNotExpired, catchAsync(approveAbstract))
    .delete('/delete/:absId', isAuthenticated, isTokenNotExpired, catchAsync(deleteAbstract))


export default abstractRoute;