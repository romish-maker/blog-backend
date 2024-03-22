import nodemailer from 'nodemailer'
import {MailOptions} from 'nodemailer/lib/sendmail-transport'
import { AppSettings } from "../../../app/appSettings";

export const emailService = {
    async sendEmail(emailTemplate: MailOptions) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: AppSettings.SEND_MAIL_SERVICE_EMAIL,
                pass: AppSettings.SEND_MAIL_SERVICE_PASSWORD,
            }
        })
        return await transporter.sendMail(emailTemplate)
    }
}