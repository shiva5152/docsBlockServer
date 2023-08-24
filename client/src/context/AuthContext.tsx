import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import Student from "./../types/students";
import { toast } from "react-toastify";
export const showAlert = (type: any, text: any) => {
  if (type === "warn") {
    toast.warn(text, {
      position: "bottom-left",
      autoClose: 1200,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "error") {
    toast.error(text, {
      position: "bottom-left",
      autoClose: 1200,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "info") {
    toast.info(text, {
      position: "bottom-left",
      autoClose: 1200,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "succ") {
    toast.success(text, {
      position: "bottom-left",
      autoClose: 1200,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

export const initialState = {
  student: {},
};

const reducer = (state: any, action: any) => {
  if (action.type === "getStudent") {
    return {
      ...state,
      student: action.payload,
    };
  }
};

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const instance = axios.create({
    baseURL: "http://localhost:5000/api",
    // baseURL:"https://doks-block-server.onrender.com/api",
  });

  const [user, setUser] = useState<any>(null);
  const [smartAccount, setSmartAccount] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [studentData, setStudentData] = useState<any>();
  // const [student,setStudent]=useState<any>();

  const getStudents = async () => {
    try {
      const { data } = await instance(`/getStudents`);
      setStudentData(data.data);

      console.log(data.data);
    } catch (error) {}
  };
  const getStudent = async (id: string) => {
    try {
      const { data } = await instance(`/getStudent/${id}`);
      const s = await data.data;
      // console.log(s);

      dispatch({ type: "getStudent", payload: s });
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Something went wrong. Please try again.";
      console.log(errorMessage);
    }
  };
  const addUuid = async (id: string, uuid: string, transactionHash: string) => {
    try {
      const { data } = await instance.patch(`/adduuid/${id}`, { uuid: uuid,transactionHash:transactionHash });
      const s = await data.data;
      dispatch({ type: "getStudent", payload: s });
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Something went wrong. Please try again.";
      console.log(errorMessage);
    }
  };
  const UploadData = async (pdfBlob: any, filename: string) => {
    try {
      const formData = new FormData();
      formData.append("pdf", pdfBlob, filename);

      const { data } = await instance.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: "uploadPdf", payload: data.message });
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Something went wrong. Please try again.";
      console.log(errorMessage);
    }
  };
  const getUuidByServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);

      const { data } = await instance.post(`/getUuid`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Something went wrong. Please try again.";
      console.log(errorMessage);
      return "";
    }
  };
  const downloadData = async (uuid: string, name: string, id: string) => {
    try {
      const response = await instance(`/downloadPdf/${uuid}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-${id}.pdf`;

      a.click();
      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      console.log(response);
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Something went wrong. Please try again.";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    console.log("called");
    getStudents();
  }, [isGenerated]);

  return (
    <AuthContext.Provider
      value={{
        showUpload,
        setShowUpload,
        getUuidByServer,
        isGenerated,
        setIsGenerated,
        loading,
        UploadData,
        downloadData,
        setLoading,
        state,
        addUuid,
        smartAccount,
        setSmartAccount,
        user,
        showPdf,
        setShowPdf,
        studentData,
        setStudentData,
        getStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
