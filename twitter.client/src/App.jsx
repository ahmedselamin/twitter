import "./App.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <div className="App">
            <h1>Home page</h1>
            <h1
                style={{ marginTop: "6rem" }}
            >
                Say Whatever You Want, Anonymously!
            </h1>
            <Button
                variant="outline-success"
                style={{ marginTop: "6rem", width: "50%" }}
                onClick={() => navigate("tweets")}
            >
                NEXT
            </Button>
        </div>
    );
}

export default App;
