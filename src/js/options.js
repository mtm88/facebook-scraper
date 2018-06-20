function constructOptions() {
	// const recordsCountInputValue = document.getElementById("recordsToPull");
	const optionsApplyButton = document.getElementById("applyButton");
	optionsApplyButton.onmouseover = () => optionsApplyButton.style.cursor = "pointer";

	optionsApplyButton.addEventListener("click", () => {
		return Promise.all([
			// updateRecordsToPull(),
			updateLoginPassword(),
		]).then(() => alert("Settings Updated!"))
			.catch(error => alert(error));
	});

	// chrome.storage.local.get(["recordsToPull"], (results) => {
	// 	if (!Object.keys(results).length) {
	// 		chrome.storage.local.set({ recordsToPull: 50 });
	// 	} else {
	// 		recordsCountInputValue.value = results.recordsToPull;
	// 	}
	// });

	chrome.storage.sync.get(["userLogin", "userPassword"], ({ userLogin, userPassword }) => {
		if (userLogin) {
			const userLoginInput = document.getElementById("userLogin");
			userLoginInput.value = userLogin;
		}

		if (userPassword) {
			const userPasswordInput = document.getElementById("userPassword");
			userPasswordInput.value = userPassword;
		}
	});
}

constructOptions();

// uncomment to enable setting the amount of records to pull in options
// function updateRecordsToPull() {
// 	const recordsCountInputValue = document.getElementById("recordsToPullCount");
// 	const updatedValue = recordsCountInputValue.value;
// 	const valueIsNumber = !isNaN(updatedValue);

// 	if (valueIsNumber) {
// 		return chrome.storage.local.set({
// 			recordsToPullCount: updatedValue,
// 		});
// 	}

// 	return Promise.reject("Incorrect field value");
// }

function updateLoginPassword() {
	const userInput = document.getElementById("userLogin");
	const userPassword = document.getElementById("userPassword");

	if (userLogin && userLogin.value && userPassword && userPassword.value) {
		return chrome.storage.sync.set({
			userLogin: userInput.value,
			userPassword: userPassword.value,
			token: null,
			isAuthed: false,
		});
	} else {
		return Promise.reject("Username or Password are missing");
	}
}
