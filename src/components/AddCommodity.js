import React, { useEffect, useState } from 'react';
import { Form, Input, Space, InputNumber, Select, Switch, DatePicker, Upload, Button, message, Typography, Divider, Tooltip,Image } from 'antd';
import { UploadOutlined, InfoCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
// import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const AddCommodity = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [firstKind, setFirstKind] = useState([]);
  const [secondKind, setSecondKind] = useState([]);
  const [thirdKind, setThirdKind] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    const mainParam = {}
    console.log('values===', values)
    Object.keys(values).forEach(key => {
      if (key === 'onSaleTime' || key === 'offlineTime') {
        // formData.append(key, values[key].unix() * 1000);
        mainParam[key] = values[key].unix() * 1000;
      } else if (key === 'mainPhotos' || key === 'detailPhotos') {
        values[key]?.forEach(file => {
          formData.append(key, file.originFileObj);
        });
      } else {
        // formData.append(key, values[key]);
        mainParam[key] = values[key];
      }
    });
    // formData.append('addProductRequestStr', JSON.stringify(mainParam));
    console.log(mainParam)
    try {
      const response = await axios.post(`https://tuanzhzh.com/mini/product/add?addProductRequestStr=${encodeURIComponent(JSON.stringify(mainParam))}`, formData);
      if (response.data.code == '0') {
        message.success('商品添加成功');
        // form.resetFields();
      }
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

  // 获取标签列表
  const getLabelList = () => {
    axios.get('https://tuanzhzh.com/mini/product/label/list').then(res => {
      setLabelList(res.data.data || []);
    }, error => {
      console.error(error);
    })
  }

  // 二级分类改变
  const secondKindChange = (value) => {
    getKind(value).then(res => {
      setThirdKind(res.data.data || []);
    }, error => {
      console.error(error);
    })
  }
  // 一级分类改变
  const firstKindChange = (value) => {
    getKind(value).then(res => {
      setSecondKind(res.data.data || []);
    }, error => {
      console.error(error);
    })
  }

  // 获取分类
  const getKind = (id) => {
    return axios.get(`https://tuanzhzh.com/mini/product/category/list?parentId=${id}`)
  }

  // 上传详情图的预览操作
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  }

  // 上传详情图的变化检测
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  // 多个图后面的上传按钮
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传详情图
      </div>
    </button>
  );

  useEffect(() => {
    getKind('').then(res => {
      setFirstKind(res.data.data || []);
    }, err => {
      console.error(err);
    })
    getLabelList()
  }, [])

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
            <Select placeholder="请选择" onChange={firstKindChange}>
              {
                firstKind.map((item, i) => {
                  return <Option value={item.id} key={i}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="category2" label="次级分类">
            <Select placeholder="请选择" onChange={secondKindChange}>
            {
                secondKind.map((item, i) => {
                  return <Option value={item.id} key={i}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="category3" label="末级分类">
            <Select placeholder="请选择">
            {
                thirdKind.map((item, i) => {
                  return <Option value={item.id} key={i}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="productLabelIdList" label="商品标签">
          <Select mode="tags" style={{ width: '100%' }} placeholder="请选择或输入商品标签">
            {
              labelList.map((item, i) => {
                return <Option value={item.labelId} key={i}>{item.labelName}</Option>
              })
            }
          </Select>
        </Form.Item>

        <Divider orientation="left">商品详情</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item name="brand" label="品牌">
            <Input />
          </Form.Item>
          <Form.Item name="saleUnit" label="出售单位">
            <Input placeholder='请输入' />
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

        <Divider orientation="left">商品sku</Divider>
        <Form.List name="productSourceList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    position: 'relative',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
                    <Form.Item name={[name, 'sourceProductName']} label="商品名称" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name={[name, 'sourceProductCount']} label="商品数量" rules={[{ required: true }]}>
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'sourceProductSpec1']} label="商品规格1">
                      <Input />
                    </Form.Item>
                    <Form.Item name={[name, 'sourceProductSpec2']} label="商品规格2" >
                      <Input min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'sourceProductId']} label="1688ID" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name={[name, 'sourceProductPrice']} label="进价" rules={[{ required: true }]}>
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ position: 'absolute', top: 39 }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        
        <Divider orientation="left">价格与时间</Divider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item name="price" label="价格(分)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item name="isBlindBox" label="是否活动商品" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="cashbackRatio"
            label={
              <span>
                用户购买商品的返现红包金额比例 
                <Tooltip title="输入0-100之间的数值，表示百分比">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="tlCashbackRatio"
            label={
              <span>
                开团用户红包金额比例 
                <Tooltip title="输入0-100之间的数值，表示百分比">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
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
              accept=".png,.jpeg,.jpg,.gif"
              multiple={true}
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
              fileList={fileList}
              beforeUpload={() => false}
              multiple={true}
              onPreview={handlePreview}
              onChange={handleChange}
              accept=".png,.jpeg,.jpg,.gif"
            >
              { uploadButton}
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: 'none',
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
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