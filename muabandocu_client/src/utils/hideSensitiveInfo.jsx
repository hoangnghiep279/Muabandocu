export const hideSensitiveInfo = (data, type) => {
  if (!data) return "";

  if (type === "email") {
    const [username, domain] = data.split("@");
    const maskedUsername =
      username.slice(0, 2) + "*".repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  }

  if (type === "phone") {
    const visibleDigits = 2;
    const maskedPart = "*".repeat(data.length - visibleDigits);
    return maskedPart + data.slice(-visibleDigits);
  }

  return data;
};
