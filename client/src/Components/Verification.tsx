import React from "react";
import verificationData from "../types/varificationData";
import getDate from "../utils/getDate";

const Verification = ({
  transactionHash,
  Author,
  CreationDate,
  setVerificationResult
}: verificationData & { setVerificationResult: (p:any) => void }) => {

  const path = `https://mumbai.polygonscan.com/tx/${transactionHash}`;
  const creationDate = getDate(CreationDate);
  console.log("Parsed CreationDate:", creationDate);
  return (
    <div className="fixed inset-0 top-[5.5rem] blur-background flex items-center justify-center">
        <div className=" p-4 text-white bg-blue-800  rounded-md z-10 w-[30rem]">
      <div className="flex justify-between mb-3 ">
        <h1 className="flex w-10/12 gap-2 border-b-2 pb-2 border-b-white">
          <span>
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
          VERIFICATION COMPLETED
        </h1>
        <button onClick={()=>setVerificationResult(0)}>
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex gap-2 mb-3">
        <span>
          {/* {icon} */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#07ca94"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
            />
          </svg>
        </span>
        <div>
          <p className="text-[#69f3cc]">Valid Document</p>
          <p>{`This document was issued by ${Author} on ${creationDate}`}</p>
        </div>
      </div>
      <div className="border-2 mt-5 hover:text-black hover:bg-white border-white w-fit rounded">
        <a href={path} className="flex gap-2 p-2" target="_blank">
          <span>
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
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </span>
          View on Blockchain
        </a>
      </div>
    </div>
    </div>
  );
};

export default Verification;
