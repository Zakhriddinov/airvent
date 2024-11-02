import { useState, useEffect } from 'react';
import { Divider } from 'antd';

import { Button, Row, Col, Descriptions, Statistic, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { EditOutlined, FilePdfOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useNavigate } from 'react-router-dom';
import { tagColor } from '@/utilities/statusTagColor';
import { moneyFormatter } from '../../utilities/dataStructure';
const Item = ({ item, currentErp }) => {
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={6}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName ?? item.product.name}</strong>
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p style={{ marginBottom: 5 }}>{item?.unit ?? item?.product?.quantityUnit}</p>
      </Col>
      <Col className="gutter-row" span={3}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {moneyFormatter({ amount: item?.price ?? 0, currency_code: currentErp?.currency })}
        </p>
      </Col>
      <Col className="gutter-row" span={3}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.discount}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {moneyFormatter({ amount: item?.total ?? 0, currency_code: currentErp?.currency })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    if (currentResult) {
      const { items, invoice, ...others } = currentResult;

      if (items) {
        setItemsList(items);
        setCurrentErp(currentResult);
      } else if (invoice.items) {
        setItemsList(invoice.items);
        setCurrentErp({ ...invoice.items, ...others, ...invoice });
      }
    }
    return () => {
      setItemsList([]);
      setCurrentErp(resetErp);
    };
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/client/invoice`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
        ghost={false}
        tags={[
          <Tag color={tagColor(currentErp.status)?.color} key="status">
            {tagColor(currentErp.status)?.label}
          </Tag>,
          currentErp.paymentStatus && (
            <Tag color={tagColor(currentErp.paymentStatus)?.color} key="paymentStatus">
              {tagColor(currentErp.paymentStatus)?.label}
            </Tag>
          ),
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/client/invoice`);
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
          // <Button
          //   key={`${uniqueId()}`}
          //   onClick={() => {
          //     dispatch(erp.convert({ entity, id: currentErp._id }));
          //   }}
          //   icon={<RetweetOutlined />}
          //   style={{ display: entity === 'quote' ? 'inline-block' : 'none' }}
          // >
          //   {'Convert to Invoice'}
          // </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/clientinvoice/update/${currentErp._id}`);
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
          <Statistic title="Holat" value={tagColor(currentErp.status)?.label} />
          {/* <Statistic
            title={'Umumiy'}
            value={moneyFormatter({
              amount: currentErp.subTotal,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          /> */}
          <Statistic
            title={'Umumiy'}
            value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={"To'langan"}
            value={moneyFormatter({
              amount: currentErp.credit,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Mijoz : ${currentErp?.client?.name}`}>
        {/* <Descriptions.Item label={'Address'}>{client?.address || ''}</Descriptions.Item>
        <Descriptions.Item label={'email'}>{client?.email || ''}</Descriptions.Item>*/}
        <Descriptions.Item label={'Telefon raqam'}>
          {currentErp?.client?.phone || '+998 __ ___ __ __'}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={6}>
          <p>
            <strong>Mahsulot</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>
            <strong>Birlik</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>Miqdor</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>Narx</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>Chegirma (%)</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>Umumiy</strong>
          </p>
        </Col>
        <Divider />
      </Row>
      {itemslist.map((item) => (
        <Item key={item._id} item={item} currentErp={currentErp}></Item>
      ))}
      <div
        style={{
          width: '300px',
          float: 'right',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          {/* <Col className="gutter-row" span={12}>
            <p>Umumiy :</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.subTotal, currency_code: currentErp.currency })}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {'Tax Total'} ({currentErp?.taxRate ?? 0} %) :
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: 0, currency_code: currentErp.currency })}
            </p>
          </Col> */}
          <Col className="gutter-row" span={12}>
            <p>{'Umumiy'} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
