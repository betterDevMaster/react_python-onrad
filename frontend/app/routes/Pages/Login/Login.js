import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Form, FormGroup, FormText, Input, CustomInput, Button, Label, EmptyLayout, ThemeConsumer } from "./../../../components";

import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";

import User from "../../../model/User";
import Translate from "../../../utils/translate";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        const ret = await User.login({ user: username, password: password });

        if (ret.error === 0) {
            localStorage.setItem("username", username);
            localStorage.setItem("sessionToken", ret.sessionToken);
            window.location.href = "/apps/users/list";
            // window.location.href = '/forms/input-groups'
        } else alert(Translate.convert("Login failed"));
    };

    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                {/* START Header */}
                <HeaderAuth title={Translate.convert("Sign in to Application")} />
                {/* END Header */}
                {/* START Form */}
                <Form className="mb-3">
                    <FormGroup>
                        <Label for="emailAdress">{Translate.convert("User ID")}</Label>
                        {/* <Input
                            type="email"
                            name="email"
                            id="emailAdress"
                            placeholder={Translate.convert('Enter user id...')}
                            className="bg-white"
                            onChange={(e) => setUsername(e.target.value)}
                        /> */}
                        <Input
                            type="text"
                            name="email"
                            id="emailAdress"
                            placeholder={Translate.convert("Enter user id...")}
                            className="bg-white"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FormText color="muted"></FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">{Translate.convert("Password")}</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password..."
                            className="bg-white"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <CustomInput type="checkbox" id="rememberPassword" label={Translate.convert("Remember Password")} inline />
                    </FormGroup>
                    <ThemeConsumer>
                        {({ color }) => (
                            // <Button color={ color } block tag={ Link } to="/">
                            <Button color={color} onClick={login}>
                                {Translate.convert("Sign In")}
                            </Button>
                        )}
                    </ThemeConsumer>
                </Form>
                {/* END Form */}
                {/* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/forgot-password" className="text-decoration-none">
                        {Translate.convert("Forgot Password")}
                    </Link>
                    <Link to="/pages/register" className="ml-auto text-decoration-none">
                        {Translate.convert("Register")}
                    </Link>
                </div>
                {/* END Bottom Links */}
                {/* START Footer */}
                <FooterAuth />
                {/* END Footer */}
            </EmptyLayout.Section>
        </EmptyLayout>
    );
}
