import { useState } from 'react';
import axios from 'axios';
import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import {
    InboxOutlined
} from '@ant-design/icons';

function VideosTranscription() {
    const [data, setData] = useState(null);
    const [showSpin, setShowSpin] = useState(false);
    const [open, setOpen] = useState(false);
    const retrieveData = async (e) => {
        setShowSpin(true);
        let formData = new FormData();
        formData.append('audFile', e.file);

        try {
            const headers = {
                'Content-Type': 'multipart/form-data',
            };

            const response = await axios.post('http://localhost:5000/transcribe', formData, { headers });

            setData(response.data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setShowSpin(false);
        }
    }
    const transcriptionDetails = data ? JSON.parse(data?.summary?.message?.function_call?.arguments) : null;
    const handleSubmit = () => {
        setOpen(true);
    }
    const handleOnOk = () => {
        setOpen(false);
    }
    return (
        <Col span={20} style={{ textAlign: 'center' }}>
            {showSpin ?
                (
                    <div style={{ marginTop: 400 }}><Spin></Spin></div>
                ) :
                (
                    !data ? (
                        <Form style={{ width: "100%" }} onFinish={retrieveData}>
                            <Form.Item style={{ marginBottom: 0 }} name="file" getValueFromEvent={({ file }) => file.originFileObj}>
                                <Dragger maxCount={1} accept='audio/mp3'>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for audio files up to 30s long.
                                    </p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}><Button type="primary" htmlType="submit">Submit</Button></Form.Item>
                        </Form>
                    )
                        : (
                            <Form style={{ margin: "auto", padding: 50, textAlign: 'left', maxWidth: 1200 }}>

                                <Form.Item>
                                    <p style={{ fontSize: 20 }}>Transcription</p>
                                    <Input.TextArea style={{ minHeight: 180 }} defaultValue={data.transcription} allowClear>
                                    </Input.TextArea>
                                </Form.Item>

                                <Form.Item>
                                    <p style={{ fontSize: 20 }}>Summary</p>
                                    <Input.TextArea style={{ minHeight: 180 }} defaultValue={transcriptionDetails?.transcription_summary} allowClear>

                                    </Input.TextArea>

                                </Form.Item>
                                <Form.Item name="bookRecommendations">
                                    <p style={{ fontSize: 20 }}>Book Recommendations</p>

                                    <Checkbox.Group>
                                        <Row>
                                            {transcriptionDetails?.book_recommendations?.map((book) => (
                                                <Col key={book.book_title} span={8}>
                                                    <Card bordered={false} style={{ maxWidth: 350, height: 300 }}>
                                                        <h3>{book.book_title}</h3>
                                                        <p >{book.book_summary}</p>
                                                        <span>By: {book.book_author}</span>
                                                    </Card>
                                                    <Checkbox value={book.book_title} style={{ lineHeight: '32px' }}>
                                                    </Checkbox>
                                                </Col>

                                            ))}


                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Form.Item>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </Form.Item>
                            </Form>

                        )
                )
            }
            <Modal
                title="Submit transcription"
                open={open}
                onOk={handleOnOk}
                onCancel={handleOnOk}
            // okButtonProps={{ disabled: true }}
            // cancelButtonProps={{ disabled: true }}
            >
                <p>Submit transcription?</p>
            </Modal>
        </Col>
    );
}

export default VideosTranscription;
