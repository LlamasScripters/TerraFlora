import User from "../modelsSQL/User.js";
import jwt from "jsonwebtoken";
import { isAdminInMongo, blockUserOnSQLAndMongo } from "../services/authService.js";

export const authenticate = async (req, res, next) => {
  const header = req.header("Authorization") ?? req.header("authorization");
  if (!header) {
    return res.status(401);
  }

  const token = header.replace("Bearer ", "");
  if (!token) {
    return res.status(401);
  }
  
  try {
    const decoded = jwt.verify(token, process.env.LOGIN_JWT_KEY);

    if (!decoded) {
      return res.status(401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401);
    }

    if (user.isBlocked) {
      return res.status(401).json({ code: "account_blocked" });
    } else if (!user.isVerified) {
      return res.status(401).json({ code: "account_not_verified" });
    }

    if(user.role === "ROLE_ADMIN") {
      const adminInMongo = await isAdminInMongo(user.id);
      if (adminInMongo) {
        await blockUserOnSQLAndMongo(user.id);
        return res.status(401).json({ code: "account_blocked" });
      } 
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ code: "token_expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ code: "invalid_token" });
    }
    console.error(err);
    return res.status(401);
  }
};

export const authorizeAdmin = (req, res, next) => {
  console.log("Authorizing admin...");

  const user = req.user;
  if (!user) return res.status(401).json({ error: "Access denied." });

  if (user.role !== "ROLE_ADMIN") {
    return res.status(403).json({ error: "Access denied." });
  }

  next();
};

export const authorizeUser = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Access denied." });

  if (req.user.role !== "ROLE_USER") {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};
