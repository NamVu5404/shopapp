import { Divider, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useSuppliers } from "../context/SupplierContext";
import MyButton from "./MyButton";

export default function CategoryForm({
  initValues,
  onSubmit,
  submitButtonText,
  isUpdate,
  isCategory,
}) {
  const [form] = Form.useForm();
  const suppliers = useSuppliers();

  const options = suppliers.map((supplier) => ({
    value: supplier.code,
    label: supplier.name,
    key: supplier.code,
  }));

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        code: initValues.code,
        name: initValues.name,
        suppliers: initValues.suppliers
          ? initValues.suppliers.map((supplier) => supplier.code)
          : [],
      });
    }

    if (!isUpdate) form.resetFields();
  }, [initValues, form, isUpdate]);

  const handleChange = (value) => {
    form.setFieldsValue({
      suppliers: value,
    });
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        style={{ width: "100%" }}
        initialValues={initValues}
        requiredMark="optional"
      >
        {!isUpdate && (
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Vui lòng nhập code" }]}
          >
            <Input placeholder="Nhập code" />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        {isCategory && (
          <Form.Item name="suppliers" label="Suppliers">
            <Select
              mode="multiple"
              placeholder="Chọn nhà cung cấp"
              onChange={handleChange}
              style={{ width: "100%" }}
              options={options || []}
              optionFilterProp="label"
              allowClear
              showSearch
              maxTagCount={5}
              maxTagTextLength={10}
            />
          </Form.Item>
        )}

        <Divider style={{ margin: "16px 0" }} />

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <MyButton type="primary" htmlType="submit" style={{ minWidth: 120 }}>
            {submitButtonText}
          </MyButton>
        </Form.Item>
      </Form>
    </div>
  );
}
