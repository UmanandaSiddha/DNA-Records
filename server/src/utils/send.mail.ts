import sgMail, { MailDataRequired } from "@sendgrid/mail";

interface EmailOptions {
    templateId: string;
    recieverEmail: string;
    dynamicData: Record<string, any>;
}

interface EmailTemplateMapping {
    emailTemplate: string;
    templateId: string;
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    try {
        const { templateId, recieverEmail, dynamicData } = options;

        const mail: MailDataRequired = {
            from: {
                name: process.env.ORGANIZATION_NAME as string,
                email: process.env.ORGANIZATION_EMAIL as string,
            },
            personalizations: [
                {
                    to: [{ email: recieverEmail }],
                    dynamicTemplateData: dynamicData
                }
            ],
            templateId: templateId,
        };

        await sgMail.send(mail);
        console.log(`Email sent successfully to ${recieverEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendMail;