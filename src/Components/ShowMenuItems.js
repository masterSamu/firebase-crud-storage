import React, {useState, useEffect} from 'react';
import { db } from "../firebase-config";
import { collection, getDocs, doc } from "firebase/firestore";

import Container from "react-bootstrap/Container"


export default function ShowMenuItems() {
    const [menuItems, setMenuItems] = useState([]);


    const getMenuItemsFromDb = async () => {
        const data = await getDocs(collection(db, "MenuItems"));
        setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log("loaded")
    }

    /*
    useEffect(() => {
        getMenuItemsFromDb();
    }, [menuItems])
    */
   
    return (
        <Container>
            <button onClick={getMenuItemsFromDb}>Read</button>
            {menuItems.map((item) => {
                return (
                <p key={item.id}>{item.id + " => " + item.name}</p>
                )
            })}
        </Container>
    )
}
