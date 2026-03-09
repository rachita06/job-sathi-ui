import { useState } from "react";
import Home     from "./auth/Home";
import Login    from "./auth/Login";
import Register from "./auth/Register";

function App() {
    const [page,     setPage]     = useState("home");
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div>
            {page === "home" && (
                <Home
                    loggedIn={loggedIn}
                    onUploadClick={() => { if (!loggedIn) setPage("login"); }}
                />
            )}
            {page === "login" && (
                <Login
                    onLogin={() => { setLoggedIn(true); setPage("home"); }}
                    onGoRegister={() => setPage("register")}
                />
            )}
            {page === "register" && (
                <Register
                    onSuccess={() => setPage("login")}
                    onGoLogin={() => setPage("login")}
                />
            )}
        </div>
    );
}

export default App;