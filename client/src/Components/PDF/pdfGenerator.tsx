import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FixedTemplate from "./pdf";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import Student from "../../types/students";
import { ethers } from 'ethers'
import { BiconomySmartAccount } from "@biconomy/account";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
// import { useAuth } from '@/context/AuthContext';
interface Props {
  smartAccount: BiconomySmartAccount;
  provider: any;
}

const PDFGenerator= ({data,smartAccount,provider}:{data:Student,smartAccount:BiconomySmartAccount, provider:any}) => {


  const {  setIsGenerated,addUuid, setShowPdf,state,getStudent,UploadData } = useAuth();
  const [isTemplateReady, setTemplateReady] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);
  const uniqueUuid = uuidv4();
  
  useEffect(()=>{
     getStudent(data.studentID);
  },[])
  

  useEffect(() => {
   
    if (templateRef.current) {
      setTemplateReady(true);
    }
  }, []);

  const generatePDF = () => {
    if (!isTemplateReady) {
      return;
    }

    const input = templateRef.current as HTMLDivElement;

    html2canvas(input).then(async(canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Set orientation to landscape for a horizontal layout
        unit: "mm", // Set units to millimeters
        format: [297, 210], // Set the A4 paper size
      });
      // const imgProps = pdf.getImageProperties(imgData);
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      let id="";
      
      if(state?.student && state.student.uuid!==""){        
        id=state.student.uuid;
      }else if(state.student){       
        id= "0x" +uniqueUuid.split("-").join("");
      }
      
      pdf.setProperties({
        title: data.studentName,
        subject: id,
        author: 'sharda university',
        keywords: 'generated, pdf, metadata',
        creator: 'metaGeeks, contributed by shiva && rahul',
        
      });
      
      const filename=`${data.studentName}-${data.studentID}.pdf`
      const pdfBlob = new Blob([pdf.output('arraybuffer')]);
      UploadData(pdfBlob,filename);
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const digest = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(digest));
      const hashHex = "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const transactionHash:string| undefined=  await storeHash(hashHex,id,smartAccount);
      await addUuid(data.studentID,id,transactionHash);

      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfBlobUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(pdfBlobUrl);
          pdf.save(filename);
        
        setShowPdf(false);
        setIsGenerated((p:boolean)=>!p);
    });
  };

  return (
    <div className="relative">
      {/* close btn */}
      <button className="absolute top-[1rem] z-10 right-[3.8rem] rounded-full bg-white" onClick={() => setShowPdf(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
     <div className="absolute bottom-[2rem] w-full z-10 flex border-blue-900 justify-center items-center">
     <button className="border-blue-900 border-2 p-3 py-2 rounded-lg bg-blue-300 text-white font-semibold hover:bg-blue-300" onClick={generatePDF}>Download pdf</button>
     </div>
      <div ref={templateRef}>
        {/* Render the fixed template content */}
        {isTemplateReady && <FixedTemplate data={data} />}
      </div>
    </div>
  );
};

const storeHash = async (hash:string, id:string,smartAccount:BiconomySmartAccount) => { 

  const counterAddress = "0xAB875754B7f4Cf95c3F4dbD1E703a31E5642f43D";
  try {
   
    const storeHashTx = new ethers.utils.Interface([
      "function storeHash(bytes16 documentId, bytes32 documentHash)",
    ]);
    
    const data = storeHashTx.encodeFunctionData("storeHash", [
      ethers.utils.arrayify(id),//
      ethers.utils.arrayify(hash),
      
    ]);
   
    const tx1 = {
      to: counterAddress,
      data: data,
    };
    
    let partialUserOp = await smartAccount.buildUserOp([tx1]);
    
    
    console.log("partialUserOp")
    
    const biconomyPaymaster =
      smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

    let paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      
    };
    
    console.log("paymasterServiceData")
    try {
      console.log("paymasterAndDataResponse above")
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          partialUserOp,
          paymasterServiceData
        );
        console.log("paymasterAndDataResponse below")  
      partialUserOp.paymasterAndData =
        paymasterAndDataResponse.paymasterAndData;

      const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
      console.log("userOpResponse below")
      const transactionDetails = await userOpResponse.wait();

      console.log("Transaction Details:", transactionDetails.logs[0].transactionHash);
      console.log("Transaction Hash:", userOpResponse.userOpHash);

     return transactionDetails.logs[0].transactionHash
    } catch (e) {
      console.error("Error executing transaction:", e);
      
    }
  } catch (error) {
    console.error("Error executing transaction:", error);
    
  }
};

export default PDFGenerator;
