import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

class ProtectedRoute extends Component {
    render() {
        const { component: MyComponent, authenticated, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={routeProps => (
                    authenticated ?
                        <Redirect to='/' /> :
                        <MyComponent {...routeProps} {...rest}/>
                )}
            />
        );
    }
}

export default ProtectedRoute;