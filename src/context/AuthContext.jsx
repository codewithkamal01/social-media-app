import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return context;
};
