import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from "react-redux";

class ProtectedRoute extends Component {
    render() {
        const { component: MyComponent, ...rest } = this.props;
        const {authenticated1} = this.props;
        console.log("authenticated1 is: ", authenticated1);
        return (
            <Route
                {...rest}
                render={routeProps => (
                    authenticated1 ?
                        <Redirect to='/' /> :
                        <MyComponent {...routeProps} {...rest}/>
                )}
            />
        );
    }
}

const MapStateToProps = (state) => {
    return {
        authenticated1: state.user.authenticated
    };
};

export default connect(MapStateToProps)(ProtectedRoute);
