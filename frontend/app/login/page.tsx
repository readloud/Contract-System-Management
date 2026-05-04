'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { login } from '@/lib/api/auth';

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      message.success('Login berhasil!');
      router.push('/dashboard');
    } catch (error) {
      message.error('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-96 shadow-xl">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-1">
            CMS Indonesia
          </Title>
          <Typography.Text type="secondary">
            Contract Management System
          </Typography.Text>
        </div>

        <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Masukkan email!' }, { type: 'email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Masukkan password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Masuk
            </Button>
          </Form.Item>

          <div className="text-center">
            <Link href="/register" className="text-blue-500 hover:text-blue-600">
              Belum punya akun? Daftar
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}