import { useDispatch, useSelector } from "react-redux";
import {
  deleteEnquiries,
  getAllEnquiries,
  updateStatus,
} from "../../../store/slice/contactSlice";
import { Typography } from "antd";
import { useState } from "react";
import ViewModal from "./ViewModal";
import "./enquiries.css";
import StatusModal from "./StatusModal";

const { Title } = Typography;
const Enquiries = () => {
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [enqStatus, setEnqStatus] = useState("");
  const [enqId, setEnqId] = useState(null);
  const [enquiries, setEnquiries] = useState(null);
  const { enquiry } = useSelector((store) => store.contactSlice);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteEnquiries(id));
  };

  const handleGet = (enq) => {
    setEnquiries(enq);
    setOpen(true);
  };

  const handleStatus = (enq) => {
    setEnqId(enq);
    setStatusOpen(true);
  };

  const statusUpdate = async (status) => {
    await dispatch(
      updateStatus({
        _id: enqId._id,
        status,
      }),
    ).unwrap();
    await dispatch(getAllEnquiries()).unwrap();
    setStatusOpen(false);
  };

  return (
    <>
      <section className="enquiry">
        <header className="enquiry__header">
          <div>
            <h1 className="enquiry__title">Enquiries</h1>
          </div>
        </header>

        <div className="enquiry__divider" />

        <table className="enquiry__table">
          <thead>
            <tr>
              <th className="enquiry__th enquiry__th--title">Name</th>
              <th className="enquiry__th enquiry__th--route text-center">
                Email
              </th>
              <th className="enquiry__th enquiry__th--duration">Subject</th>
              {/* <th className="enquiry__th enquiry__th--price"></th> */}

              {/* Create one model when admin click it it show all details about enquiry */}

              <th className="enquiry__th enquiry__th--action">Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiry.length > 0 ? (
              enquiry.map((enq) => (
                <tr className="enquiry__row" key={enq._id}>
                  <td className="enquiry__td enquiry__td--title">{enq.name}</td>

                  <td className="enquiry__td enquiry__td--duration">
                    {enq.email}
                  </td>

                  <td className="enquiry__td enquiry__td--price">
                    <span className="enquiry__price-current">
                      {enq.subject}
                    </span>
                  </td>

                  <td className="enquiry__td enquiry__td--action">
                    <button
                      type="button"
                      className="enquiry__action enquiry__action--view"
                      onClick={() => handleGet(enq)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="enquiry__action enquiry__action--status"
                      onClick={() => handleStatus(enq)}
                    >
                      Status
                    </button>

                    <button
                      type="button"
                      className="enquiry__action enquiry__action--delete"
                      onClick={() => handleDelete(enq._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="enquiry__empty">
                  <Title level={3}>No Enquiries...</Title>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <ViewModal open={open} setOpen={setOpen} enquiries={enquiries} />
      <StatusModal
        statusOpen={statusOpen}
        setStatusOpen={setStatusOpen}
        enqStatus={statusUpdate}
      />
    </>
  );
};

export default Enquiries;
