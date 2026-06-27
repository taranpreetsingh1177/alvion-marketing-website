import {
  getFromAddress,
  getInboxAddress,
  getMailTransporter,
} from "./smtp";
import {
  buildCustomerAutoReplyEmail,
  buildTeamNotificationEmail,
} from "./templates";

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmails(submission: ContactSubmission) {
  const transporter = getMailTransporter();
  const from = getFromAddress();
  const inbox = getInboxAddress();

  const teamEmail = buildTeamNotificationEmail(submission);
  const customerEmail = buildCustomerAutoReplyEmail(submission);

  await transporter.sendMail({
    from,
    to: inbox,
    replyTo: submission.email,
    subject: teamEmail.subject,
    text: teamEmail.text,
    html: teamEmail.html,
  });

  await transporter.sendMail({
    from,
    to: submission.email,
    replyTo: inbox,
    subject: customerEmail.subject,
    text: customerEmail.text,
    html: customerEmail.html,
  });
}
