import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you are looking for does not exist."
        extra={
          <Link to="/user-side">
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default PageNotFound;