import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PWD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOptions) {
  let sendedEmail;
  try {
    sendedEmail = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error while sending mail: ", error);
  }

  return sendedEmail;
}

const email = {
  send,
};

export default email;
