const calcAge = (birth, now) => {
	var age = now.getYear - birth.getYear
	if (now.getMonth >= birth.getMonth && now.getDate >= birth.getDate)	age++
	return age
}

module.exports = {
	calcAge
}