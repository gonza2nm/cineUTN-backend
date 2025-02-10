import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import { authMiddleware } from "../../utils/authMiddleware";

// Mockea la librería 'jsonwebtoken'
jest.mock('jsonwebtoken');

// Configura las constantes necesarias
const app = express();
app.use(express.json());
app.use(cookieParser()); // Añadir middleware para parsear cookies

// Configura el enrutador de prueba
const mockRouter = express.Router();

mockRouter.get("/", authMiddleware(["manager"]), (req, res) => {
  res.status(200).json([{ id: 1, name: "Admin test" }, { id: 2, name: "User test" }]);
});
app.use("/users", mockRouter);

// Mockea las funciones de 'jsonwebtoken'
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn()
}));

describe("GET /users test middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe rechazar la peticion si no hay token", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token provided' });
  });

  it("Debe rechazar la peticion si el token es invalido", async () => {
    const res = await request(app).get("/users").set("Cookie", "authToken=InvalidToken");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", 'Invalid or expired token');
  });

  it("Debe rechazar la peticion si el usuario no tiene el rol de manager", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      return { id: 1, role: "user" }; // Simula un usuario con rol de user
    });
    const res = await request(app).get("/users").set("Cookie", `authToken=ValidTokenButNotAuthorization`);
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: 'Forbidden: Insufficient permissions' });
  });

  it("Debe permitir el acceso si el usuario tiene el rol de manager", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      return { id: 1, role: "manager" }; // Simula un usuario con rol de manager
    });
    const res = await request(app).get("/users").set("Cookie", `authToken=ValidTokenAndAuthorized`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Admin test" }, { id: 2, name: "User test" }]);
  });
});