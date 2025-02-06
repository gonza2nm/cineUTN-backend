import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { generateQRCode } from '../../utils/qrCodeGenerator';

// Este test verifica que generateQRCode() funcione correctamente y maneje errores correctamente.

// Mockeamos o "burlamos" las librerias para no llamarlas de verdad y solo probar
jest.mock('jsonwebtoken');
jest.mock('qrcode');

describe('generateQRCode', () => { //estos tambien son valores "mockeados"
  const mockBuyId = 123;
  const mockToken = 'mockSignedToken';
  const mockQRCodeUrl = 'mockQRCodeUrl';

  beforeEach(() => {
    jest.clearAllMocks(); // Reseteamos los mocks antes de cada test
  });

  it('should generate a QR code successfully', async () => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken); //simulamos que jwt.sign devuelve mockToken
    (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQRCodeUrl); // lo mismo con mockQRCodeUrl

    const qrCode = await generateQRCode(mockBuyId);

    // verificaciones
    expect(jwt.sign).toHaveBeenCalledWith( // verifica si jwt.sign se llamo con los valores correctos
      { buyId: mockBuyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESINQR }
    );

    expect(QRCode.toDataURL).toHaveBeenCalledWith(mockToken); //verifica que que QRCode.toDataURL() se llamo con el token generado
    expect(qrCode).toBe(mockQRCodeUrl); // verifica que el resultado final es la URL esperada (mockQRCodeUrl).
  });

  it('should throw an error if jwt.sign fails', async () => {
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error('JWT error'); //simulamos un error
    });

    await expect(generateQRCode(mockBuyId)).rejects.toThrow('JWT error'); // verificamos que lanza el mensaje con el error sin intentar generar el qr
  });

  it('should throw an error if QRCode.toDataURL fails', async () => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
    (QRCode.toDataURL as jest.Mock).mockRejectedValue(new Error('QR error')); //simula que jwt.sing funciona correctamente pero que QRCode.toDataURl falla

    await expect(generateQRCode(mockBuyId)).rejects.toThrow('QR error'); // verifica que lanza el error
  });
});
