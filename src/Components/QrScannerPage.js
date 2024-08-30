import { useState } from "react";
import QRScanner from "./QrScanner";
import { useStores } from "../store/index";
import { useNavigate } from "react-router-dom";
import { toJS } from 'mobx';


const QRScannerPage = () => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState();
  const [isVerified, setIsVerified] = useState(false); 
  const [isLoading,setIsLoading] = useState(false);
  const { CommonStore } = useStores();
  const [url,setUrl] = useState(null)
const navigate=useNavigate();
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
              encodedQR: '760782544138644704140075953138286869443839889959616517000176362445016346346507324663405616826896074264231941262689558997125914814575364790449026144902863200767301723624135818151911500740008184689738920753800095742742865957020133000564231738434065720794369787145652200502325448306835485516851545522597723449386198502760685672840130271939015760945210417908790356651667837542554924299975871496076778471090899977919183707449056938941547314062096214824563104732821686595081904537831677479666021913333969681309607580309613568980132173473612529674836936424345070831798071908950335860214746882944233497844279138709796924792813618759646470964399068687332050159821865679272800390012052293291736198858457835386324680199877024945036700908553414034670157605667906406609622472068453052427954185702007255864595070204769583308213575371431915619274271416878427903134329783706424519297080183249618804287308002386022589777279154265206726065533595131866633566676190574424446800687699937267210430207007077899487260051110295490033173139501252306415541704505734508310807896318777154839346709951559757781314625480930688635396711537036786884736938229672939911512963511477848644851578561071894657616872015723951092707072138992060712203320405975533553497137669187113113680795439647440092873830657886467627765539430224418661188732124149337486711873522934287015502193077758742461425790788447186140562818123801218482513541592700305289380350468997197456241577354360131657139136845695729288825265666592087855661540134485705777782750406188902484485077383847155946765353569785302872865577105791576618684404186776295379235983181025961358124409886648045588201456370823993110001910042264008107692275290877519105637479185948188329713817172681762392567610403872202473218503898982277591982081672151555310684497877283085562132097586691254983692282505343382676548676622649393951605101300085746142634183404347527767829101383582903102732234290354077930250717919591236392048655781618412180200413081431275258168971256119360229971253122761245838062573153637522505408218922467818571898577227633363905582154013450563431945537191576661152243380210009656437365310811684949949451611140971581480841702326595166386790103255829019054174984700988937720050178398739681442707898809015202534531457625184875093625047662171857617525684205562852171031606418635612163918405736871083273090075910265278807074163793685550228202679662267472961731245705098053409732603313560925626192395925993416713665612342026918160429957458648767771974271448039387861945959635825530490210784455602425286986416866309333281210770066425395709624864677630234019037375596845228200935771066568251530492392836464701125940499620381729918471746469697329720651350441734785940429028701541947454427847059045521657609162278487748545287542585034120263440063321976561133857129012215073749459266732110829254166199481204005297931287665841712370355524256221108435730797943394684131770640449517621559376007642567856553170488614561235218811386113896488703481473653386052565606302392181585931316029531255001161716392714381971007114546839552',
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
        alert(`Something went wrong. Please try again.${toJS(response)}`);
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
    navigate('/completed')
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'navigate', url: url }));
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
       
       {!isVerified && !isLoading && (
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

       { !isLoading &&  isVerified &&(
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
