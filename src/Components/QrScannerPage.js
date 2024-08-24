import { useState } from "react";
import QRScanner from "./QrScanner";
import { useStores } from "../store/index";

const QRScannerPage = () => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState();
  const [isVerified, setIsVerified] = useState(false); 
  const [isLoading,setIsLoading] = useState(false);
  const { CommonStore } = useStores();
  const [url,setUrl] = useState(null)

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-API-KEY", "3646f320-aee6-452f-96f8-23718f3000b6");

  console.log(CommonStore.sessionId);

  const decodeData = async (decodetext) => {
    try { 
      setIsLoading(true);
      const response = await fetch(
        `https://ssiapi-staging.smartfalcon.io/aadhaar/verification/${CommonStore.sessionId}`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
              encodedQR: decodetext,
            }),
          // redirect: "follow",
        }
      );

      if (response.ok) {
        // Equivalent to checking response.status === 200
        const result = await response.json();
        console.log(result);
        if(result?.isMatch){
          setUrl(result?.connetionURL)
          setIsVerified(true)
        } else {
          alert("Verification failed. Please try again.");
          setData(null); // Reset data to prompt QRScanner again
        }
      } else {
        alert("Something went wrong. Please try again.");
        setData(null); // Reset data to prompt QRScanner again
      }
    } catch (err) {
      setErr(err.message || "An unexpected error occurred.");
      setData(null);
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`QR Code decoded: ${decodedText}`, decodedResult);
    setData(decodedText);
    decodeData(decodedText);
    // // Parse the scanned data (assuming XML format for Aadhar QR codes)
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(decodedText, "text/xml");
    // const aadharData = {
    //   uid: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("referenceid"),
    //   name: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("name"),
    //   gender: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("gender"),
    //   yob: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("dob"),
    //   co: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("careof"),
    //   loc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("location"),
    //   vtc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("vtc"),
    //   po: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("postoffice"),
    //   dist: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("district"),
    //   state: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("state"),
    //   pc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("pc")
    // };

    // setParsedData(aadharData);
  };

  const handleScanError = (error) => {
    console.error("Error scanning QR code:", error);
    // Handle the error
  };

  const handleNext = () => {
   if(url){
    // alert(url)
    if (window.ReactNativeWebView) {
      const message = JSON.stringify({ type: 'navigate', url });
      // alert(message)
      window.ReactNativeWebView.postMessage(message);
    } else {
      console.log('ReactNativeWebView is not available.');
    }
   }
  }

  return (
    <div>
      {/* {isFetching && <div className="loading">Loading...</div>} */}
      {/* {fetched && (
        <p
          style={{
            color: "red",
            position: "absolute",
            top: "30%",
            zIndex: "999",
          }}>
          fetched
        </p>
      )} */}
      {isLoading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p className="verifying-text">Verifying...</p>
            </div>
      )}
     {!isVerified &&(
       <>
       <QRScanner
       onScanSuccess={handleScanSuccess}
       onScanError={handleScanError}
      />
      {/* <button onClick={handleScanSuccess}>click</button>  */}
      
      {/* {data && <p>Scanned data: {data}</p>} */} 
     {/* <p>{err && err.message}</p> */}
       </>
     )}
    
    {isVerified && (
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
    )}
    </div>
  );
};

export default QRScannerPage;
