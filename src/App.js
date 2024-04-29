import { Col, Menu, Row } from 'antd';
import GeneralQuestions from './components/GeneralQuestions';
import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Link, Route, Routes } from 'react-router-dom';
import VideosTranscription from './components/VideosTranscription';
function App() {
  return (
    <div className="App" style={{ height: "100vh" }}>
      <Row style={{ background: "#2097f3", height: "10%", alignItems: "center" }}>
        <div style={{ width: "100%" }}>
          <span style={{ float: 'left', marginLeft: 20, color: "white", fontSize: 25 }}>E Learning Portal</span>
          <span style={{ color: "white", marginRight: 20, fontSize: 15, float: 'right' }}>Welcome User1</span>
        </div>
      </Row>
      <Row style={{ height: "90%" }}>
        <Col span={4}>
          <Menu
            style={{ height: '100%' }}
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            // inlineCollapsed={collapsed}
            items={[{
              key: '1',
              icon: <PieChartOutlined />,
              label: (<Link to="/">General Questions</Link>),

            }, {
              key: '2',
              icon: <AppstoreOutlined />,
              label: (<Link to="/videos">Video Lessons</Link>),
            }, {
              key: '3',
              icon: <DesktopOutlined />,
              label: 'Forums',
            }, {
              key: '4',
              icon: <MailOutlined />,
              label: 'FAQs',
            },]}
          />
        </Col>
        <Routes>
          <Route exact path="/" element={<GeneralQuestions />} />
          <Route exact path="videos" element={<VideosTranscription />} />
        </Routes>
      </Row>

    </div>
  );
}

export default App;
