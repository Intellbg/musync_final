import express from "express";
import multer from "multer";
import fb from "../firebase.js";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import checkFirebaseToken from "../middleware/firebase.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const routes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

routes.get("/", checkFirebaseToken, async (req, res) => {
  try {
    const q = query(
      collection(fb.db, "playlists"),
      where("owner", "==", req.query.id)
    );
    const querySnapshot = await getDocs(q);
    var result = [];
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json([]);
  }
});

routes.get("/:id", checkFirebaseToken, async (req, res) => {
  const querySnapshot = await getDoc(doc(fb.db, "playlists", req.params.id));
  const playlist = querySnapshot.data();
  if (playlist.owner !== req.query.id) {
    return res.status(400).json({ message: "No autorizado" });
  }
  return res.status(200).json({ id: doc.id, ...playlist });
});

routes.post(
  "/",
  checkFirebaseToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "music", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const playlistName = req.body.name;
      const owner = req.query.id;
      const coverImage = req.files["cover"][0];
      const mp3Files = req.files["music"];

      if (!playlistName || !coverImage || !mp3Files) {
        return res.status(400).send("Missing necessary fields.");
      }

      const coverPath = `cover/${owner}/${playlistName}.${
        coverImage.mimetype.split("/")[1]
      }`;
      const coverRef = ref(fb.storage, coverPath);
      uploadBytes(coverRef, coverImage.buffer).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      var mp3paths = [];

      for (let file of mp3Files) {
        const mp3Path = `playlists/${owner}/${playlistName}/${file.originalname}`;
        const mp3Ref = ref(fb.storage, mp3Path);
        await uploadBytes(mp3Ref, file.buffer).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
        mp3paths.push(await getDownloadURL(mp3Ref));
      }
      let date = new Date().toJSON();
      const playlist = {
        owner: owner,
        name: playlistName,
        coverImage: await getDownloadURL(coverRef),
        mp3Files: mp3paths,
        created: date.split("T")[0],
      };
      await addDoc(collection(fb.db, "playlists"), playlist);

      res.status(201).send({ message: "Guardada" });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send("Internal Server Error.");
    }
  }
);

routes.patch(
  "/:id",
  checkFirebaseToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "music", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const localRef = doc(fb.db, "playlists", req.params.id);
      const playlistD = await getDoc(localRef);
      const musicUrls = req.body.music_urls.split(";");
      const mp3Files = req.files["music"];
      const owner = req.query.id;
      const playlistName = req.body.name ?? playlistD.getDoc().name;
      if (playlistD.data().owner !== req.query.id) {
        return res.status(400).json({ message: "No autorizado" });
      }

      if (req.body.name) {
        await updateDoc(localRef, {
          name: req.body.name,
        });
      }

      if (req.files["cover"]) {
        const coverImage = req.files["cover"][0];
        const coverPath = `cover/${owner}/${playlistName}.${
          coverImage.mimetype.split("/")[1]
        }`;
        const coverRef = ref(fb.storage, coverPath);
        uploadBytes(coverRef, coverImage.buffer).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
        await updateDoc(localRef, {
          coverImage: await getDownloadURL(coverRef),
        });
      }

      if (mp3Files) {
        for (let file of mp3Files) {
          const mp3Path = `playlists/${owner}/${playlistName}/${file.originalname}`;
          const mp3Ref = ref(fb.storage, mp3Path);
          await uploadBytes(mp3Ref, file.buffer).then((snapshot) => {
            console.log("Uploaded a blob or file!");
          });
          musicUrls.push(await getDownloadURL(mp3Ref));
        }
        await updateDoc(localRef, {
          mp3Files: musicUrls,
        });
      }

      res.status(200).send("Actualizada");
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send("Internal Server Error.");
    }
  }
);

routes.delete("/:id", checkFirebaseToken, async (req, res) => {
  const ref = doc(fb.db, "playlists", req.params.id);
  const playlist = await getDoc(ref);
  if (playlist.data().owner !== req.query.id) {
    return res.status(400).json({ message: "No autorizado" });
  }
  await deleteDoc(ref);
  return res.status(200).json({ message: "Borrado" });
});

export default routes;
