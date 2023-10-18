import axios from 'axios';
import { setselectedimageb, setselectedimagef } from '../../features/userData/userdataSlice';

export const handleFileInputChangef = async (event, frontimages, dispatch, setFrontImages) => {

  if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
    const newImages = [...frontimages];
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('upload_preset', 'vcmakbux');
    formData.append('folder', 'userUploads');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
      newImages.push(res.data.secure_url);
      if(frontimages.length < 1){
        dispatch(setselectedimagef(res.data.secure_url))
      }
      dispatch(setFrontImages(newImages))
    } catch (err) {
      console.error(err);
    }
  }
};

export const handleFileInputChangeb = async (event, backimages, dispatch, setBackImages) => {

  if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
    const newImages = [...backimages];
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('upload_preset', 'vcmakbux');
    formData.append('folder', 'userUploads');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
      newImages.push(res.data.secure_url);
      if(backimages.length < 1){
        dispatch(setselectedimageb(res.data.secure_url))
      }
      dispatch(setBackImages(newImages))
    } catch (err) {
      console.error(err);
    }
  }
};


export const handleRemove = (index, origin,dispatch,setfrontimages,setbackimages,frontimages,backimages,setdeletionIndex,setselectedimagef) => {
    if (origin === "front") {
        const newImages = [...frontimages];
        newImages.splice(index, 1);
        dispatch(setfrontimages(newImages))
        console.log(newImages, "newImages")
        setdeletionIndex(index);
    } else if (origin === "back") {
        const newImages = [...backimages];
        newImages.splice(index, 1);
        dispatch(setbackimages(newImages))
    }
  };