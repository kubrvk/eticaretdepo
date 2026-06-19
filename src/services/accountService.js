const ACCOUNTS_KEY = "dealer-accounts";
const ADMIN_EMAILS = ["admin@deposhop.com", "admin@eticaretdepo.com"];

const isBrowser = typeof window !== "undefined";

const readAccounts = () => {
  if (!isBrowser) {
    return [];
  }
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeAccounts = (accounts) => {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const getRoleFromEmail = (email) => (ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "dealer");

export const registerLocalAccount = ({ email, fullName, companyName, password }) => {
  const accounts = readAccounts();
  const existing = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    throw new Error("ACCOUNT_EXISTS");
  }

  const role = getRoleFromEmail(email);
  const account = {
    id: `acc-${Date.now()}`,
    email,
    fullName,
    companyName: companyName || fullName,
    password,
    role,
    approved: role === "admin" ? true : true,
  };

  writeAccounts([...accounts, account]);
  return account;
};

export const loginLocalAccount = ({ email, password }) => {
  const accounts = readAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!account || account.password !== password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return account;
};

export const findLocalAccountByEmail = (email) => {
  const accounts = readAccounts();
  return accounts.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
};
