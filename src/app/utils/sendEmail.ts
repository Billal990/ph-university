import nodemailer from "nodemailer"
import config from "../config";

export const sendEmail = async(to:string, html:string)=>{

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env==='production',
        auth: {
          user: "billal.webdev@gmail.com",
          pass: "qvhj fzzv uten suvo",
        },
      });




      const info = await transporter.sendMail({
        from: 'billal.webdev@gmail.com', // sender address
        to, // list of receivers
        subject: "Password Reset Link within 10 mins !", // Subject line
        text: "", // plain text body
        html, // html body
      });



}