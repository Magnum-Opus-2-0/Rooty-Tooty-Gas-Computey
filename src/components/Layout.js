import React from 'react';
import { Container} from 'reactstrap';

const Layout = (props) => {
    return (
        <Container>
            {props.children}
        </Container>
    );
}

export default Layout;
