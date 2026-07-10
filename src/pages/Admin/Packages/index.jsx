import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Space,
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Upload,
  message,
  notification,
} from "antd";
import axios from "axios";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { tourSchema } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addPackage,
  deletePackages,
  getPackages,
  getPkg_id,
  updatePackages,
  updates_null,
} from "../../../store/slice/packageSlice";
import "./packages.css";

const { Title } = Typography;

const initialPackages = {
  title: "",
  description: "",
  location: "",
  route: "",
  price: "",
  duration: "",
  category: "",
  image: "",
};

const Packages = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [resetImg, setResetImg] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { tourPackage, updatePkg } = useSelector(
    (store) => store?.packageSlice,
  );

  useEffect(() => {
    if (updatePkg) {
      setPackages(updatePkg);
    }
  }, [updatePkg]);

  // Get Input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackages((pre) => ({ ...pre, [name]: value }));
  };

  // get image
  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };

  // submit function
  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!updatePkg && !image) {
        return message.error("Image Required!");
      }
      let imgURL = updatePkg?.image;

      if (image) {
        const imgCloud = new FormData();
        imgCloud.append("file", image);
        imgCloud.append("upload_preset", "Lahza-B-03");
        imgCloud.append("cloud_name", "dty3m4p9f");

        const imgPost = await axios.post(
          "https://api.cloudinary.com/v1_1/dty3m4p9f/image/upload",
          imgCloud,
        );

        imgURL = imgPost?.data?.secure_url;
      }

      const pkg = {
        title: packages.title,
        description: packages.description,
        location: packages.location,
        route: packages.route,
        price: packages.price,
        duration: packages.duration,
        category: packages.category,
        image: imgURL,
      };

      const valid_pkg = await tourSchema.validate(pkg);
      if (updatePkg) {
        await dispatch(
          updatePackages({ id: updatePkg._id, update_pkg: valid_pkg }),
        ).unwrap();
      } else {
        await dispatch(addPackage(valid_pkg)).unwrap();
      }

      await dispatch(getPackages()).unwrap();
      notification.success({
        title: "Success",
        description: updatePkg ? "Package Updated" : "Package Added",
        duration: 2,
      });
      dispatch(updates_null());
      setPackages(initialPackages);
      setResetImg(Date.now());
      setImage(null);
      setOpen(false);

    } catch (error) {
      notification.success({
        title: "Failed",
        description: error.message,
        duration: 2,
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Get pk id for Eidt
  const handleEdit = (_id) => {
    setOpen(true);
    dispatch(getPkg_id(_id));
  };
  // get id for delete Pkg
  const handleDelete = (_id) => {
    dispatch(deletePackages(_id));
  };

  const handleCancel = () => {
    dispatch(updates_null());
    setOpen(false);
  };

  return (
    <>
      <div className="manage-packages">
        <div className="manage-packages__header">
          <Title level={2} className="manage-packages__title">
            Manage Packages
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-package-btn"
            onClick={() => setOpen(true)}
          >
            Add Package
          </Button>
        </div>

        <div className="table-container">
          <table className="packages-table">
            <thead>
              <tr>
                <th className="col-package">Title</th>
                <th className="col-route">Route</th>
                <th className="col-duration">Duration</th>
                <th className="col-price">Price</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {tourPackage?.map((pkg) => (
                <tr key={pkg.id} className="ticket-row">
                  <td className="col-package">
                    <span className="pkg-name">{pkg.title}</span>
                  </td>

                  <td className="col-route">
                    <span className="route">{pkg.route}</span>
                  </td>

                  <td className="col-duration">{pkg.duration}</td>

                  <td className="col-price">${pkg.price}</td>

                  <td className="col-action">
                    <Space>
                      <button
                        className="row-action"
                        onClick={() => handleEdit(pkg?._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="row-action row-action--delete"
                        onClick={() => handleDelete(pkg?._id)}
                      >
                        Delete
                      </button>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        footer={null}
        centered
        width={700}
        onCancel={handleCancel}
        className="package-modal"
      >
        <div className="package-modal-content">
          <Title
            level={3}
            style={{
              color: "#16233b",
              fontFamily: "Fraunces",
              marginBottom: 25,
            }}
          >
            ✈ Add Travel Package
          </Title>

          <Form layout="vertical" onFinish={handleAdd}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Package Title" required>
                  <Input
                    placeholder="Bali Escape"
                    name="title"
                    value={packages.title}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Category">
                  <Input
                    name="category"
                    value={packages.category}
                    placeholder="Adventure, Honeymoon..."
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Description" required>
                  <Input.TextArea
                    rows={4}
                    name="description"
                    value={packages.description}
                    placeholder="Write package description..."
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Location" required>
                  <Input
                    name="location"
                    value={packages.location}
                    placeholder="Bali, Indonesia"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Route" required>
                  <Input
                    placeholder="KHI → DPS"
                    onChange={handleChange}
                    name="route"
                    value={packages.route}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Price ($)" required>
                  <Input
                    type="number"
                    name="price"
                    value={packages.price}
                    style={{ width: "100%" }}
                    placeholder="780"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Duration" required>
                  <Input
                    type="number"
                    placeholder="6 Days / 5 Nights"
                    name="duration"
                    value={packages.duration}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Product Image" name="image" required>
                  <div className="custom-file-upload">
                    <label htmlFor="imageUpload" className="upload-btn">
                      📁 Choose Image
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      key={resetImg}
                      onChange={handleFile}
                    />

                    {image && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Selected preview"
                          className="image-preview__thumb"
                        />
                        <span className="image-preview__name">
                          {image.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 20,
              }}
            >
              <Button onClick={() => setOpen(false)}>Cancel</Button>

              <Button
                htmlType="submit"
                className="add-package-btn"
                loading={loading}
              >
                {updatePkg ? "Update Package" : "Save Package"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Packages;
