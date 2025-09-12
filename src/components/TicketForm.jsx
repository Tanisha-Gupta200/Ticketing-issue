import { Formik, Form } from "formik";
import { Input, Button, Select, Row, Col, Typography, Divider } from "antd";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FormOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const schema = z.object({
  title: z.string().min(3, "Title must be at least of 3 characters"),
  description: z
    .string()
    .min(5, "Description must be at least of 5 characters"),
  priority: z.enum(["Low", "Medium", "High"]),
});

export default function TicketForm({ onCreate, onCancel }) {
  return (
    <div className="bg-white p-[20px]">
      <Title level={4} style={{ textAlign: "center", marginBottom: "20px" }}>
        <FormOutlined /> Create New Ticket
      </Title>
      <Divider style={{ margin: "0 0 20px 0" }} />

      <Formik
        initialValues={{ title: "", description: "", priority: "Low" }}
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={(values, { resetForm }) => {
          onCreate(values);
          resetForm();
        }}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          resetForm,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input
                  name="title"
                  placeholder="Ticket Title"
                  value={values.title}
                  onChange={handleChange}
                  size="large"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                />
                {touched.title && errors.title && (
                  <div className="text-red-500 mt-1">{errors.title}</div>
                )}
              </Col>

              <Col span={24}>
                <TextArea
                  name="description"
                  rows={5}
                  placeholder="Ticket Description"
                  value={values.description}
                  onChange={handleChange}
                  size="large"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                />
                {touched.description && errors.description && (
                  <div className="text-red-500 mt-1">{errors.description}</div>
                )}
              </Col>

              <Col span={24}>
                <Select
                  name="priority"
                  value={values.priority}
                  onChange={(val) => setFieldValue("priority", val)}
                  size="large"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    size="large"
                    onClick={() => {
                      resetForm();
                      onCancel();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
}
