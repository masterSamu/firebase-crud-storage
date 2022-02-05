import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

export default function useGetMenuItems(userId) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [succesfull, setSuccessfull] = useState(null);
  const [imageUrl, setImageURL] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "MenuItems"), where("userId", "==", userId));
    console.log("getting data");
    getDocs(q)
      .then((data) => {
        setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
    setLoading(false);
  }, [userId]);

  const addItem = async (item) => {
    if (item.imageFile) {
      uploadImageToStorage(item.imageFileName);
    }
    
    const documentAdded = await addItemToFirestore(item);
    if (documentAdded) {
      setSuccessfull("Item uploaded succesfully!");
      setError(null);
    }
  };

  const uploadImageToStorage = (fileName) => {
    const storageRef = ref(storage, "MenuItems/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError(true);
        setErrorMessage(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
        });
      }
    );
  };

  const addItemToFirestore = async (item) => {
    let added = false;
    const docRef = await addDoc(collection(db, "MenuItems"), item)
      .then((docRef) => {
        item.id = docRef.id;
        setData((prevState) => [...prevState, item]);
        added = true;
      })
      .catch((error) => {});
    return added;
  };

  const deleteItem = async (itemId, imageFileName) => {
    if (imageFileName === null) {
      const docDeleted = deleteDocFromFirestore(itemId);
      if (docDeleted) {
        const newData = data.filter((item) => item.id !== itemId);
        setData(newData);
        setSuccessfull("Item succesfully deleted!");
        setError(null);
      }
    } else {
      const deleted = deleteObjectFromStorage(imageFileName);
      if (deleted) {
        const docDeleted = deleteDocFromFirestore(itemId);
        if (docDeleted) {
          const newData = data.filter((item) => item.id !== itemId);
          setData(newData);
          setSuccessfull("Item succesfully deleted!");
          setError(null);
        }
      } else {
        setSuccessfull(null);
        setError("Could not delete image file from storage.");
      }
    }
  };

  const deleteDocFromFirestore = async (itemId) => {
    let deleted = false;
    const itemDoc = doc(db, "MenuItems", itemId);
    await deleteDoc(itemDoc)
      .then(() => {
        deleted = true;
      })
      .catch((error) => {});
    return deleted;
  };

  const deleteObjectFromStorage = async (imageFileName) => {
    let deleted = false;
    const fileRef = ref(storage, "MenuItems/" + imageFileName);
    await deleteObject(fileRef)
      .then(() => {
        deleted = true;
      })
      .catch((error) => {});
    return deleted;
  };

  return { data, setData, error, loading, deleteItem, addItem };
}
