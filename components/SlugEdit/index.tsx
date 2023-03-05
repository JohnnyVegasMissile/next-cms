import { Button, Input, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Fragment } from "react";

const MAX_SLUG_SIZE = 3;

interface SlugEditProps {
  value: string[];
  onChange(value: string[]): void;
  errors: string[] | undefined;
}

const SlugEdit = ({ value, onChange, errors }: SlugEditProps) => {
  const lastSlugIndex = value.length - 1;

  const addSlug = () => {
    let newValue = [...value];
    newValue.splice(lastSlugIndex, 0, "");

    onChange(newValue);
  };

  const removeSlug = () => {
    let newValue = [...value];
    newValue.splice(lastSlugIndex - 1, 1);

    onChange(newValue);
  };

  const onSlugChange = (index: number, slug: string) => {
    let newValue = [...value];
    newValue[index] = slug;

    onChange(newValue);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "0.25rem",
        flexWrap: "wrap",
      }}
    >
      {value.map((slug, idx) => (
        <Fragment key={idx}>
          {idx === lastSlugIndex && (
            <Input.Group compact style={{ width: "fit-content" }}>
              <Button
                size="small"
                onClick={removeSlug}
                icon={<MinusOutlined />}
                disabled={value.length < 2}
              />
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={addSlug}
                disabled={value.length > MAX_SLUG_SIZE}
              />
            </Input.Group>
          )}
          <Input
            size="small"
            style={{ flex: 1, maxWidth: 180 }}
            status={errors?.[idx] ? "error" : undefined}
            // style={{
            //   minWidth: 200,
            // }}
            value={slug}
            onChange={(e) => onSlugChange(idx, e.target.value)}
          />
          {lastSlugIndex - 1 > idx && "/"}
        </Fragment>
      ))}
    </div>
  );
};

export default SlugEdit;
