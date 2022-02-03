import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";

async function getMenuItemsFromDb(userId) {
  const q = query(collection(db, "MenuItems"), where("userId", "==", userId));
  let menuItems = null;
  await getDocs(q)
    .then((data) => {
      menuItems = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    })
    .catch((error) => {
      menuItems = false;
    });
  return menuItems;
}

function deleteItemFromDb(id) {
  const itemDoc = doc(db, "MenuItems", id);
  const del = deleteDoc(itemDoc);
}


export { getMenuItemsFromDb, deleteItemFromDb };
