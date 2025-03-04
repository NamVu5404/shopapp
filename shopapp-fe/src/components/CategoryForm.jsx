import { Form, Input, Select } from "antd";
import MyButton from "./MyButton";
import { useEffect } from "react";
import { useSuppliers } from "../context/SupplierContext";

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
    value: supplier.id,
    label: supplier.name,
    key: supplier.id,
  }));

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        code: initValues.code,
        name: initValues.name,
        suppliers: initValues.suppliers
          ? initValues.suppliers.map((supplier) => supplier.id)
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
    <>
      <Form
        form={form}
        onFinish={onSubmit}
        style={{ marginBottom: 10, maxWidth: 450, minWidth: 300 }}
        initialValues={initValues}
      >
        {!isUpdate && (
          <Form.Item name="code">
            <Input required placeholder="code" />
          </Form.Item>
        )}

        <Form.Item name="name">
          <Input required placeholder="name" />
        </Form.Item>

        {isCategory && (
          <Form.Item name="suppliers">
            <Select
              mode="multiple"
              placeholder="Please select suppliers"
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: 20,
              }}
              options={options || []}
            />
          </Form.Item>
        )}

        <Form.Item>
          <MyButton style={{ width: "100%" }} htmlType="submit">
            {submitButtonText}
          </MyButton>
        </Form.Item>
      </Form>
    </>
  );
}
