import { Cascader, Input, Select } from "antd";
import { LinkOutlined, GlobalOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./styles.scss";

const { Option } = Select;

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

export type LinkValue = {
  type: "IN" | "OUT";
  slugId?: string;
  link?: string;
  prototol?: "http" | "https";
};

interface LinkSelectProps {
  value: LinkValue;
  onChange(value: LinkValue): void;
}

const LinkSelect = ({ value, onChange }: LinkSelectProps) => {
  // const [type, setType] = useState<"in" | "out">("in");
  const { type, slugId, link, prototol } = value;

  const selectBefore = (
    <Select value={prototol}>
      <Option value="http">http://</Option>
      <Option value="https">https://</Option>
    </Select>
  );

  return (
    <div>
      {type === "IN" ? (
        <Cascader
          size="small"
          options={options}
          onChange={(e) => console.log(e)}
          placeholder="Please select"
          className="link-select-cascader"
          changeOnSelect
        />
      ) : (
        <Input
          value={link}
          addonBefore={selectBefore}
          size="small"
          placeholder="Please select"
          className="link-select-input"
          allowClear
        />
      )}
      <Select
        size="small"
        value={type}
        // onChange={setType}
        className="link-select-select"
      >
        <Option value="in">
          <LinkOutlined />
        </Option>
        <Option value="out">
          <GlobalOutlined />
        </Option>
      </Select>
    </div>
  );
  //    ;
};

export default LinkSelect;
