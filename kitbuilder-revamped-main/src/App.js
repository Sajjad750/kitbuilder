import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/Routes";
import { openModal } from './redux/Modal/modalSlice';
import { config } from "./config";


function App() {

  const dispatch = useDispatch();
  let URL = config.url.API_URL


  // Handle Internet Connection 

  useEffect(() => {
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    }
  });

  const handleConnectionChange = () => {
    if (!navigator.onLine) {
      dispatch(openModal({ message: "Please check Internet Connection!", variant: "warning" }))
    }
    else if (navigator.onLine) {
      dispatch(openModal({ message: "You are back Online!", variant: "success" }))
    }
  }


  // This code is for adding encrypted retailer id into cookie
  // const fetchEncryptedId = async (id) => {
  //   try {
  //     const response = await axios.get(`${URL}/api/crypt/encrypt/?id=${id}`);
  //     console.log(response.data);
  //     // set a cookie
  //     Cookies.set('retId', JSON.stringify(response.data));
  //   } catch (error) {
  //     console.error('Failed to fetch encrypted ID: ', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchEncryptedId('64cb4bf8d9aed7298bcfaef4');
  // }, [])

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
