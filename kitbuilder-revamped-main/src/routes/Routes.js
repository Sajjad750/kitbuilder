import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Import HashRouter instead of BrowserRouter
import StartDesign from '../pages/startDesign/StartDesign';
import AskName from '../pages/askName/AskName';
import WelcomePage from '../pages/welcomePage/WelcomePage';
import ChooseKit from '../pages/chooseKit/ChooseKit';
import Editor from '../pages/editor/Editor';
import SavedDesigns from '../pages/savedDesigns/SavedDesigns';
import CustomizedSnackbars from '../components/snackBar/Snackbar';
import Loading from '../components/loading/Loading';
import Requestquote from '../pages/requestQuote/RequestQuote';
import ThankYou from '../pages/Thankyou/Thankyou';
// import Fallback from '../pages/Fallback/Fallback';

const AppRoutes = () => {
    return (
        <>
            <CustomizedSnackbars />
            <Loading/>
            <HashRouter> {/* Use HashRouter here */}
                <Routes>
                    <Route path="/" element={<StartDesign />} />
                    <Route path="/askname" element={<AskName />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/choosekit" element={<ChooseKit />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/saveddesigns" element={<SavedDesigns />} />
                    <Route path="/requestquote" element={<Requestquote />} />
                    <Route path="/thankyou" element={<ThankYou />} />
                    {/* <Route path="/fallback" element={<Fallback />} /> */}
                </Routes>
            </HashRouter>
        </>
    );
}

export default AppRoutes;
