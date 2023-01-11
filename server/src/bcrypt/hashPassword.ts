import bcrypt from "bcrypt";

export async function hashPassword(password: string, saltRounds: number = 10) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}
