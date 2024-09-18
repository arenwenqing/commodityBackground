import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, DatePicker, Upload, Button, message, Typography, Divider, Tooltip } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AddCommodity = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    const mainParam = {}
    Object.keys(values).forEach(key => {
      if (key === 'onSaleTime' || key === 'offlineTime') {
        formData.append(key, values[key].unix() * 1000);
        mainParam[key] = values[key].unix() * 1000;
      } else if (key === 'mainPhotos' || key === 'detailPhotos') {
        values[key]?.forEach(file => {
          formData.append(key, file.originFileObj);
        });
      } else if (key === 'productLabelIdList') {
        formData.append(key, JSON.stringify(values[key]));
        mainParam[key] = JSON.stringify(values[key]);
      } else {
        formData.append(key, values[key]);
        mainParam[key] = values[key];
      }
    });
    console.log(mainParam)
    console.log(formData)
    try {
      const response = await axios.post('https://tuanzhzh.com/mini/product/add', {
        addProductRequestStr: JSON.stringify(mainParam),
        mainPhotos: values['mainPhotos'],
        detailPhotos: values['detailPhotos']
      }, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      message.success('商品添加成功');
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('商品添加失败');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      padding: '40px 20px', 
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    }}>
      <Title level={2} style={{ marginBottom: 30, textAlign: 'center' }}>添加新商品</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        name='addProductRequestStr'
      >
        <Divider orientation="left">基本信息</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="majorName" label="商品主名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="minorName" label="副名称">
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item name="category1" label="顶层分类" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Option value="category1">分类1</Option>
              <Option value="category2">分类2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category2" label="次级分类">
            <Select placeholder="请选择">
              <Option value="subcategory1">子分类1</Option>
              <Option value="subcategory2">子分类2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category3" label="末级分类">
            <Select placeholder="请选择">
              <Option value="leafcategory1">末级分类1</Option>
              <Option value="leafcategory2">末级分类2</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="productLabelIdList" label="商品标签">
          <Select mode="tags" style={{ width: '100%' }} placeholder="请选择或输入商品标签">
            <Option value="tag1">标签1</Option>
            <Option value="tag2">标签2</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">商品详情</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item name="brand" label="品牌">
            <Input />
          </Form.Item>
          <Form.Item name="saleUnit" label="出售单位">
            <Select placeholder="请选择">
              <Option value="卷">卷</Option>
              <Option value="个">个</Option>
              <Option value="盒">盒</Option>
            </Select>
          </Form.Item>
          <Form.Item name="spec" label="规格">
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="originPlace" label="产地">
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Divider orientation="left">价格与时间</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item name="price" label="价格(分)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="finalCashbackRatio"
            label={
              <span>
                最终红包金额比例 
                <Tooltip title="输入0-100之间的数值，表示百分比">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isBlindBox" label="是否活动商品" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="onSaleTime" label="上架时间" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="offlineTime" label="下架时间" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="productChannel" label="产品渠道" initialValue={1} hidden>
          <InputNumber disabled />
        </Form.Item>

        <Divider orientation="left">商品图片</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="mainPhotos"
            label="主图"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传主图</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="detailPhotos"
            label="详情图"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传详情图</div>
              </div>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '40px', fontSize: '16px' }}>
            提交商品信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCommodity;