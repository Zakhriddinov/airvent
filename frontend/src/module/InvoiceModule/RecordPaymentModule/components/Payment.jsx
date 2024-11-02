import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Tag, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { generate as uniqueId } from 'shortid';

import RecordPayment from './RecordPayment';
import { tagColor } from '@/utilities/statusTagColor';
import { useNavigate } from 'react-router-dom';
import { moneyFormatter } from '@/utilities/dataStructure';

export default function Payment({ config, currentItem }) {
  const { entity, ENTITY_NAME } = config;
  const navigate = useNavigate();

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(currentItem);

  const [client, setClient] = useState({});
  useEffect(() => {
    if (currentErp?.supplier) {
      setClient(currentErp.supplier[currentErp.supplier.type]);
    }
  }, [currentErp]);
  
  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { items } = currentItem;

      setItemsList(items);
      setCurrentErp(currentItem);
    }
    return () => controller.abort();
  }, [currentItem]);

  useEffect(() => {
    console.info('itemslist', itemslist);
  }, [itemslist]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 20, push: 2 }}
        >
          <PageHeader
            onBack={() => navigate(`/supplier/invoice`)}
            title={`Hisob faktura to'lovni kiritish # ${currentErp.number}/${
              currentErp.year || ''
            }`}
            ghost={false}
            tags={
              <Tag color={tagColor(currentErp.paymentStatus)?.color}>
                {currentErp.paymentStatus && tagColor(currentErp.paymentStatus)?.label}
              </Tag>
            }
            // subTitle="This is cuurent erp page"
            extra={[
              <Button
                key={`${uniqueId()}`}
                onClick={() => {
                  navigate(`/supplier/invoice`);
                }}
                icon={<CloseCircleOutlined />}
              >
                {'Bekor qilish'}
              </Button>
            ]}
            style={{
              padding: '20px 0px',
            }}
          ></PageHeader>
          <Divider dashed />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 10, order: 2, push: 2 }}
          lg={{ span: 10, order: 2, push: 4 }}
        >
          <div className="space50"></div>
          <Descriptions title={`Mijoz  : ${currentErp?.supplier?.name}`} column={1}>
            <Divider dashed />
            <Descriptions.Item label={"To'lov holati"}>
              <Tag color={tagColor(currentErp.paymentStatus)?.color}>
                {tagColor(currentErp.paymentStatus)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={'Jami'}>
              {moneyFormatter({
                amount: currentErp.subTotal,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label={'Umumiy'}>
              {moneyFormatter({
                amount: currentErp.total,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label={'Balans'}>
              {moneyFormatter({
                amount: currentErp.credit,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 10, order: 1, push: 2 }}
        >
          <RecordPayment config={config} />
        </Col>
      </Row>
    </>
  );
}
