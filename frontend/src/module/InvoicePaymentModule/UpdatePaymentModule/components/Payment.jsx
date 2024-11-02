import { useState, useEffect } from 'react';
import { Button, Row, Col, Descriptions, Tag, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { generate as uniqueId } from 'shortid';
import { useNavigate } from 'react-router-dom';
import UpdatePayment from './UpdatePayment';
import { tagColor } from '@/utilities/statusTagColor';
import { moneyFormatter } from '@/utilities/dataStructure';

export default function Payment({ config, currentItem }) {
  const { entity, ENTITY_NAME } = config;
  const navigate = useNavigate();
  const [currentErp, setCurrentErp] = useState(currentItem);

  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { invoice, _id, ...others } = currentItem;
      console.log(invoice);

      setCurrentErp({ ...others, ...invoice, paymentId: _id });
    }
    return () => controller.abort();
  }, [currentItem]);

  const [client, setClient] = useState({});

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client[currentErp.client.type]);
    }
  }, [currentErp]);

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
            onBack={() => navigate(`/supplier/payment`)}
            title={`To'lovni yangilash # ${currentErp.number}/${currentErp.year || ''}`}
            ghost={false}
            tags={
              <Tag color={tagColor(currentErp.paymentStatus)?.color}>
                {tagColor(currentErp.paymentStatus)?.label}
              </Tag>
            }
            extra={[
              <Button
                key={`${uniqueId()}`}
                onClick={() => {
                  navigate(`/supplier/payment`);
                }}
                icon={<CloseCircleOutlined />}
              >
                Bekor qilish
              </Button>,
              <Button
                key={`${uniqueId()}`}
                onClick={() => navigate(`/supplierpayment/read/${currentErp._id}`)}
                icon={<FileTextOutlined />}
              >
                Hisob-fakturani ko'rish
              </Button>,
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
          <Descriptions title={`Yetkazib beruvchi : ${currentErp.supplier.name}`} column={1}>
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
            <Descriptions.Item label="Balans">
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
          <UpdatePayment config={config} currentInvoice={currentErp} />
        </Col>
      </Row>
    </>
  );
}
