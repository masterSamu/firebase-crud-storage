import { storage } from "../firebase-config";
import {
  ref,
  deleteObject,
} from "firebase/storage";

async function deleteFileFromStorage(path) {
  const fileRef = ref(storage, path);
  let deleted = false;
  await deleteObject(fileRef)
    .then(() => {
      deleted = true;
    })
    .catch((error) => {});
  return deleted;
}

export { deleteFileFromStorage };
