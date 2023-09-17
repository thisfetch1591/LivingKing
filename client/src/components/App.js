import React from "react";
import { Route } from "react-router-dom";
import MainPage from "./views/mainPage/Main";
import LoginPage from "./views/loginPage/Login";
import RegisterPage from "./views/RegisterPage/Register";
import NoMatchPage from "./views/resultPage/NoMatch";
import SuccessPage from "./views/resultPage/SuccessPage";
import FailPage from "./views/resultPage/FailPage";
import FindPage from "./views/FindPage/FindPage";
import ModifyPage from "./views/FindPage/ModifyPage";
import CallbackPage from "./views/loginPage/Login_Callback";
import DetailPage from "./views/detailPage/Detail";
import CreatePage from "./views/createPage/createPage";
import BoardPage from "./views/boardPage/BoardPage";
import SettingsPage from "./views/settingPage/Settings";
import { Switch, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/login/callback" component={CallbackPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/find" component={FindPage} />
        <Route exact path="/modify" component={ModifyPage} />
        <Route exact path="/confirm/success" component={SuccessPage} />
        <Route exact path="/confirm/fail" component={FailPage} />
        <Route exact path="/detail/:id" component={DetailPage} />
        <Route exact path="/write" component={CreatePage} />
        <Route exact path="/board" component={BoardPage} />
        <Route exact path="/settings" component={SettingsPage} />
        <Route component={NoMatchPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
