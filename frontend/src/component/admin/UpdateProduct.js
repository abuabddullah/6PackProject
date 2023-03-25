import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import StorageIcon from "@mui/icons-material/Storage";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchProductById,
  updateProductByAdminById
} from "../../reducers/productsReducer/productsActions";
import {
  clearAllProductsErrors,
  resetUpdateProduct
} from "../../reducers/productsReducer/productsSlice";
import { clearFetchSingleProductErrors } from "../../reducers/productsReducer/singleProductSlice";
import PageTitle from "../layout/PageTitle/PageTitle";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const {
    isLoading,
    error: productUpdateError,
    isUpdated,
    newProduct,
  } = useSelector((state) => state.products);

  const { error, product } = useSelector((state) => state.productDetails); // fetchProductById

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptops",
    "Footwear",
    "Bottoms",
    "Tops",
    "Attire",
    "Camera",
    "Smartphones",
    "Watches",
    "Headphones",
  ];

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(fetchProductById(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.Stock);
      setOldImages(product.images);
    }
    if (error) {
      toast.error("Admin Update product by id error", {
        id: "AdminUpdateProductById_err",
      });
      dispatch(clearFetchSingleProductErrors());
    }

    if (productUpdateError) {
      toast.success("Product update err", {
        id: "Productupdate_err",
      });
      dispatch(clearAllProductsErrors());
    }

    if (isUpdated) {
      toast.success("Product update Successfully", {
        id: "Productupdate_success",
      });
      dispatch(fetchProductById(productId));
      navigate("/admin/dashboard/products");
      dispatch(resetUpdateProduct());
    }
  }, [
    dispatch,
    error,
    product,
    productId,
    isUpdated,
    productUpdateError,
    navigate,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateProductByAdminById({ productId, myForm })); // can't pass two arguments at a time without wrapping in an object cause in updateProductByAdminById second argument is being received as { rejectWithValue }
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <PageTitle title={"Update Product - Dashboard"} />
      <div className="newProductContainer">
        <form
          className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1>Update Product</h1>

          <div>
            <SpellcheckIcon />
            <input
              type="text"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <AttachMoneyIcon />
            <input
              type="number"
              placeholder="Price"
              required
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          <div>
            <DescriptionIcon />

            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="30"
              rows="1"
            ></textarea>
          </div>

          <div>
            <AccountTreeIcon />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose Category</option>
              {categories.map((cate) => (
                <option key={cate} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <StorageIcon />
            <input
              type="number"
              placeholder="Stock"
              required
              onChange={(e) => setStock(e.target.value)}
              value={Stock}
            />
          </div>

          <div id="createProductFormFile">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={updateProductImagesChange}
              multiple
            />
          </div>

          <div id="createProductFormImage">
            {oldImages &&
              oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Old Product Preview" />
              ))}
          </div>

          <div id="createProductFormImage">
            {imagesPreview.map((image, index) => (
              <img key={index} src={image} alt="Product Preview" />
            ))}
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            disabled={isLoading ? true : false}
          >
            Update
          </Button>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
