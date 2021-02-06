import { Route, Redirect } from 'react-router-dom';

export function ProtectedRoute({ children, user, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (user) {
                    return children;
                } else {
                    return (<Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />);
                }
            }}
        />
    );
};

export function PublicRoute({ children, user, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (!user) {
                    return children;
                } else {
                    return (<Redirect
                        to={{
                            pathname: "/user-panel",
                            state: { from: location }
                        }}
                    />);
                }
            }}
        />
    );
};