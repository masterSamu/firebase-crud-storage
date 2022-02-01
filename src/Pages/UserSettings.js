import React from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import PageNav from '../Components/Navbar/PageNav';
import ChangePasswordForm from '../Components/UserHandeling/ChangePasswordForm';
import ChangeEmailForm from '../Components/UserHandeling/ChangeEmailForm';

export default function UserSettings() {
  return (
    <Container className="container-page">
        <Row>
            <PageNav title="User Settings" url="/usersettings" />
        </Row>
        <Row>
            <Tabs defaultActiveKey="Password" className="mb-3">
                <Tab eventKey="Password" title="Password">
                    <ChangePasswordForm />
                </Tab>
                <Tab eventKey="Email" title="Email">
                    <ChangeEmailForm />
                </Tab>
            </Tabs>
        </Row>
    </Container>
  );
}
