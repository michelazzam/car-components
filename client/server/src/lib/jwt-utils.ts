import JWT from "jsonwebtoken";
import { JwtPayload } from "../modules/user/user.types.js";

const JWT_SECRET = String(process.env.JWT_SECRET);
const JWT_EXPIRATION_TIME = "365d";

export function generateJwtToken({ userId }: { userId: string }) {
  return JWT.sign(
    {
      userId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION_TIME }
  );
}

export function verifyJwtToken(token: string): JwtPayload | null {
  return JWT.verify(token, JWT_SECRET) as JwtPayload;
}
