export default function FormatPhone(phoneNumber) {
  const phone1 = phoneNumber.slice(0, 3);
  const phone2 = phoneNumber.slice(3, 7);
  const phone3 = phoneNumber.slice(7);
  return `${phone1}-${phone2}-${phone3}`;
}
