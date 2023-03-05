"use client";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { RightType } from "@prisma/client";
import RoleCreation from "~/types/roleCreation";

const { Text } = Typography;

const initialValues = {
  name: "",
  rights: [
    RightType.VIEW_PAGE,
    RightType.VIEW_CONTAINER,
    RightType.VIEW_CONTENT,
    RightType.VIEW_MEDIA,
    RightType.VIEW_FORM,
    RightType.VIEW_MESSAGE,
    RightType.VIEW_USER,
    RightType.VIEW_ROLE,
    RightType.VIEW_LAYOUT,
    RightType.VIEW_SETTING,
    RightType.REVALIDATE,
  ],
};

const validate = (values: RoleCreation) => {
  const errors: any = {};

  if (!values.name) {
    errors.name = "Required";
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
    <>
      <Card
        title="Details"
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
        <Space direction="vertical" size={3} style={{ flex: 1 }}>
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
      </Card>

      <Card title="Rights" size="small">
        <Checkbox.Group
          style={{ width: "100%" }}
          value={formik.values.rights}
          onChange={(e) => formik.setFieldValue("rights", e)}
        >
          <Row gutter={[16, 16]} style={{ flex: 1 }}>
            <Col span={6}>
              <Card title="Pages" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_PAGE}>
                    View all pages
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_PAGE}>
                    Create pages
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_PAGE}>
                    Update pages
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_PAGE}>
                    Delete pages
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.UPDATE_PAGE_SECTION}>
                    Update pages sections
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Containers" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_CONTAINER}>
                    View all containers
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_CONTAINER}>
                    Create containers
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_CONTAINER}>
                    Update containers
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_CONTAINER}>
                    Delete containers
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.UPDATE_CONTAINER_SECTION}>
                    Update containers sections
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_CONTAINER_TEMPLATE_SECTION}>
                    Update containers template sections
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Contents" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_CONTENT}>
                    View all contents
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_CONTENT}>
                    Create contents
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_CONTENT}>
                    Update contents
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_CONTENT}>
                    Delete contents
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.UPDATE_CONTENT_SECTION}>
                    Update contents sections
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Medias" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_MEDIA}>
                    View all medias
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.UPLOAD_MEDIA}>
                    Upload medias
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_MEDIA}>
                    Update medias
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_MEDIA}>
                    Delete medias
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Forms" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_FORM}>
                    View all forms
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_FORM}>
                    Create forms
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_FORM}>
                    Update forms
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_FORM}>
                    Delete forms
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Messages" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_MESSAGE}>
                    View all messages
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.READ_MESSAGE}>
                    Read messages
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_MESSAGE}>
                    Delete messages
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Users" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_USER}>
                    View all users
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_USER}>
                    Create users
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_USER}>
                    Update users
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_USER}>
                    Delete users
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Roles" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_ROLE}>
                    View all roles
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.CREATE_ROLE}>
                    Create roles
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_ROLE}>
                    Update roles
                  </Checkbox>
                  <Checkbox value={RightType.DELETE_ROLE}>
                    Delete roles
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Layout" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_LAYOUT}>View layout</Checkbox>
                  <Checkbox value={RightType.UPDATE_LAYOUT}>
                    Update layout
                  </Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Settings" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.VIEW_SETTING}>
                    View settings
                  </Checkbox>
                  <Divider style={{ margin: 0 }} />
                  <Checkbox value={RightType.UPDATE_GENERAL}>
                    Update general
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_THEME}>
                    Update theme
                  </Checkbox>
                  <Checkbox value={RightType.UPDATE_SMTP}>Update SMTP</Checkbox>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Others" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox value={RightType.REVALIDATE}>Revalidate</Checkbox>
                </Space>
              </Card>
            </Col>
          </Row>
        </Checkbox.Group>
      </Card>
    </>
  );
};

export default Settings;
