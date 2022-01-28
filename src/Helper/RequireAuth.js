import React, {useContext} from 'react';
import { UserContext } from './Context';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const {user, setUser} = useContext(UserContext);

    if (user !== null) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
}
