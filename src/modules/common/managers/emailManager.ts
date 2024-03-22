import {mailTemplatesService} from "../services/mainTemplateServices";
import {emailService} from "../services/EmailServices";

export const emailManager = {
    async sendRegistrationEmail(email: string, confirmationCode: string) {
        const emailTemplate = mailTemplatesService.getRegistrationMailTemplate(email, confirmationCode)

        return await emailService.sendEmail(emailTemplate)
    },
    async resendRegistrationEmail(email: string, confirmationCode: string) {
        const emailTemplate = mailTemplatesService.getResendRegistrationMailTemplate(email, confirmationCode)

        return await emailService.sendEmail(emailTemplate)
    },
}
