import bcrypt from 'bcrypt';
import { hashPassword, comparePassword } from '../../utils/hashFunctions';


jest.mock('bcrypt');

describe('Password Utilities', () => {
  const plainPassword = 'mysecretpassword';
  const hashedPassword = 'hashedpassword';
  const salt = 'randomSalt';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Debería hashear la contraseña correctamente', async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt); //Simula que genera la salt.
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); //Simula que devuelve la contraseña encriptada.

    const result = await hashPassword(plainPassword);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, salt);
    expect(result).toBe(hashedPassword);
  });

  it('Debería comparar la contraseña correctamente', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); //Simula que la funcion devolvió true.

    const result = await comparePassword(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it('Debería devolver falso si las contraseñas no coinciden', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); //Simula que la funcion devolvió false.

    const result = await comparePassword(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(false);
  });
});


