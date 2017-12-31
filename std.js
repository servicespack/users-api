const blockedFields = {
	private: 0,
	username: 0,
	password: 0
}

const calcAge = (birthday, now) => {
	var age = now.getYear - birthday.getYear
	if (now.getMonth >= birthday.getMonth && now.getDate >= birthday.getDate)	age++
	return age
}

module.exports = {
	calcAge,
	blockedFields
}