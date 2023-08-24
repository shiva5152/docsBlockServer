import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import { ethers } from "ethers";
import abi from "../utils/counterAbi.json";
import { showAlert } from "../context/AuthContext";
import Verification from "./Verification";
import verificationData from "../types/varificationData";
import VerificationFailed from "./VerificationFailed";
const Upload = ({ provider }: { provider: any }) => {
  //   const { show, setShow } = useState(false);
  const { getUuidByServer } = useAuth();
  const [transectionDetails, setTransectionDetail] = useState<verificationData>(
    { transactionHash: "", Author: "", CreationDate: "" }
  );
  const [files, setFiles] = useState<File[]>([]);
  const [verificationResult, setVerificationResult] = useState<number>(0);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length >= 1) {
      setFiles([]);
    }
    setFiles(acceptedFiles);
  }, []);

  console.log(files);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setVerificationResult(0);
  //   }, 5000);
  // }, [verificationResult]);
  const getHash = async () => {
    try {
      if (files.length === 0) return "";
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const digest = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(digest));
      const hashHex =
        "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return hashHex;
    } catch (error) {
      console.log(error);
    }
  };

  const getUuid = async () => {
    if (files.length == 0) {
      showAlert("warn", "File not found");
      return;
    }
    const file = files[0];
    try {
      const data = await getUuidByServer(file);
      setTransectionDetail({
        transactionHash: data.transactionHash,
        Author: data.Author,
        CreationDate: data.CreationDate,
      });
      return data.uuid;
    } catch (error) {
      console.error("Error loading or parsing the PDF:", error);
    }
  };
  const verifyHash = async (documentId: string, hash: string | undefined) => {
    if (documentId === "" || hash === "") {
      showAlert("", "Failed to get documentId or generating a hash .");
      return;
    }
    console.log(hash, documentId);

    try {
      const counterAddress = "0xAB875754B7f4Cf95c3F4dbD1E703a31E5642f43D";
      const contract = new ethers.Contract(counterAddress, abi, provider);
      const result: boolean = await contract.verifyHash(documentId, hash);
      if (result) {
        setVerificationResult(1);
      } else setVerificationResult(2);
    } catch (error) {
      showAlert("err", error);
    }
  };

  const handleUpload = async () => {
    if (files.length == 0) {
      showAlert("warn", "Please upload your file first");
      return;
    }

    const hash = await getHash();
    //  const hash = '0x5982f42dce5884de0134957e9aba6ac28330a550bf0f58520b276b507015cc85';
    // const uuid='hello'
    const uuid = await getUuid();

    console.log(hash, uuid);
    if (uuid === undefined) {
      setVerificationResult(2);
      return;
    }

    verifyHash(uuid, hash);

    // console.log(verificationResult)

    setFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  return (
    <div
      className="flex items-center justify-start flex-col bg-gray-100 w-full  border-t border-l border-gray-300 "
      style={{ height: "calc(100vh - 5.4rem)" }}
    >
      <div className="bg-white flex pt-[1rem] pb-[2.5rem]  flex-col w-9/12 md:w-6/12 items-center justify-center mt-[5.8rem] rounded-md ">
        <h1 className="p-2 pb-0 m-2 font-semibold text-xl italic mb-[4rem] border-b-2 border-black">
          Verify The certificate
        </h1>
        {/* dropzone  */}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="bg-sky-50 w-full py-[3rem] px-[4rem] rounded-md border-[3px] border-dotted  mb-[1.5rem]  border-blue-700 cursor-pointer shadow-lg hover:shadow-xl transition duration-400 ease-in-out">
            {isDragActive ? (
              <p className="w-full">Drop the .xlsx ot .txt file here ...</p>
            ) : (
              <div className="flex flex-col gap-3 justify-center items-center">
                <span className="bg-blue-800 rounded-full p-2">
                  {/* <img src="/upload.png" width={56} alt="" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </span>

                <p className="w-full flex flex-col items-center justify-center">
                  <span className="block">
                  <span>Drag 'n' drop file here or&nbsp;</span>
                  <span className="font-medium underline">Choose file</span>
                  </span>
                  <span className="block">for Verification</span>
                </p>
              </div>
            )}
          </div>
        </div>
        {/* btns */}
        <div className="flex mt-10 gap-3 ">
          <p className="bg-gray-100 flex items-center justify-center font-medium  rounded-md text-sm w-full  px-5 py-2.5">
            {files.length > 0 ? files[0]?.name : "Drop the file above"}
          </p>
          <button
            // disabled={}
            onClick={handleUpload}
            className=" text-white bg-blue-800 font-medium rounded-md text-sm w-full sm:w-auto block px-5 py-2.5 text-center"
          >
            Verify
          </button>
        </div>
        
        
        {verificationResult !== 0 && (
          <>
            {verificationResult == 1 ? (
              <Verification
              Author={transectionDetails.Author}
              CreationDate={transectionDetails.CreationDate}
              transactionHash={transectionDetails.transactionHash}
              setVerificationResult={setVerificationResult}
            />
            ) : (
              <VerificationFailed setVerificationResult={setVerificationResult} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;
