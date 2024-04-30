import { useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Form, Spin } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import {
    InboxOutlined
} from '@ant-design/icons';


function VideosTranscription() {
    const [data, setData] = useState(null);
    const [showSpin, setShowSpin] = useState(false);
    const [form] = Form.useForm();

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

    return (
        <Col span={20} style={{ textAlign: 'center' }}>
            {showSpin ?
                (
                    <div style={{ marginTop: 400 }}><Spin></Spin></div>
                ) :
                (
                    !data ? (
                        <Form style={{ width: "100%" }} form={form} onFinish={retrieveData}>
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
                            <div style={{ margin: "auto", padding: 50, textAlign: 'left', maxWidth: 1200 }}>
                                <p style={{ fontSize: 20 }}>Transcription</p>
                                <p >{data.transcription}</p>
                                <p style={{ fontSize: 20 }}>Summary</p>
                                <p>{transcriptionDetails?.transcription_summary}</p>

                                <p style={{ fontSize: 20 }}>Book Recommendations</p>

                                {transcriptionDetails?.book_recommendations?.map((book) => (

                                    <Card bordered={false} style={{ width: 400 }}>
                                        <h3>{book.book_title}</h3>
                                        <p >{book.book_summary}</p>
                                    </Card>

                                ))}


                            </div>
                        )
                )
            }

        </Col>
    );
}

export default VideosTranscription;
