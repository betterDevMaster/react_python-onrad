import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Form, FormGroup, FormText, Input, CustomInput, Button, Label, EmptyLayout, ThemeConsumer } from "./../../../components";

import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";

import User from "../../../model/User";
import Translate from "../../../utils/translate";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const register = async (e) => {
        if (password !== confirmpassword) {
            alert("password does not match.");
            return;
        }

        const ret = await User.register({ user: username, password: password, email: email });
        if (ret.error === 0) {
            alert("register successed");
        } else alert("register failed");
    };

    return (
        <EmptyLayout>
            <EmptyLayout.Section center width={480}>
                {/* START Header */}
                <HeaderAuth title={Translate.convert("Create Account")} />
                {/* END Header */}
                {/* START Form */}
                <Form className="mb-3">
                    <FormGroup>
                        <Label for="username">{Translate.convert("User ID")}</Label>
                        <Input
                            type="text"
                            name="text"
                            id="username"
                            placeholder={Translate.convert("Enter user ID...")}
                            className="bg-white"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">{Translate.convert("Password")}</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder={Translate.convert("Password")}
                            className="bg-white"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="repeatPassword">{Translate.convert("Password Confirm")}</Label>
                        <Input
                            type="password"
                            name="password"
                            id="repeatPassword"
                            placeholder={Translate.convert("Password")}
                            className="bg-white"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="emailAdress">{Translate.convert("Email")}</Label>
                        <Input
                            type="email"
                            name="email"
                            id="emailAdress"
                            placeholder="username@example.com"
                            className="bg-white"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormText color="muted">{Translate.convert("We will never share your email with anyone else.")} </FormText>
                    </FormGroup>
                    <FormGroup>
                        <CustomInput type="checkbox" id="acceptTerms" label={Translate.convert("Accept Terms and Privacy Policy")} inline />
                    </FormGroup>
                    <ThemeConsumer>
                        {({ color }) => (
                            // <Button color={ color } block tag={ Link } to="/">
                            <Button color={color} onClick={register}>
                                {Translate.convert("Create Account")}
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
                    <Link to="/pages/login" className="ml-auto text-decoration-none">
                        {Translate.convert("Login")}
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
