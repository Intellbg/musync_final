import express from "express";
import { checkSchema, validationResult } from "express-validator";
import fb from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import checkFirebaseToken from "../middleware/firebase.js";
const routes = express.Router();
routes.get("/", checkFirebaseToken, async (req, res) => {
    return res.status(200).json(res.locals["user"]);
});

routes.post(
  "/",
  checkSchema({
    email: {
      in: ["body"],
      errorMessage: "Es requerido",
      isEmail: {
        errorMessage: "Formato Incorrecto",
      },
      trim: true,
    },
    username: {
      in: ["body"],
      errorMessage: "Es requerido",
      isLength: {
        errorMessage: "Usuario debe tener al menos 3 caracteres",
        options: { min: 5 },
      },
      trim: true,
    },
    password: {
      in: ["body"],
      errorMessage: "Es requerido",
      isLength: {
        errorMessage: "Debe tener al menos 8 caracteres, ",
        options: { min: 8 },
      },
      matches: {
        options: [/(?=.*[A-Z])/],
        errorMessage: "Debe tener una mayúscula",
      },
      matches: {
        options: [/(?=.*[!@#$%^&*])/],
        errorMessage: "Debe tener un carácter especial",
      },
    },
    confirmPassword: {
      in: ["body"],
      exists: {
        errorMessage: "Es requerido",
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("La contraseña no coincide");
          }
          return true;
        },
      },
    },
    birthday: {
      in: ["body"],
      exists: {
        errorMessage: "Es requerido",
      },
      isISO8601: {
        errorMessage: "Debe ser una fecha válida",
      },
      custom: {
        options: (value) => {
          const birthdayDate = new Date(value);
          const currentDate = new Date();
          const ageDifference = currentDate - birthdayDate;
          const ageDate = new Date(ageDifference);
          const year = ageDate.getUTCFullYear();
          const age = Math.abs(year - 1970);
          if (age < 16) {
            throw new Error("Debe tener al menos 16 años");
          }
          return true;
        },
      },
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const userRecord = await createUserWithEmailAndPassword(
        fb.auth,
        req.body.email,
        req.body.password
      ).then((res) => {
        updateProfile(res.user, { displayName: req.body.username });
        return res.user;
      });
      await setDoc(doc(fb.db, "users", userRecord.uid), {
        username: req.body.username,
        birthday: req.body.birthday,
        gender: req.body.gender ?? "",
      });
      res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

export default routes;
