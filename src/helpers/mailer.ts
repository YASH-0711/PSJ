/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hasedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
        console.log(User,"@@@@ USER")
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hasedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "15cd1ff67e814b",
        pass: "3477a00dd1086f",
      },
    });

    const mailOption = {
        from: 'yashyr1999@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hasedToken}">here</a>
         to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"}
         or copy and paste the link below <br> ${process.env.domain}/verifyemail?token=${hasedToken} </p>`
    };

    const mailResponse = await transport.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
