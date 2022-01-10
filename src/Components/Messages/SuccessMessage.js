import React, {useState, useEffect} from 'react';
import Card from "react-bootstrap/Card";

export default function SuccessMessage(props) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage(props.message);
    }, [])

    return (
        <Card style={cardStyle}>
            <Card.Header style={cardHeaderStyle}>
                <Card.Title>Success!</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {message}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

const cardStyle = {
    width: "80%",
    marginBottom: 15,
    marginTop: 15,
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#FFF",
    borderWidth: 3,
    borderColor: "lightgreen",
}

const cardHeaderStyle = {
    width: "100%",
    backgroundColor: "#FFF",
}

