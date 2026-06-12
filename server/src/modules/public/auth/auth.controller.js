import { app_config } from "../../../shared/constants/app.constant.js";
import AuthService from "./auth.service.js";



export default class AuthController{
    constructor(){
        this.authService=new AuthService()
    }
    async GoogleCallback(req,res){
     let {accessToken,refreshToken} = await this.authService.createUser(req.user)
     res.cookie("accesstoken",accessToken,app_config.cookies.ACESSS_COKKIE)
     res.cookie("refreshToken",refreshToken,app_config.cookies.REFRESH_COOKIE)
     res.redirect('http://localhost:5173')
    }
}