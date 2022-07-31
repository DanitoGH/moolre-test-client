import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { Button, Card,Form, FormGroup, Container, Row, Col } from "reactstrap";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import useUploadFirebaseImage from "../hooks/useUploadFirebaseImage";
import { NotificationContainer, NotificationManager } from 'react-notifications';

const AddProduct = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [productImagePreview, setProductImagePreview] = useState(null)
  const [productImage, setProductImage] = useState(false)
  const [productImageError, setProductImageError] = useState(false)
  const [busy, setBusy] = useState(false)
  const { uploadImage } = useUploadFirebaseImage()
  const fileTypes = ["JPG", "PNG", "JPEG"]

  const handleChange = (file) => {
    if(file !== null){
      imageReaderHandler(file)
    }
  };

  const imageReaderHandler = file => {
    const reader = new FileReader();
    reader.onload = () => {
       if(reader.readyState === 2){
        setProductImage(file)
        setProductImagePreview(reader.result)
       }
    }
    reader.readAsDataURL(file)
   }

  const resizeImage = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        600,
        "JPEG",
        85,
        0,
        (resizedImage) =>  {
          resolve(resizedImage)
        },
        "file",
        300,
        300
      );
    });

  const onSubmit = async ({ title, price, description }) => {
      if(!productImagePreview) {
        setProductImageError(true)
        return
      }
      
    if (!title || !price || !description) {
       return false
    }
    // set busy state to TRUE
     setBusy(true)
    // resize image
    const resizedImageFile = await resizeImage(productImage);
    // upload image
    await uploadImage(resizedImageFile)
    .then( async(imageUrl) => {
      if(imageUrl){
        await uploadProduct({
          name: title,
          price: price,
          description: description,
          image: imageUrl
        })
      }
    }).catch((err) => {
        NotificationManager.error(err, 'Error', 5000);
    })
  }

  const uploadProduct = async (data) => {
      await axios.post('/api/product', data)
      .then(res => {
          const data = res.data
          if(data?.message) {
              NotificationManager.success(data?.message, 'Success', 3000)
          }
          setBusy(false)
      }).catch(err => {
          setBusy(false)
          NotificationManager.error(err.response.data.message, 'Error Adding Product', 5000);
      })
  }

  return (
    <>
    <Container>
     <NotificationContainer/>
      <Row className="justify-content-center">
       <Col lg="6">
        <Card className="p-4">         
        <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <label htmlFor="titleFormControlInput">Title*</label>
          <input 
              id="titleFormControlInput" 
              type="text"
              name="title"
              className="form-control"
              {...register("title", { required: 'Product title is required', minLength: {
                value: 3,
                message: 'Product title must be at least 3 characters'
               },
               maxLength: {
                value: 20,
                message: 'Product title must not exceed more than 20 characters'
               }
              }
             )}
          />
          {errors?.title && <span className="text-danger">{errors.title.message}</span>}
        </FormGroup>
        <FormGroup>
          <label htmlFor="priceFormControlInput">Price*</label>
          <input 
              id="priceFormControlInput" 
              type="number"
              name="price"
              min={1}
              className="form-control"
              {...register("price", { required: 'Product price is required', minLength: {
                value: 1,
                message: 'Product price must be at least 1 character'
               },
              }
             )}
          />
         {errors?.price && <span className="text-danger">{errors.price.message}</span>}
        </FormGroup>
        <FormGroup>
        <label htmlFor="imageFormControlInput">Image*</label>
        <Row className="justify-content-center">
          <Col lg="9">
            <FileUploader handleChange={handleChange} name="file" types={fileTypes}/>
          </Col>
          <Col lg="3">
          { productImagePreview && <img alt="..." className="rounded" src={productImagePreview} height="70"/>}
          </Col>
        </Row>
        { productImageError && <span className="text-danger">Product image is required</span>}
      </FormGroup>
      <FormGroup>
        <label htmlFor="descriptionFormControlInput">Description*</label>
        <textarea 
            id="descriptionFormControlInput" 
            type="textarea"
            rows="2"
            name="description"
            className="form-control"
            {...register("description", { required: 'Product description is required', minLength: {
                value: 5,
                message: 'Product description must be at least 5 characters'
              }, 
              maxLength: {
                value: 20,
                message: 'Product description must not exceed more than 300 characters'
               }
            }
           )}
        />
       {errors?.description && <span className="text-danger">{errors.description.message}</span>}
      </FormGroup>
       <Button color="primary" className="justify-content-end mt-3" type="submit" block disabled={busy}>
          { busy ? " Please wait..." : "Submit" }
       </Button>
       </Form>
      </Card>
      </Col>
     </Row>
    </Container>
  </>
  );
}

export default AddProduct;
