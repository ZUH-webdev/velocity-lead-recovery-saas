/**
 * Simple validators used across the app
 */
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
const PHONE_REGEX = /^[0-9+()\-\s]{7,20}$/;

function isEmailValid(email: string) {
  if (!email) return false;
  return EMAIL_REGEX.test(email);
}

function isPhoneValid(phone: string) {
  if (!phone) return false;
  return PHONE_REGEX.test(phone);
}

export { isPhoneValid, isEmailValid };
