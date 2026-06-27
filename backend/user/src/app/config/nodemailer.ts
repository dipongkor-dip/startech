import nodemailer from "nodemailer";
import {env} from "../env";

// ১. সার্ভার রান হওয়ার সাথে সাথেই নোডমেইলার কানেকশন পুল ইনিশিয়েট হবে (ফাংশনের বাইরে)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: env.nodemailer.user,
    pass: env.nodemailer.pass,
  },
});

// ২. অপশনাল কিন্তু প্রফেশনাল বেস্ট প্র্যাকটিস: সার্ভার স্টার্ট হওয়ার সময় SMTP কানেকশনটি ভেরিফাই করা
export const connectNotificationServer = async () => {
  return new Promise<void>((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Nodemailer SMTP connection failed:", error.message);
        reject(error);
      } else {
        console.log("📧 Nodemailer SMTP Server connected & ready!");
        resolve();
      }
    });
  });
};

export const sendOTPbyMail = async (email: string, otp: string) => {
  try {
    // ৩. এখন সরাসরি গ্লোবাল ট্রান্সপোর্টার ব্যবহার করে মেইল পাঠানো হবে
    await transporter.sendMail({
      from: env.nodemailer.smtpFrom,
      to: email,
      subject: "StarTech OTP Verification",
      text: `Your StarTech OTP is ${otp}. It expires in 5 minutes.`, // এখানে ৫ মিনিট করে দেওয়া হলো, কারণ HTML-এ ৫ মিনিট লিখেছেন
      html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px;">StarTech Verification</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; color: #333;">
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">Your one-time password (OTP) is:</p>
                <p style="font-size: 28px; font-weight: bold; color: #e74c3c; text-align: center; margin: 20px 0;">
                  ${otp}
                </p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  This code will expire in <b>5 minutes</b>.
                </p>
                <div style="text-align:center; font-size:20px; font-weight:bold; color:#27ae60;">
                  ⏳ 05:00 minutes remaining
                </div>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                  If you did not request this OTP, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                &copy; ${new Date().getFullYear()} StarTech. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
    });

    if (env.nodeEnv === "development") {
      console.log(`✅ OTP sent successfully to ${email}`);
    }
  } catch (err: any) {
    console.error(`❌ Failed to send OTP email to ${email}:`, err.message);
    throw err; // কন্ট্রোলার বা হ্যান্ডলারের কাছে এরর পাস করার জন্য
  }
};
