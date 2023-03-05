"use client";

import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFormik } from "formik";

const { Text } = Typography;

type UserForm = {
  name: string;
  role: string;
  email: string;
  password: string;
};

const initialValues = { name: "", role: "", email: "", password: "" };

const validate = (values: UserForm) => {
  const errors: any = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.role) {
    errors.role = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  }

  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const Settings = () => {
  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Card
      title="User"
      size="small"
      extra={
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Space direction="vertical" size={3} style={{ width: "100%" }}>
            <Text type="secondary">Name :</Text>
            <Input
              size="small"
              status={!!formik.errors.name ? "error" : undefined}
              style={{ width: "100%" }}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <Text type="danger">{formik.errors.name}</Text>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical" size={3} style={{ width: "100%" }}>
            <Text type="secondary">Role :</Text>
            <Input
              size="small"
              status={!!formik.errors.role ? "error" : undefined}
              style={{ width: "100%" }}
              name="title"
              value={formik.values.role}
              onChange={formik.handleChange}
            />
            <Text type="danger">{formik.errors.role}</Text>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Space direction="vertical" size={3} style={{ width: "100%" }}>
            <Text type="secondary">Email :</Text>
            <Input
              size="small"
              status={!!formik.errors.email ? "error" : undefined}
              style={{ width: "100%" }}
              name="title"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <Text type="danger">{formik.errors.email}</Text>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical" size={3} style={{ width: "100%" }}>
            <Text type="secondary">Password :</Text>
            <Input.Password
              size="small"
              status={!!formik.errors.name ? "error" : undefined}
              style={{ width: "100%" }}
              name="title"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <Text type="danger">{formik.errors.name}</Text>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default Settings;
