function _formatTime(item) {
	return item >= 10 ? item : "0" + item
}
export function getLocalDate(dateArg, type = "date") {
 let date = "";
 if (!dateArg) {
  date = new Date();
 } else {
  date = dateArg;
 }
 const year = date.getFullYear();
 const month = date.getMonth() + 1;
 const day = date.getDate();
 const hour = date.getHours();
 const minute = date.getMinutes();
 if (type !== "date") {
  return (
   [year, month, day]
   .map(_formatTime)
   .join("-") +
   " " + [hour, minute].map(_formatTime).join(":")
  );
 } else {
  return [year, month, day]
   .map(_formatTime)
   .join("-");
 }
}
export function formatTime(chatDate) {
	const currentDate = new Date()

	const currentYear = currentDate.getFullYear()
	const currentMonth = currentDate.getMonth() + 1
	const currentDay = currentDate.getDate()
	const currentHour = currentDate.getHours()
	const currentMinute = currentDate.getMinutes()

	chatDate = new Date(chatDate)
	const chatYear = chatDate.getFullYear()
	const chatMonth = chatDate.getMonth() + 1
	const chatDay = chatDate.getDate()
	const chatHour = chatDate.getHours()
	const chatMinute = chatDate.getMinutes()

	const formatTime = [chatHour, chatMinute].map(_formatTime).join(":")

	if (chatYear === currentYear) {

		if (chatMonth === currentMonth) {
			const delta = Math.abs(currentDay - chatDay)

			if (delta === 2) {
				return '前天' + formatTime
			}

			if (delta === 1) {
				return '昨天' + formatTime
			}

			if (delta === 0) {
				return formatTime
			}
		}

		return [chatMonth, chatDay].map(_formatTime)
			.join("-") +
			" " + formatTime
	}

	return [chatYear, chatMonth, chatDay]
		.map(_formatTime)
		.join("-") +
		" " + formatTime
}
