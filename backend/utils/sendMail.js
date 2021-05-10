import nodemailer from 'nodemailer';

const sendMail = async (email, subject, message) => {
	try {
		let testAccount = await nodemailer.createTestAccount();

		let transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_POST,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER, // generated ethereal user
				pass: process.env.SMTP_PASSWORD, // generated ethereal password
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: `"Insta Clone" <${process.env.FROM_EMAIL}>`, // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			html: message, // html body
		});

		console.log('Message sent: %s', info.messageId);
	} catch (error) {
		console.log(error.message);
	}
};

export default sendMail;
