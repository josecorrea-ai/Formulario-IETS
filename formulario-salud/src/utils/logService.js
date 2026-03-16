import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const guardarLog = async (admin, accion, objetivo = "") => {

  try {

    await addDoc(collection(db, "logs"), {

      admin: admin,      
      accion: accion,  
      objetivo: objetivo,
      fecha: serverTimestamp()

    });

  } catch (error) {

    console.error("Error guardando log:", error);

  }

};