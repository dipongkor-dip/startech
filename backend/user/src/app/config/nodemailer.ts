import nodemailer from "nodemailer";
import {env} from "../env";

export const sendOTPbyMail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // "74.125.140.108"
    port: 465,
    secure: true,
    auth: {user: env.nodemailer.user, pass: env.nodemailer.pass},
  });

  await transporter.sendMail({
    from: env.nodemailer.smtpFrom,
    to: email,
    subject: "StarTech OTP Verification",
    text: `Your StarTech OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your StarTech OTP is <b>${otp}</b>.</p><p>It expires in 10 minutes.</p>`,
  });
};
