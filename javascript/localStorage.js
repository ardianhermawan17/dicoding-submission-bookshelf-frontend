export default function handleLocalStorage(keyname, defaultValue) {
	let STORED_VALUE = null;
	let KEYNAME = keyname;

	const setInitialValue = () => {
		try {
			const value = window.localStorage.getItem(KEYNAME);
			if (value) {
				STORED_VALUE = JSON.parse(value);
			} else {
				window.localStorage.setItem(KEYNAME, JSON.stringify(defaultValue));
				STORED_VALUE = defaultValue;
			}
		} catch (e) {
			console.error(e);
			STORED_VALUE = defaultValue;
		}
	};
	setInitialValue();

	const setValue = (newValue) => {
		try {
			window.localStorage.setItem(KEYNAME, JSON.stringify(newValue));
		} catch (err) {
			console.error(err);
		}
		STORED_VALUE = newValue;
		return STORED_VALUE;
	};

	return [STORED_VALUE, setValue];
}
