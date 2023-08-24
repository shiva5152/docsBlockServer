
const VerificationFailed = ({setVerificationResult}:{setVerificationResult:(p:any)=>void}) => {
  
  
  return (
    <div className="blur-background fixed  inset-0  top-[5.5rem] flex items-center justify-center">
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
          <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ff5c74"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </span>
        </span>
        <div>
          <p className="text-[#ff5c74] font-semibold">Invalid Document</p>
          <p>Couldn't read key data from file.</p>
          
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default VerificationFailed;
