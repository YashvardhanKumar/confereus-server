import { Router } from "express";
import catchAsync from "../../../../services/catchAsync";
import { getLinkedinUser } from "../../../../controller/user.controller";

const deeplinkRouter = Router({ mergeParams : true });

deeplinkRouter.post('/linkedinlogin',catchAsync(getLinkedinUser));
deeplinkRouter.get('/facebooklogin',catchAsync(getLinkedinUser));

export default deeplinkRouter;