import { NotificationManager } from 'react-notifications';
import axios from "../api/axios";

const useDeleteProduct = () => {

    const deleteProduct = async (id) => { 
        await axios.delete(`/api/product/${id}`)
        .then(res => {
            const data = res?.data
            if(data.message == "Success"){
                window.location.reload()
            }
        }).catch(err => {
            NotificationManager.error(err, 'Error', 5000);
        })
    }
    return {
        deleteProduct
    }
}

export default useDeleteProduct;