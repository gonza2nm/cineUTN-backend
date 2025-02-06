import bcrypt from 'bcrypt';
const saltRounds = 10;

async function hashPassword(password: string) : Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

async function comparePassword(plainPassword: string, hashPassword: string): Promise<boolean>{
  const isSimilar = await bcrypt.compare(plainPassword, hashPassword);
  return isSimilar;
}

export {comparePassword, hashPassword};