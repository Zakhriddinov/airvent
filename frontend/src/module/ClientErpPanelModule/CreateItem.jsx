import { useState, useEffect } from 'react';

import { Button, Form, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';

import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';

import calculate from '@/utilities/calculate';
import { generate as uniqueId } from 'shortid';

import Loading from '@/components/Loading';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';
function SaveForm({ form }) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      Saqlash
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);

  const asyncList = () => {
    return request.listAll({ entity: 'products' });
  };

  const responseData = useFetch(asyncList);
  useEffect(() => {
    responseData?.isSuccess && setProductList(responseData?.result);
  }, [responseData?.isSuccess]);

  let { entity } = config;

  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);

  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subTotal = 0;
    let subOfferTotal = 0;
    console.log(items);

    if (items) {
      items.forEach((item) => {
        if (item) {
          if (item.offerPrice && item.quantity) {
            const offerPrice = parseFloat(item.offerPrice?.toString().replace(/,/g, '')) || 0;
            const offerTotal = calculate.multiply(item['quantity'], offerPrice);
            subOfferTotal = calculate.add(subOfferTotal, offerTotal);
          }
          if (item.quantity && item.price) {
            const price = item['price'];

            const calculateDiscount = price - (price * item['discount']) / 100;

            const total = calculate.multiply(item['quantity'], calculateDiscount);
            subTotal = calculate.add(subTotal, total);
          } else if (item.quantity && item.product) {
            const findProduct = productList.find((v) => v._id === item.product);
            const price = findProduct?.price ?? 0;

            const calculateDiscount = price - (price * item['discount']) / 100;

            const total = calculate.multiply(item['quantity'], calculateDiscount);
            subTotal = calculate.add(subTotal, total);
          }
        }
      });

      setSubTotal(subTotal);
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      setOfferSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => {};
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    console.log('🚀 ~ onSubmit ~ fieldsValue:', fieldsValue);
    if (fieldsValue) {
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];

        newList.map((item) => {
          if (item.product) {
            const findProduct = productList.find((v) => v._id === item.product);
            item['price'] = findProduct?.price;
          }
          delete item.isCustom;
          item.total = calculate.multiply(item.quantity, item.price);
        });
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        };
      }
    }
    dispatch(erp.create({ entity, jsonData: fieldsValue }));
  };
  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={'Yangi'}
        ghost={false}
        // tags={<Tag>{'Draft'}</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            Bekor qilish
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <CreateForm subTotal={subTotal} offerTotal={offerSubTotal} form={form} />
        </Form>
      </Loading>
    </>
  );
}
