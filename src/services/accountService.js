const ACCOUNTS_KEY = "dealer-accounts";
const DEFAULT_ADMIN = {
  id: "acc-admin-001",
  email: "admin@eticaretdepo.com",
  fullName: "Sistem Yöneticisi",
  companyName: "ETicaretDepo Merkez",
  password: "admin1234",
  phone: "02120000000",
  city: "İstanbul",
  address: "İkitelli OSB, Başakşehir / İstanbul",
  role: "admin",
  approved: true,
};
const LEGACY_ADMIN_EMAILS = ["admin@deposhop.com", "admin@eticaretdepo.com"];
const ADMIN_EMAILS = ["admin@eticaretdepo.com"];

const isBrowser = typeof window !== "undefined";

const safeRead = () => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const safeWrite = (accounts) => {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const ensureSeedAccounts = () => {
  const accounts = safeRead();
  const cleaned = accounts.filter(
    (item) => !LEGACY_ADMIN_EMAILS.includes(String(item.email || "").toLowerCase()) && item.id !== DEFAULT_ADMIN.id
  );
  safeWrite([DEFAULT_ADMIN, ...cleaned]);
};

export const readAccounts = () => {
  ensureSeedAccounts();
  return safeRead();
};

export const getRoleFromEmail = (email) => (ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "dealer");

export const registerLocalAccount = ({ email, fullName, companyName, password }) => {
  ensureSeedAccounts();
  const accounts = safeRead();
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
    phone: "",
    city: "",
    address: "",
    role,
    approved: true,
  };

  safeWrite([...accounts, account]);
  return account;
};

export const loginLocalAccount = ({ email, password }) => {
  ensureSeedAccounts();
  const accounts = safeRead();
  const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!account || account.password !== password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return account;
};

export const findLocalAccountByEmail = (email) => {
  ensureSeedAccounts();
  const accounts = safeRead();
  return accounts.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
};

export const updateLocalAccount = (email, patch) => {
  ensureSeedAccounts();
  const accounts = safeRead();
  const current = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!current) {
    throw new Error("ACCOUNT_NOT_FOUND");
  }
  const next = { ...current, ...patch };
  safeWrite([...accounts.filter((item) => item.email.toLowerCase() !== email.toLowerCase()), next]);
  return next;
};

export const getDefaultAdminCredentials = () => ({
  email: DEFAULT_ADMIN.email,
  password: DEFAULT_ADMIN.password,
});
