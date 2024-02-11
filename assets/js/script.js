const processForm = (form, message, formName) => {
	const data = new FormData(form);
	data.append("form-name", formName);
	fetch("/", {
		method: "POST",
		body: data,
	})
		.then(() => {
			form.innerHTML = `<div class="confirmation"><p>${message}</p></div>`;
		})
		.catch((error) => {
			form.innerHTML = `<div class="form--error">Something went wrong, please email us at <a href="mailto:inquiries@bravery.co">inquiries@bravery.co</a> Error: ${error}</div>`;
		});
};

const validateEmail = (email) => {
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
};

// Contact form
const contactForm = document.querySelector("#braverygov-contact");
if (contactForm) {
	let emailField = contactForm.querySelector('input[type="email"]');
	emailField.addEventListener("blur", (e) => {
		let emailVal = emailField.value;

		if (validateEmail(emailVal)) {
			contactForm.classList.remove("error");
		} else {
			contactForm.classList.add("error");
		}
	});
	contactForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let formName = "contact";
		let message = `Thanks for your inquiry. We'll reply to you shortly.`;
		processForm(contactForm, message, formName);
	});
}
