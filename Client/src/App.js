import TopBar from "./components/Topbar/TopBar";
import Home from "./pages/home/Home";
import Register from "./pages/registerPage/Register";
import Login from "./pages/loginPage/Login";
import WriteBlog from "./pages/writeBlog/WriteBlog";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/singlePost/SinglePost";
import About from "./pages/about/About";
import Footer from "./components/footer/Footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";

const App = () => {

  //Setting a variable to check if the user is logged in
  const {user} = useContext(Context);

  return ( 

    <Router>
      <TopBar />
      
        <Switch>
            <Route exact path="/">
                  <Home />
            </Route>

            <Route path="/register">
                {user ? <Home /> : <Register />}
            </Route>

            <Route path="/login">
                {user ? <Home /> : <Login />}
            </Route>

            <Route path="/write">
                {user ? <WriteBlog /> : <Register />}
            </Route>

            <Route path="/settings">
                  {user ? <Settings /> : <Register />}
            </Route>

            <Route path="/about">
                  <About />
            </Route>

            <Route path="/post/:id">
                <SinglePost />
            </Route>
        </Switch>
        <Footer />
    </Router>
    
    
  );
}

export default App;
