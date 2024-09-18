import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
const { Title } = Typography;

const Login = () => {
  const [open, setOpen] = useState(false)
  const history = useHistory();
  const onFinish = (values) => {
    console.log('Login values:', values);
    // 这里应该调用登录API，现在我们只是模拟登录成功
    if (values.username === 'renwenqingzhenshuai' && values.password === 'bixushuai') {
      history.push('/addCommodity');
    } else {
      setOpen(true)
    }
  };

  const hideModal = () => {
    setOpen(false)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Modal
        title="错误提示"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
      >
        <p>我草，真笨错了重新输入吧</p>
      </Modal>
      <Card style={{ width: 350, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>管理平台登录</Title>
        <Form
          name="login"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;