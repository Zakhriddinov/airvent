import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Statistic, Tag, Divider, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { moneyFormatter } from '@/utilities/dataStructure';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { tagColor } from '@/utilities/statusTagColor';
import { useNavigate } from 'react-router-dom';

export default function ReadItem({ config, selectedItem }) {
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    supplier: {
      name: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client[currentErp.client.type]);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/supplier/payment`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
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
            Yopish
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            Pdf yuklab olish
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Tahrirlash
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic title="Holat" value={tagColor(currentErp.paymentStatus)?.label} />
          <Statistic
            title={"To'langan"}
            value={moneyFormatter({
              amount: currentErp.amount,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={'Jami'}
            value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Yetkazib beruvchi : ${currentErp.supplier.name}`}>
        <Descriptions.Item label={'Telefon raqam'}>
          {currentErp?.supplier?.phone || '+998 __ ___ __ __'}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>{"To'lov ma'lumotlari"} :</Typography.Title>
        </Col>
      </Row>
      <div
        style={{
          width: '300px',
          float: 'left',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{'Jami'} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{"To'langan"} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.amount, currency_code: currentErp.currency })}
            </p>
          </Col>

          {/* <Col className="gutter-row" span={12}>
            <p>{'Jami'} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col> */}

          {/* <Col className="gutter-row" span={12}>
            <p>{"Jami to'langan"} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.credit, currency_code: currentErp.currency })}
            </p>
          </Col> */}

          <Col className="gutter-row" span={12}>
            <p>{'Jami qolgan'} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({
                amount: currentErp.total - currentErp.credit,
                currency_code: currentErp.currency,
              })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
