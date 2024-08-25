import { useNavigate } from "react-router-dom";

const VerifiedScreen = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate('/verified')
    }

    return (
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
    )
}

export default VerifiedScreen;