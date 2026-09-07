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
  message,
  notification,
  Popconfirm,
} from "antd";
import axios from "axios";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  availablePackages: "",
  image: "",
};

const Packages = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [resetImg, setResetImg] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { tourPackage, updatePkg, isLoading } = useSelector(
    (store) => store?.packageSlice
  );

  useEffect(() => {
    if (updatePkg) {
      setPackages({
        title: updatePkg.title || "",
        description: updatePkg.description || "",
        location: updatePkg.location || "",
        route: updatePkg.route || "",
        price: updatePkg.price || "",
        duration: updatePkg.duration || "",
        category: updatePkg.category || "",
        availablePackages: updatePkg.availablePackages ?? "",
        image: Array.isArray(updatePkg.image) ? updatePkg.image[0] : updatePkg.image || "",
      });
    } else {
      setPackages(initialPackages);
    }
  }, [updatePkg]);

  // Get Input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackages((prev) => ({ ...prev, [name]: value }));
  };

  // get image
  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // submit function
  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!updatePkg && !image && !packages.image) {
        setLoading(false);
        return message.error("Image Required!");
      }
      let imgURL = packages.image;

      if (image) {
        const imgCloud = new FormData();
        imgCloud.append("file", image);
        imgCloud.append("upload_preset", "Lahza-B-03");
        imgCloud.append("cloud_name", "dty3m4p9f");

        const imgPost = await axios.post(
          "https://api.cloudinary.com/v1_1/dty3m4p9f/image/upload",
          imgCloud
        );

        imgURL = imgPost?.data?.secure_url || imgURL;
      }

      const pkg = {
        title: packages.title.trim(),
        description: packages.description.trim(),
        location: packages.location.trim(),
        route: packages.route.trim(),
        price: Number(packages.price),
        duration: Number(packages.duration),
        category: packages.category.trim(),
        availablePackages: Number(packages.availablePackages || 0),
        image: imgURL ? [imgURL] : [],
      };

      const valid_pkg = await tourSchema.validate(pkg);
      if (updatePkg) {
        await dispatch(
          updatePackages({ id: updatePkg._id, update_pkg: valid_pkg })
        ).unwrap();
      } else {
        await dispatch(addPackage(valid_pkg)).unwrap();
      }

      await dispatch(getPackages()).unwrap();
      notification.success({
        message: "Success",
        description: updatePkg ? "Package Updated Successfully" : "Package Added Successfully",
        duration: 2,
      });

      dispatch(updates_null());
      setPackages(initialPackages);
      setResetImg(Date.now());
      setImage(null);
      setOpen(false);
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description: typeof error === "string" ? error : error?.message || "Failed to save package",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (_id) => {
    dispatch(getPkg_id(_id));
    setOpen(true);
  };

  const handleDelete = async (_id) => {
    try {
      await dispatch(deletePackages(_id)).unwrap();
      message.success("Package deleted successfully.");
    } catch (err) {
      message.error(typeof err === "string" ? err : err?.message || "Failed to delete package");
    }
  };

  const handleCancel = () => {
    dispatch(updates_null());
    setPackages(initialPackages);
    setImage(null);
    setOpen(false);
  };

  const handleOpenAdd = () => {
    dispatch(updates_null());
    setPackages(initialPackages);
    setImage(null);
    setOpen(true);
  };

  return (
    <>
      <div className="manage-packages">
        <div className="manage-packages__header">
          <div>
            <span className="manage-packages__eyebrow">ITINERARY DESK</span>
            <h1 className="manage-packages__main-title">Manage Packages</h1>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-package-btn"
            onClick={handleOpenAdd}
          >
            Add Package
          </Button>
        </div>

        <div className="table-container">
          <table className="packages-table">
            <thead>
              <tr>
                <th className="col-package">Title</th>
                <th className="col-route">Route / Location</th>
                <th className="col-duration">Duration</th>
                <th className="col-price">Price</th>
                <th className="col-available">Spots</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (!tourPackage || tourPackage.length === 0) ? (
                <tr>
                  <td colSpan={6} className="text-center pt-5 pb-5">
                    <Title level={4} style={{ color: "#5b6980" }}>Loading packages...</Title>
                  </td>
                </tr>
              ) : tourPackage && tourPackage.length > 0 ? (
                tourPackage.map((pkg) => (
                  <tr key={pkg._id} className="ticket-row">
                    <td className="col-package">
                      <span className="pkg-name">{pkg.title}</span>
                      <small className="pkg-cat">{pkg.category}</small>
                    </td>

                    <td className="col-route">
                      <span className="route">{pkg.route || pkg.location}</span>
                    </td>

                    <td className="col-duration">{pkg.duration} Days</td>

                    <td className="col-price">${pkg.price}</td>

                    <td className="col-available text-center">
                      <span className={`badge-spots ${pkg.availablePackages > 0 ? "spots-ok" : "spots-out"}`}>
                        {pkg.availablePackages ?? 0}
                      </span>
                    </td>

                    <td className="col-action">
                      <Space>
                        <button
                          type="button"
                          className="row-action"
                          onClick={() => handleEdit(pkg._id)}
                        >
                          <EditOutlined /> Edit
                        </button>

                        <Popconfirm
                          title="Delete package?"
                          description="Are you sure you want to delete this package?"
                          onConfirm={() => handleDelete(pkg._id)}
                          okText="Delete"
                          cancelText="Cancel"
                        >
                          <button
                            type="button"
                            className="row-action row-action--delete"
                          >
                            <DeleteOutlined /> Delete
                          </button>
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center pt-5 pb-5">
                    <Title level={4} style={{ color: "#5b6980" }}>No Packages Found</Title>
                    <p style={{ color: "#8a8f98" }}>Click 'Add Package' above to create your first itinerary.</p>
                  </td>
                </tr>
              )}
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
          <div className="modal-top-eyebrow">
            {updatePkg ? "EDIT ITINERARY" : "NEW ITINERARY"}
          </div>
          <Title
            level={3}
            style={{
              color: "#16233b",
              fontFamily: "Fraunces",
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            ✈ {updatePkg ? "Edit Travel Package" : "Add Travel Package"}
          </Title>

          <Form layout="vertical" onFinish={handleAdd}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Package Title" required>
                  <Input
                    placeholder="e.g. Bali Escape"
                    name="title"
                    value={packages.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Category" required>
                  <Input
                    name="category"
                    value={packages.category}
                    placeholder="e.g. Adventure, Honeymoon, City"
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Description" required>
                  <Input.TextArea
                    rows={3}
                    name="description"
                    value={packages.description}
                    placeholder="Write detailed package itinerary and highlights..."
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Location" required>
                  <Input
                    name="location"
                    value={packages.location}
                    placeholder="e.g. Bali, Indonesia"
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Route / Flight Details" required>
                  <Input
                    placeholder="e.g. KHI → DPS"
                    onChange={handleChange}
                    name="route"
                    value={packages.route}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Price ($ / person)" required>
                  <Input
                    type="number"
                    min="1"
                    name="price"
                    value={packages.price}
                    placeholder="780"
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Duration (Days)" required>
                  <Input
                    type="number"
                    min="1"
                    placeholder="6"
                    name="duration"
                    value={packages.duration}
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Available Spots" required>
                  <Input
                    type="number"
                    min="0"
                    placeholder="25"
                    name="availablePackages"
                    value={packages.availablePackages}
                    onChange={handleChange}
                    required
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Package Image" required>
                  <div className="custom-file-upload">
                    <label htmlFor="imageUpload" className="upload-btn">
                      📁 Choose Image File
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      key={resetImg}
                      onChange={handleFile}
                    />

                    {image ? (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Selected preview"
                          className="image-preview__thumb"
                        />
                        <span className="image-preview__name">{image.name}</span>
                      </div>
                    ) : packages.image ? (
                      <div className="image-preview">
                        <img
                          src={packages.image}
                          alt="Existing preview"
                          className="image-preview__thumb"
                        />
                        <span className="image-preview__name">Current Image</span>
                      </div>
                    ) : null}
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
              <Button onClick={handleCancel}>Cancel</Button>

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
