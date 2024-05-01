import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import Markdown from 'react-markdown';
import { createRoot } from 'react-dom/client';

function GeneralQuestions() {
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState(null);
    const [showSpin, setShowSpin] = useState(false);
    const [form] = Form.useForm();

    const retrieveData = async ({ searchField }) => {
        try {
            setShowSpin(true);
            setSearchInput(searchField);
            form.resetFields();
            const data = await axios.post('http://localhost:5000', { search: searchField });
            setData({ message: data?.data?.message?.content });
        }
        catch (err) {
            setData({ message: err });
        }
        finally {
            setShowSpin(false);
        }
    }

    return (
        <Col span={20}>
            <Row style={{ height: "85%" }}>
                {showSpin ?
                    <div style={{ margin: "auto" }}><Spin></Spin></div>
                    :
                    data ?
                        <div style={{ margin: "auto", padding: 50, textAlign: 'left', maxWidth: 800 }}>
                            <h3>Question:</h3>
                            <p> {searchInput}</p>
                            <h3>Answer:</h3>
                            <Markdown>{data.message}</Markdown>

                        </div>
                        :
                        <div style={{ margin: "auto", padding: 50, textAlign: 'left', maxWidth: 800 }}>
                            <p>Hi! How can I help you today?</p>
                        </div>

                }
            </Row>
            <Row style={{ height: "15%", width: "100%", padding: 10 }}>
                <Form style={{ width: "100%" }} form={form} onFinish={retrieveData}>
                    <Form.Item style={{ marginBottom: 0 }} name="searchField"><Input ></Input></Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}><Button type="primary" htmlType="submit">Submit</Button></Form.Item>
                </Form>
            </Row>
        </Col>
    );
}

export default GeneralQuestions;
