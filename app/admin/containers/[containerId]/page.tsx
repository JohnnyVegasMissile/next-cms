"use client";

import set from "lodash.set";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
} from "antd";
import { useFormik } from "formik";
import { Typography } from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import MetadatasList from "~/components/MetadatasList";
import ContainerCreation from "~/types/containerCreation";
import SlugEdit from "~/components/SlugEdit";
import { ContainerFieldType } from "@prisma/client";
import { Options } from "~/types";
import { Value } from "sass";
import { Dayjs } from "dayjs";

const { Panel } = Collapse;
const { Text } = Typography;

const initialValues: ContainerCreation = {
  name: "",
  published: true,
  slug: [""],
  metadatas: [],
  contentsMetadatas: [],
  fields: [],
};

const validate = (values: ContainerCreation) => {
  let errors: any = {};

  if (!values.name) {
    errors.name = "Required";
  }

  for (let i = 0; i < values.slug.length; i++) {
    if (!values.slug[i]) set(errors, `slug.${i}`, "Required");
  }

  for (let i = 0; i < values.metadatas.length; i++) {
    if (!values.metadatas[i].content) set(errors, `metadatas.${i}`, "Required");
  }

  for (let i = 0; i < values.contentsMetadatas.length; i++) {
    if (!values.contentsMetadatas[i].content)
      set(errors, `contentsMetadatas.${i}`, "Required");
  }

  return errors;
};

