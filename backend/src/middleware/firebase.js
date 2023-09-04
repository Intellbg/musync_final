import fb from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

async function checkFirebaseToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    const id = req.query.id;
    if (!authorization || !id) {
      return res.status(401).send("Requiere autorización");
    }
    const ref = doc(fb.db, "users", id);
    const query = await getDoc(ref);
    const user = query.data();
    const serverKey = user.apikey;
    if (serverKey !== authorization) {
      return res.status(401).send("No autorizado");
    }
    delete user.apikey;
    res.locals["user"] = user;
    next();
  } catch (e) {
    console.log(e);
  }
}

export default checkFirebaseToken;
