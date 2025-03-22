import { createContext } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// Export it as both default and named
export default AuthContext;
export { AuthContext }; 