const CreateContainer = () => {
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

  // const options = [
  //   { label: "Apple", value: "Apple" },
  //   { label: "Pear", value: "Pear" },
  //   { label: "Orange", value: "Orange" },
  // ];

  return (
    <>
      <Tooltip title="Save container">
        <FloatButton
          shape="circle"
          type="primary"
          style={{ right: 50 }}
          icon={<CheckOutlined />}
          onClick={() => formik.handleSubmit()}
        />
      </Tooltip>
      <Card
        bordered={false}
        size="small"
        title="Information"
        extra={
          <Space>
            <Button
              icon={<PicCenterOutlined />}
              key="1"
              size="small"
              type="dashed"
            >
              Custom sections
            </Button>
            <Popconfirm
              placement="bottom"
              title="Save before?"
              description="If you don't your changes won't be saved"
              // onConfirm={confirm}
              // onCancel={cancel}
              okText="Save before"
              cancelText="Without saving"
            >
              <Button
                icon={<PicLeftOutlined />}
                key="2"
                size="small"
                type="dashed"
              >
                Custom template sections
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
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
              <Col span={12}>
                <Space
                  direction="vertical"
                  size={3}
                  style={{ flex: 1, width: "100%" }}
                >
                  <Text type="secondary">Published :</Text>
                  <Radio.Group
                    name="published"
                    value={formik.values.published}
                    onChange={formik.handleChange}
                    options={[
                      { label: "Published", value: true },
                      { label: "Unpublished", value: false },
                    ]}
                  />
                </Space>
              </Col>
            </Row>

            <Divider
              style={{ margin: "1rem", width: "97%", minWidth: "97%" }}
            />

            <Space direction="vertical" size={3} style={{ width: "100%" }}>
              <Text type="secondary">URL :</Text>
              <SlugEdit
                value={formik.values.slug}
                onChange={(e) => formik.setFieldValue("slug", e)}
                errors={formik.errors.slug as string[]}
              />
              <Text type="danger">
                {(formik.errors.slug as string[])?.find((e) => !!e)}
              </Text>
            </Space>
          </Col>
          <Col span={8}>
            <Card
              size="small"
              title="Container metadatas"
              style={{ minHeight: "100%" }}
            >
              <MetadatasList
                name="metadatas"
                value={formik.values.metadatas}
                onChange={formik.handleChange}
                errors={formik.errors.metadatas as string[]}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            bordered={false}
            bodyStyle={{ height: "fit-content" }}
            size="small"
            title="Field"
          >
            <ContainerFields
              value={formik.values.fields}
              onChange={(name, value) =>
                formik.setFieldValue(`fields${name ? `.${name}` : ""}`, value)
              }
              errors={formik.errors.fields as any[]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{ height: "fit-content" }}
            size="small"
            title="Contents metadatas"
          >
            <MetadatasList
              name="contentsMetadatas"
              value={formik.values.contentsMetadatas}
              onChange={formik.handleChange}
              errors={formik.errors.contentsMetadatas as string[]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateContainer;

const containerOptions = [
  { label: "Text", value: ContainerFieldType.STRING },
  { label: "Date", value: ContainerFieldType.DATE },
  { label: "Boolean", value: ContainerFieldType.BOOLEAN },
  { label: "Number", value: ContainerFieldType.NUMBER },
  { label: "Link", value: ContainerFieldType.LINK },
  { label: "Paragraph", value: ContainerFieldType.PARAGRAPH },
  { label: "Image", value: ContainerFieldType.IMAGE },
  { label: "File", value: ContainerFieldType.FILE },
  { label: "Video", value: ContainerFieldType.VIDEO },
  { label: "Content", value: ContainerFieldType.CONTENT },
  { label: "Option", value: ContainerFieldType.OPTION },
  { label: "Wysiwyg", value: ContainerFieldType.RICHTEXT },
  { label: "Color", value: ContainerFieldType.COLOR },
  { label: "Location", value: ContainerFieldType.LOCATION },
];

interface ContainerFieldsProps {
  value: ContainerCreation["fields"];
  onChange(name: string, value: any): void;
  errors: any[];
}

const ContainerFields = ({ value, onChange, errors }: ContainerFieldsProps) => {
  const addField = () =>
    onChange("", [
      ...value,
      {
        tempId: "nuber",
        name: "",
        required: false,
        type: ContainerFieldType.STRING,
        multiple: false,
        options: [],
      },
    ]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {value.map((field, idx) => (
        <Collapse size="small" key={field.id || field.tempId || `field-${idx}`}>
          <Panel
            key={field.id || field.tempId || `field-${idx}`}
            header={
              <Space>
                <Text strong>{field.type || "New"} field: </Text>
                <Text>{field.name}</Text>
              </Space>
            }
            extra={
              <Popover
                placement="bottom"
                arrow={false}
                content={
                  <Space direction="vertical">
                    <Button
                      size="small"
                      disabled={idx === 0}
                      onClick={(e) => e.stopPropagation()}
                      icon={<CaretUpOutlined />}
                      type="primary"
                    />
                    <Button
                      size="small"
                      disabled={idx === value.length - 1}
                      onClick={(e) => e.stopPropagation()}
                      icon={<CaretDownOutlined />}
                      type="primary"
                    />
                    <Divider style={{ margin: 0 }} />

                    <Popconfirm
                      placement="left"
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      onConfirm={(e) => e?.stopPropagation()}
                      onCancel={(e) => e?.stopPropagation()}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        type="primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </Space>
                }
                trigger="click"
              >
                <Button
                  type="ghost"
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  icon={<EllipsisOutlined />}
                />
              </Popover>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size={3}
                      style={{ width: "100%" }}
                    >
                      <Space>
                        <Text type="secondary">Name :</Text>

                        <Switch
                          size="small"
                          checked={field.required}
                          onChange={(e) => onChange(`${idx}.required`, e)}
                          checkedChildren="Required"
                          unCheckedChildren="Optional"
                        />
                      </Space>

                      <Input
                        size="small"
                        status="error"
                        style={{ width: "100%" }}
                        value={field.name}
                        onChange={(e) =>
                          onChange(`${idx}.name`, e.target.value)
                        }
                      />
                      <Text type="danger">Name is required</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size={3}
                      style={{ width: "100%" }}
                    >
                      <Text type="secondary">Default :</Text>
                      <DefaultField
                        type={field.type}
                        multiple={field.multiple}
                        options={field.options}
                        value={field.default}
                        onChange={(e) => onChange(`${idx}.default`, e)}
                      />
                    </Space>
                  </Col>
                </Row>
                <Divider style={{ margin: 0 }} />
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size={3}
                      style={{ width: "100%" }}
                    >
                      <Text type="secondary">Type :</Text>
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        value={field.type}
                        disabled={!!field.id}
                        options={containerOptions}
                        onChange={(e) => onChange(`${idx}.type`, e)}
                      />
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size={3}
                      style={{ width: "100%" }}
                    >
                      {field.type === ContainerFieldType.CONTENT && (
                        <>
                          <Text type="secondary">Content :</Text>
                          <Select
                            size="small"
                            status="error"
                            style={{ width: "100%" }}
                            value={field.type}
                            disabled={!!field.id}
                            options={containerOptions}
                            onChange={(e) => onChange(`${idx}.type`, e)}
                          />
                          <Text type="danger">Title is required</Text>
                        </>
                      )}

                      {field.type === ContainerFieldType.DATE && (
                        <>
                          <div style={{ display: "flex" }}>
                            <Text type="secondary" style={{ width: "50%" }}>
                              Between :
                            </Text>
                            <Text type="secondary">And :</Text>
                          </div>
                          <Input.Group compact>
                            <DatePicker
                              size="small"
                              style={{ width: "50%" }}
                              disabledDate={(current: Dayjs) => {
                                if (!field.endDate) {
                                  return false;
                                }

                                return field.endDate < current;
                              }}
                              value={field.startDate}
                              onChange={(e) => onChange(`${idx}.startDate`, e)}
                            />
                            <DatePicker
                              size="small"
                              style={{ width: "50%" }}
                              disabledDate={(current: Dayjs) => {
                                if (!field.startDate) {
                                  return false;
                                }

                                return field.startDate > current;
                              }}
                              value={field.endDate}
                              onChange={(e) => onChange(`${idx}.endDate`, e)}
                            />
                          </Input.Group>
                        </>
                      )}
                    </Space>
                  </Col>
                </Row>

                <Space style={{ width: "100%" }}>
                  <Text type="secondary">Multiple :</Text>
                  <Switch
                    size="small"
                    checked={field.multiple}
                    onChange={(e) => onChange(`${idx}.multiple`, e)}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Space>
                <Row gutter={[16, 16]}>
                  {field.multiple && (
                    <Col span={12}>
                      <Space
                        direction="vertical"
                        size={3}
                        style={{ width: "100%" }}
                      >
                        <div style={{ display: "flex" }}>
                          <Text type="secondary" style={{ width: "50%" }}>
                            Min:
                          </Text>
                          <Text type="secondary">Max:</Text>
                        </div>
                        <Input.Group compact>
                          <InputNumber
                            min={0}
                            max={field.max}
                            size="small"
                            style={{ width: "50%" }}
                            value={field.min}
                            onChange={(e) => onChange(`${idx}.min`, e)}
                          />
                          <InputNumber
                            min={field.min}
                            max={50}
                            size="small"
                            style={{ width: "50%" }}
                            value={field.max}
                            onChange={(e) => onChange(`${idx}.max`, e)}
                          />
                        </Input.Group>
                      </Space>
                    </Col>
                  )}
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space
                      direction="vertical"
                      size={3}
                      style={{ width: "100%" }}
                    >
                      <Text type="secondary">Metadata :</Text>
                      <Select
                        allowClear
                        size="small"
                        style={{ width: "100%" }}
                        value={field.metadata}
                        options={[
                          {
                            label: "Application name",
                            value: "application-name",
                          },
                          { label: "Author", value: "author" },
                          { label: "Description", value: "description" },
                          { label: "Keywords", value: "keywords" },
                        ]}
                        onChange={(e) => onChange(`${idx}.metadata`, e)}
                      />
                    </Space>
                  </Col>
                </Row>
              </Col>
              {field.type === ContainerFieldType.OPTION && (
                <Col span={8}>
                  <Card title="options" size="small">
                    <OptionList
                      value={field.options}
                      onChange={(e) => onChange(`${idx}.options`, e)}
                      errors={errors?.[idx].options}
                    />
                  </Card>
                </Col>
              )}
            </Row>

            <Space direction="vertical">
              <Space></Space>

              <Space>
                {/* <Space direction="vertical" size={3} style={{ flex: 1 }}>
                  <Text type="secondary">Title :</Text>
                  <Input size="small" status="error" style={{ width: 172 }} />
                  <Text type="danger">Title is required</Text>
                </Space> */}
              </Space>
            </Space>
          </Panel>
        </Collapse>
      ))}

      <Button
        size="small"
        type="primary"
        icon={<PlusOutlined />}
        onClick={addField}
      >
        Add field
      </Button>
    </Space>
  );
};

interface OptionListProps {
  value: Options<string>;
  onChange(value: Options<string>): void;
  errors: Options<string>;
}

const OptionList = ({ value, onChange }: OptionListProps) => {
  const onAdd = () => onChange([...value, { label: "", value: "" }]);

  const onRemove = () => {};

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      {!!value.length && (
        <div style={{ display: "flex" }}>
          <Text type="secondary" style={{ width: "calc(50% - 12px)" }}>
            Label:
          </Text>
          <Text type="secondary">Value:</Text>
        </div>
      )}

      {value.map((option, idx) => {
        const onLabelChange = () => {};

        const onValueChange = () => {};

        return (
          <Input.Group key={idx} compact style={{ width: "100%" }}>
            <Input
              size="small"
              style={{ width: "calc(50% - 12px)" }}
              value={option.label}
              // onChange={onChange}
              // status={errors?.[idx] ? "error" : undefined}
            />
            <Input
              size="small"
              style={{ width: "calc(50% - 12px)" }}
              value={option.value}
              // onChange={onChange}
              // status={errors?.[idx] ? "error" : undefined}
            />
            <Button
              size="small"
              type="primary"
              danger
              icon={<DeleteOutlined />}
              // onClick={() => handleRemove(idx)}
            />
          </Input.Group>
        );
      })}

      <Button
        size="small"
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
      >
        Add option
      </Button>
    </Space>
  );
};

interface DefaultFieldProps<T> {
  type: ContainerFieldType;
  multiple: boolean;
  value: T;
  onChange(value: T): void;
  options?: Options<T>;
}

const DefaultField = <T,>({ type, multiple }: DefaultFieldProps<T>) => {
  return <Input disabled size="small" style={{ width: "100%" }} />;
};
