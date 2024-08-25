import "./App.css";
import React from "react";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import FaceLiveness from "./Components/FaceLiveness";
import ReferenceImage from "./Components/ReferenceImage";
import { View, Flex } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import awsexports from "./aws-exports";
import QRScannerPage from "./Components/QrScannerPage";

Amplify.configure(awsexports);

function App() {
  const [faceLivenessAnalysis, setFaceLivenessAnalysis] = React.useState(null);
const navigate=useNavigate();
  const getfaceLivenessAnalysis = (faceLivenessAnalysis) => {
    if (faceLivenessAnalysis !== null) {
      setFaceLivenessAnalysis(faceLivenessAnalysis);
    }
  };

  const tryagain = () => {
    setFaceLivenessAnalysis(null);
  };
const handleNext=()=>{
  navigate('/verified')
}
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ThemeProvider>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                alignContent="flex-start"
                wrap="nowrap"
                gap="1rem">
                <View
                  as="div"
                  maxHeight="600px"
                  height="600px"
                  width="740px"
                  maxWidth="740px">
                  {faceLivenessAnalysis && faceLivenessAnalysis.Confidence ? (
                    <ReferenceImage
                      faceLivenessAnalysis={faceLivenessAnalysis}
                      tryagain={tryagain}
                    />
                  ) : (
                    <FaceLiveness
                      faceLivenessAnalysis={getfaceLivenessAnalysis}
                    />
                  )}
                </View>
              </Flex>
            </ThemeProvider>
          }
        />
        <Route path="/aadhaar" element={<QRScannerPage />} />
        <Route path="/completed" element={
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"90vh"}}>
          <p style={{fontSize:"20px"}}>Aadhaar is verified successfully!</p>
          <button 
          style={{backgroundColor:'#5869E6',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,width:'95%',paddingTop:'4%',paddingBottom:"4%",color:"white",border:"none",position:"absolute",bottom:"4%"}}
           onClick={handleNext}
          // id="navigateButton"
           >
           OK
           </button>
        </div>
      } />
        <Route path="/verified" element={<div >verified</div>} />

      </Routes>
    </Router>
  );
}

export default App;
