import React, { useState } from "react";
import { BiconomySmartAccount } from "@biconomy/account";
import PDFGenerator from "./PDF/pdfGenerator";
import { useAuth } from "../context/AuthContext";
import Student from "../types/students";
import { SmartAccount } from "@biconomy/account";

const StudentTable = ({
  studentData,
  smartAccount,
  provider,
}: {
  studentData: Student[];
  smartAccount: BiconomySmartAccount;
  provider: any;
}) => {
  // console.log(studentData);
  const { downloadData, showPdf, setShowPdf,isGenerated } = useAuth();
  const [data, setData] = useState<Student>();
  const handlePdf = (data: Student) => {
    setData(data);
    setShowPdf(true);
  };
  return (
    <>
      {showPdf && (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            {data && (
              <PDFGenerator
                smartAccount={smartAccount}
                provider={provider}
                data={data}
              />
            )}
          </div>
        </>
      )}
      <div className="w-full custom-scrollbar h-fit relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg ">
        <table className="w-full border-white border-2 text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-xs text-gray-400 uppercase dark:bg-gray-500 dark:text-gray-500">
            <tr>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3  ">
                Serial No.
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Student Name
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Age
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Date of Birth
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Applied Course
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Grade
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Father Name
              </th>
              <th scope="col" className="text-white bg-blue-900 px-6 py-3 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl">
            {studentData?.length > 0 && (
              <>
                {studentData.map((student: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className="light:bg-white bg-white font-semibold border-b dark:border-gray-300 hover:bg-sky-50 "
                    >
                      <td className="px-6 py-4">
                        {student.serialNumber || ""}
                      </td>
                      <td className="px-6 py-4">{student.studentName || ""}</td>

                      <td className="px-6 py-4">{student.studentAge || ""}</td>
                      <td className="px-6 py-4">{student.studentDOB || ""}</td>
                      <td className="px-6 py-4">
                        {student.studentCourse || ""}
                      </td>
                      <td className="px-6 py-4">
                        {student.studentGrade || ""}
                      </td>
                      <td className="px-6 py-4">{student.fatherName || ""}</td>
                      <td className="px-6 py-4">
                        {student.uuid !== "" ? (
                             <button onClick={() => downloadData(student.uuid,student.studentName,student.studentID)}>
                             Download Pdf
                           </button>
                          
                        ) : (
                            <button onClick={() => handlePdf(student)}>
                            Generate Pdf
                          </button>
                        )}
                      </td>

                      {/* Render a PDFDownloadLink for each student */}
                      {/* <td className="px-6 py-4">

                                        <PDFDownloadLink
                                            document={<PDFDocument studentData={student}/>}
                                            fileName={`${student.studentName}.pdf`}
                                        >
                                            {({blob, url, loading, error}) =>
                                                loading ? "Loading document..." : "Download PDF"
                                            }0xeca8b43e23b443d09daf9482959d797f
                                        </PDFDownloadLink>
                                    </td> */}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentTable;
