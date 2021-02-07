import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ component: Component, ...rest }) {
    const user = useSelector(state => state.user);
    return (
        <Route
            {...rest}
            render={routeProps => {
                if (user) {
                    return <Component {...routeProps} />;
                } else {
                    return (<Redirect
                        to={{
                            pathname: "/",
                            state: { from: routeProps.location }
                        }}
                    />);
                }
            }}
        />
    );
};

export function PublicRoute({ component: Component, ...rest }) {
    const user = useSelector(state => state.user);
    return (
        <Route
            {...rest}
            render={routeProps => {
                if (!user) {
                    return <Component {...routeProps} />;
                } else {
                    return (<Redirect
                        to={{
                            pathname: "/",
                            state: { from: routeProps.location }
                        }}
                    />);
                }
            }}
        />
    );
};