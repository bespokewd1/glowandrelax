import clientJson from './client.json';

function getPhoneLinks(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, ''); // keep only 0-9

  // tel: value (E.164‑ish)
  const phoneForTel =
    digits.length === 10 ? `+1${digits}` : `+${digits}`;

  // Display value: (123) 456-7890
  let phoneFormatted = phoneNumber.trim();

  if (digits.length === 10) {
    phoneFormatted = `(${digits.slice(0, 3)}) ${digits.slice(
      3,
      6,
    )}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // Handle 1 + 10 digits, e.g. 17807290978
    const ten = digits.slice(1);
    phoneFormatted = `(${ten.slice(0, 3)}) ${ten.slice(
      3,
      6,
    )}-${ten.slice(6)}`;
  }

  return { phoneForTel, phoneFormatted };
}

const { phoneForTel, phoneFormatted } = getPhoneLinks(clientJson.phone);

const clientData = {
  ...clientJson,
  phoneForTel, // e.g. "+17807290978"
  phoneFormatted, // e.g. "(780) 729-0978"
};

export default clientData;
