import express from "express";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import fb from "../firebase.js";
import { doc, updateDoc } from "firebase/firestore";

const routes = express.Router();

routes.post("/login", async (req, res) => {
  signInWithEmailAndPassword(fb.auth, req.body.email, req.body.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await updateDoc(doc(fb.db, "users", user.uid), {
        apikey: await user.getIdToken(),
      });
      res.status(200).send({ apikey: await user.getIdToken(), id: user.uid });
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
});

routes.get("/password_reset", async (req, res) => {
  sendPasswordResetEmail(fb.auth, req.query.email)
    .then(async () => {
      res.status(200).send({ message: "Enviado Correctamente" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

routes.get("/logout", async (req, res) => {
  await updateDoc(doc(fb.db, "users", req.query.id), { apikey: "" })
    .then(async () => {
      res.status(200).send({ message: "Ok" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

export default routes;
