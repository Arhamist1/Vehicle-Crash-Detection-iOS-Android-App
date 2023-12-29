import { User } from "../interface/user";
import { MySql } from "../utils/mysql";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { format } from "mysql2";
import * as bcrypt from "bcryptjs";
import { ResponseJSON } from '../interface/response';

const UserService = {

    usersignup: async (userobj: User): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();

                // Selecting User Data
                const selectquery : string = format(`select id,username,password from accidentapp.users where username=?`,[userobj.username])
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(selectquery);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                let ResponseInJson : ResponseJSON;
                if(DBResponseJsonVal.length > 0)
                {
                    ResponseInJson = {
                        error: true,
                        data : {
                            "msg" : "You are already signed up.",
                            "signedUp" : false
                        }
                    }
                }
                else
                {
                    const salt : string = await bcrypt.genSalt(8);
                    const password : any = userobj.password;
                    const passwordHash : string = await bcrypt.hash(password, salt);
                    const query : string = format(`INSERT INTO accidentapp.users  (username,password) 
                                                    VALUES (?,?)`
                                                    ,[userobj.username,passwordHash])
                    // const result = await mysql.poolQuery(query);
                    const dbResponse: any = await mysql.poolQuery(query);
                    let insertionResponse = JSON.parse(JSON.stringify(dbResponse[0]));
                    var userId = parseInt(insertionResponse.insertId);

                    const emergencyquery : string = format(`INSERT INTO accidentapp.emergencycontact  (phone,userid) 
                                                    VALUES (?,?)`
                                                    ,[userobj.emergencycontact,userId])
                    await mysql.poolQuery(emergencyquery);
                    ResponseInJson = {
                        error: true,
                        data : {
                            "msg" : "User Created.",
                            "signedUp" : true,
                            "id":userId
                        }
                    }
                }
                res(ResponseInJson)
            }
            catch (err)
            {
                console.log("err: ",err)
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err,
                        "msg" : "Some issue occured while signup",
                        "signedUp" : false
                    }
                }

                rej(ResponseInJson)
            }
        });
    },

    userlogin: async (userobj: User,password: string): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const query : string = format(`select id,username,password from accidentapp.users where username=?`,[userobj.username])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                const userdata = DBResponseJsonVal[0];
                let ResponseInJson : ResponseJSON;
                const password_from_obj : any = userdata.password;

                if(bcrypt.compareSync(password,password_from_obj))
                {
                
                    ResponseInJson = {
                        error: false,
                        data : {
                            "ispasswordtrue" : true,
                            "msg" : "Login.",
                            "login" : true,
                            id:userdata.id
                        }
                    }

                }
                else
                {
                    ResponseInJson = {
                        error: false,
                        data : {
                            "ispasswordtrue" : false,
                            "msg" : "Password is incorrect.",
                            "login" : true
                        }
                    }
                }
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err,
                        "msg" : "Issue occured.",
                        "login" : false
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },
    
    addhospital: async (id: number, hospitalname : any, hospitalphone : any): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const checkifAlreadyPresentQuery : string = format(`select id,name,phone from accidentapp.hospitals where phone=?`,[hospitalphone])
                const checkifAlreadyPresentQueryresponse : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(checkifAlreadyPresentQuery);
                let checkifAlreadyPresentQueryDBResponseJsonVal = JSON.parse(JSON.stringify(checkifAlreadyPresentQueryresponse[0]));
                if(checkifAlreadyPresentQueryDBResponseJsonVal.length <= 0)
                {
                    const emergencyquery : string = format(`INSERT INTO accidentapp.hospitals  (name,phone,userid) 
                                                        VALUES (?,?,?)`
                                                        ,[hospitalname,hospitalphone,id])
                    await mysql.poolQuery(emergencyquery);
    
                    const query : string = format(`select id,name,phone from accidentapp.hospitals where userid=?`,[id])
        
                    const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                    let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                    
                    const userdata = DBResponseJsonVal;
                    let ResponseInJson : ResponseJSON = {
                        error: false,
                        data : {
                            "userdata" : userdata,
                            isadded:true
                        }
                    }
    
                    
                    res(ResponseInJson)

                }
                else
                {
                    let ResponseInJson : ResponseJSON = {
                        error: false,
                        data : {
                            isadded:false,
                            msg:"Phone number already added."
                        }
                    }
    
                    
                    res(ResponseInJson)
                }

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },
    
    getallhospitals: async (id: number): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const query : string = format(`select id,name,phone from accidentapp.hospitals where userid=?`,[id])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                const userdata = DBResponseJsonVal;

                let ResponseInJson : ResponseJSON = {
                    error: false,
                    data : {
                        "userdata" : userdata
                    }
                }

                
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },
    deletehospital: async (id: number,userid: number): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const emergencyquery : string = format(`DELETE from accidentapp.hospitals where id=?`
                                                    ,[id])
                await mysql.poolQuery(emergencyquery);

                const query : string = format(`select id,name,phone from accidentapp.hospitals where userid=?`,[userid])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                const userdata = DBResponseJsonVal;

                let ResponseInJson : ResponseJSON = {
                    error: false,
                    data : {
                        "userdata" : userdata
                    }
                }

                
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },

    addemergency: async (id: number, EmergencyPersonName: any , emergencyphone: any): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const checkifAlreadyPresentQuery : string = format(`select id,name,phone from accidentapp.emergencycontact where phone=?`,[emergencyphone])
                const checkifAlreadyPresentQueryresponse : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(checkifAlreadyPresentQuery);
                let checkifAlreadyPresentQueryDBResponseJsonVal = JSON.parse(JSON.stringify(checkifAlreadyPresentQueryresponse[0]));
                if(checkifAlreadyPresentQueryDBResponseJsonVal.length <= 0)
                {
                    const emergencyquery : string = format(`INSERT INTO accidentapp.emergencycontact  (name,phone,userid) 
                                                        VALUES (?,?,?)`
                                                        ,[EmergencyPersonName,emergencyphone,id])
                    await mysql.poolQuery(emergencyquery);
    
                    const query : string = format(`select id,name,phone from accidentapp.emergencycontact where userid=?`,[id])
        
                    const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                    let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                    
                    const userdata = DBResponseJsonVal;
                    let ResponseInJson : ResponseJSON = {
                        error: false,
                        data : {
                            "userdata" : userdata,
                            isadded:true
                        }
                    }
    
                    
                    res(ResponseInJson)

                }
                else
                {
                    let ResponseInJson : ResponseJSON = {
                        error: false,
                        data : {
                            isadded:false,
                            msg:"Phone number already added."
                        }
                    }
    
                    
                    res(ResponseInJson)
                }

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },
    
    getallemergency: async (id: number): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const query : string = format(`select id,name,phone from accidentapp.emergencycontact where userid=?`,[id])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                const userdata = DBResponseJsonVal;

                let ResponseInJson : ResponseJSON = {
                    error: false,
                    data : {
                        "userdata" : userdata
                    }
                }

                
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },
    deleteEmergency: async (id: number,userid: number): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{
                const mysql : MySql = MySql.getMysqlInstance();
                const emergencyquery : string = format(`DELETE from accidentapp.emergencycontact where id=?`
                                                    ,[id])
                await mysql.poolQuery(emergencyquery);

                const query : string = format(`select id,name,phone from accidentapp.emergencycontact where userid=?`,[userid])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                const userdata = DBResponseJsonVal;

                let ResponseInJson : ResponseJSON = {
                    error: false,
                    data : {
                        "userdata" : userdata
                    }
                }

                
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    },

    emergencyoccured: async (id: number, livelocation : any): Promise<any> => {
        return new Promise(async (res, rej) => {
            try{

                const mysql : MySql = MySql.getMysqlInstance();


                const query_user : string = format(`select id,username from accidentapp.users where id=?`,[id])
    
                const response_user : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query_user);
                let DBResponseJsonVal_user = JSON.parse(JSON.stringify(response_user[0]));
                
                const userdata = DBResponseJsonVal_user[0];

                console.log("id: ",id)
                console.log("livelocation: ",livelocation)
                const query : string = format(`select id,phone from accidentapp.emergencycontact where userid=?`,[id])
    
                const response : [OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]] =  await mysql.poolQuery(query);
                let DBResponseJsonVal = JSON.parse(JSON.stringify(response[0]));
                
                // const accountSid = 'AC1cb6bd99ae98d60c295e96d5b4fe3ef7';
                // const authToken = '3dbe7ae956fd292419c488a66790d547';
                const client = require('twilio')(accountSid, authToken);

                for(var i=0; i<DBResponseJsonVal.length; i++)
                {
                    const temp = DBResponseJsonVal[i]
                    // send sms on temp.phone and location through livelocation.lat,livelocation.lng
                    // Perform Logic to send the error
                    let newStr = temp.phone.replace(/^./, "");
                    const res = await client.messages
                    .create({
                        body: `Some Issue occured with ${userdata.username}, Their location is http://maps.google.com/maps?q=loc:${livelocation.lat},${livelocation.lng}`,
                        from: '+12543125958',
                        // to: `+92${newStr}`
                        to: `+923245400019`
                    })
                    // .then(message => console.log(message.sid));
                    console.log(res.sid)
                }


                let ResponseInJson : ResponseJSON = {
                    error: false,
                    data : {
                        "msg" : "Alert sent Hold on"
                    }
                }

                
                res(ResponseInJson)

            }
            catch (err)
            {
                const ResponseInJson : ResponseJSON = {
                    error: true,
                    data : {
                        "error" : err
                    }
                }
                
                rej(ResponseInJson)
            }
        });
    }

    
};

export default UserService;