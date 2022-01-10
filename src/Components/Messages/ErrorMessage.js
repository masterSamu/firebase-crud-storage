import React, {useState} from 'react';
import Card from "react-bootstrap/Card";


export default function ErrorMessage(props) {
    const [message, setMessage] = useState(props?.message);

    return (
        <Card style={cardStyle}>
            <Card.Header style={cardHeaderStyle}>
                <Card.Title>Error!</Card.Title>
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
    borderColor: "salmon",
}

const cardHeaderStyle = {
    width: "100%",
    backgroundColor: "#FFF",
}
