import './App.css';
import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import jwtDecode from "jwt-decode";

import {Provider} from "react-redux";
import store from "./redux/store";


import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {getUserData} from "./redux/actions/userActions";
import axios from "axios";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff6333',
            main: '#ff3d00',
            dark: '#b22a00',
            contrastText: '#fff'
        }
    }
});

class App extends Component {

    componentDidMount() {
        const token = localStorage.getItem('FireBaseAuthToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) { // not expired
                axios.defaults.headers.common['Authorization'] = token;
                store.dispatch(getUserData());
            }
        }
    }

    render() {
        // How do protected routes: https://stackoverflow.com/questions/48497510/simple-conditional-routing-in-reactjs
        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router>
                        <Navbar/>
                        <div className="container">
                            <Switch>
                                <Route exact path = '/' component={home}/>
                                <ProtectedRoute
                                    exact path='/login'
                                    component={login}
                                />
                                <ProtectedRoute
                                    exact path='/signup'
                                    component={signup}
                                />
                            </Switch>
                        </div>
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    }
}

export default App;
