import { Request, Response } from "express";
import { User } from "../interface/user";
import UserService from "../service/usermodule.service"
import { ResponseJSON } from '../interface/response'

class UserController {

    static signup = async (req: Request, res: Response) => {

        try {
            let username : string = req.body.username;
            let password : string = req.body.password;
            let emergencycontact : string = req.body.emergencycontact;
            const userobj : User = {
                id: null,
                emergencycontact: emergencycontact,
                username: username,
                password: password
            }
            const result : ResponseJSON = await UserService.usersignup(userobj)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "data": error, "error": true });
        }

    };

    static login = async (req: Request, res: Response) => {

        try {
            let username : string = req.body.username;
            let password : string = req.body.password;
            const userobj : User = {
                username: username,
                password: null,
                id: null,
                emergencycontact: null
            }
            const result : ResponseJSON = await UserService.userlogin(userobj,password)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error("error",error);
            res.status(400).send(error);
        }

    };
    
    static addhospital = async (req: Request, res: Response) => {

        try {
            let hospitalname = req.body.hospitalname;
            let hospitalphone = req.body.hospitalphone;
            let id : number = parseInt(req.body.id);
            
            const result : ResponseJSON = await UserService.addhospital(id,hospitalname,hospitalphone)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };

    static addemergency = async (req: Request, res: Response) => {

        try {
            let EmergencyPersonName = req.body.EmergencyPersonName;
            let emergencyphone = req.body.emergencyphone;
            let id : number = parseInt(req.body.id);
            
            const result : ResponseJSON = await UserService.addemergency(id,EmergencyPersonName,emergencyphone)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };
    
    static getallhospitals = async (req: Request, res: Response) => {

        try {
            let id : number = parseInt(req.body.id);
            
            const result : ResponseJSON = await UserService.getallhospitals(id)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };

    static getallemergency = async (req: Request, res: Response) => {

        try {
            let id : number = parseInt(req.body.id);
            
            const result : ResponseJSON = await UserService.getallemergency(id)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };
    
    static deletehospital = async (req: Request, res: Response) => {

        try {
            let id : number = parseInt(req.body.id);
            let userid : number = parseInt(req.body.userid);
            
            const result : ResponseJSON = await UserService.deletehospital(id,userid)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };

    static deleteEmergency = async (req: Request, res: Response) => {

        try {
            let id : number = parseInt(req.body.id);
            let userid : number = parseInt(req.body.userid);
            
            const result : ResponseJSON = await UserService.deleteEmergency(id,userid)
            if (result?.error)
            {
                res.status(400).send({ "data": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };

    static emergencyoccured = async (req: Request, res: Response) => {

        try {
            let livelocation = req.body.livelocation;
            let id : number = parseInt(req.body.id);
            
            const result : ResponseJSON = await UserService.emergencyoccured(id,livelocation)
            if (result?.error)
            {
                res.status(400).send({ "msg": result?.data, "error": true });
            }
            else
            {
                res.status(200).send({ "data": result?.data, "error": false });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ "msg": error, "error": true });
        }

    };
};

export default UserController;