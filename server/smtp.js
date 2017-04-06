Meteor.startup(function () {
	process.env.MAIL_URL = 'smtp://skyroomsio:@andy123@smtp.sendgrid.net:587';
});

if (Meteor.isServer) {
	// Email.send({
		// from: "noreply@skyrooms.io",
		// to: "andrewnormore@gmail.com",
		// subject: "Subject",
		// text: "Here is some text"
	// });
}