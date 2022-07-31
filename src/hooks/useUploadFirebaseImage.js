import { NotificationManager } from 'react-notifications';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "../utils/firebaseConfig";

const useUploadFirebaseImage = () => {
    const app = initializeApp(firebaseConfig)
    const storage = getStorage(app)

    const uploadImage = async (file) => { 
        return new Promise((resolve) => {
        if(!file) return NotificationManager.error("Invalid image file", 'Error', 3000)

        const storageRef = ref(storage, `/files/${Date.now() + file.name.toLowerCase()}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed", (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (err) => NotificationManager.error(err.message, 'Error', 5000),
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
                if(!url) return NotificationManager.error("Invalid image url", 'Error', 3000)
                resolve(url)
            })
        })
     });
    }

    return {
        uploadImage
    }
 }

export default useUploadFirebaseImage;