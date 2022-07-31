import React, { useState, useEffect } from "react";
import NumberFormat from 'react-number-format';
import { confirmAlert } from 'react-confirm-alert';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Button, Card, CardBody, CardTitle, CardText, Modal, Container, Row, Col } from "reactstrap";
import axios from "../api/axios";
import useDeleteProduct from "../hooks/useDeleteProduct";

const Products = () => {
  const [busy, setBusy] = useState(false);
  const [modalSmall, setModalSmall] = useState(false);
  const [productPreview, setProductPreview] = useState([]);
  const [products, setProducts] = useState([]);
  const { deleteProduct } = useDeleteProduct()

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
   
    const getProducts = async () => {
        await axios.get('/api/product')
        .then(res => {
            const data = res?.data
            if(isMounted) {
              if(!data.message){
                setProducts(data.data)
              } else {
                NotificationManager.info(data.message, 'Info', 3000)
              }
            }
        }).catch(err => {
            NotificationManager.error(err, 'Error', 5000);
        })
    }
    getProducts();

    return () => { 
        isMounted = false;
        controller.abort();
    }
  },[])

  const ProductModal = () => {
    return (
     <Modal
        isOpen={modalSmall}
        className="modal-sm"
        modalClassName="bd-example-modal-sm"
        toggle={() => setModalSmall(false)}
      >
      <div className="modal-header">
        <h4 className="modal-title" id="mySmallModalLabel">
        </h4>
        <button
          aria-label="Close"
          className="close"
          type="button"
          onClick={() => setModalSmall(false)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <div className="modal-body m-0">
        <Card>
          <CardBody className="m-0 p-0">
              <Row> 
                <Col sm={12} md={4}  className="m-0 p-0">
                  <img alt={"product name"} className="rounded" src={productPreview.image} width={60} height={70} />
                </Col>
                <Col sm={12} md={8}  className="m-0 p-0">
                 <Row> 
                  <Col md={12}  className="m-0 p-0">
                   <CardText className="mt-2">
                     { productPreview.name }
                    </CardText>
                  </Col>
                  <Col md={12}  className="m-0 p-0">
                     <CardTitle tag="h5">
                       <NumberFormat value={productPreview.price} displayType={'text'} thousandSeparator={true} prefix={'GHS '} />
                     </CardTitle>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row> 
          <Col sm={12} md={6}>
            <Button className="mr-1" color="primary"
             outline block
             onClick={e => setModalSmall(false)} >
               Cancel
            </Button>
         </Col>
          <Col sm={12} md={6}>
            <Button
              color="primary"
              onClick={e => handleByNow(productPreview)}
              block
              disabled={busy}
              >
              { busy ? " Processing..." : "Pay Now" }
          </Button>
        </Col>
       </Row>
      </div>
    </Modal>
    )
  }

  const ProductCard = ({ data }) => {
    return (
      <>
       <ProductModal />
       <Card>
          <img alt="product_name" className="rounded" src={data.image} width="100%" height="200"/>
          <CardBody>
            <CardText tag="h4" className="m-0">{data.name}</CardText>
            <CardTitle className="mb-2 text-muted">
              <NumberFormat value={data.price} displayType={'text'} thousandSeparator={true} prefix={'GHS '} />
            </CardTitle>
              <Row> 
                <Col sm={6} md={4}>
                <Button className="mr-1" color="primary"
                     outline block
                     onClick={e => handleProductDelete(data._id)}
                     >
                    <i className="fa fa-trash mr-3" />
                </Button>
                </Col>
                <Col sm={6} md={8}>
                  <Button
                      color="primary"
                      onClick={e => {
                        setProductPreview(data)
                        setModalSmall(true)
                      }}
                      block
                    >
                    Buy Now
                </Button>
             </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }

  const handleByNow = async () => {
      const product = {
        product_name: productPreview.name,
        amount: productPreview.price
      }

      setBusy(true)
      await axios.post('/api/payment', product)
      .then(res => {
          const data = res?.data
          setBusy(false)
          setModalSmall(false)
          NotificationManager.success(data.message, 'Success', 3000);
      }).catch(err => {
          NotificationManager.error(err, 'Error', 5000)
          setBusy(false)
      })
  }
  
  const handleProductDelete = async id  => {
    confirmAlert({
      title: 'Confirm product delete',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Cancel',
          onClick: () => {}
        },
        {
          label: 'Delete',
          onClick: async () => {
            deleteProduct(id)
          }
        },
      ]
    });
  }

  return (
    <>
     <Container>
     <NotificationContainer/>
      <Row>
        {
         products.length > 0 && products.map((data, i) => {
            return (
              <Col xs={12} sm={6} md={4} lg={3} key={data._id}>
                 <ProductCard data={data}/>
              </Col>
            )
          })
        }
      </Row>
      </Container>
   </>
  );
}

export default Products;
