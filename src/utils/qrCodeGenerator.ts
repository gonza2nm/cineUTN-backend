import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';


export async function generateQRCode(buyId: number): Promise<string> {
  try {
    // Genero el token JWT firmado
    const buyDataQR = { buyId };

    const signedToken = jwt.sign(
      buyDataQR,
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRESINQR }
    );

    // Creo el codigo QR con el token firmado
    const qrCodeUrl = await QRCode.toDataURL(signedToken);

    return qrCodeUrl;
  } catch (error: any) {
    console.error(`Error generating QR code for buyId ${buyId}:`, error.message);
    throw error;
  }
}
