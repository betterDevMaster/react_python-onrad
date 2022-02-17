import React from 'react';
import PropTypes from 'prop-types';
import Translate from '../../../utils/translate'
import { 
    Container,
    Row,
    Col
} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import UsersList from './UsersList';

const Users = (props) => (
    <React.Fragment>
        <Container>
            <HeaderMain 
                title={Translate.convert('Users')}
                className="mb-5 mt-4"
            />
            <Row>
                <Col lg={ 12 }>
                    <UsersList />
                </Col>
            </Row>
        </Container>
    </React.Fragment>
);
Users.propTypes = {
    match: PropTypes.object.isRequired
};


export default Users;