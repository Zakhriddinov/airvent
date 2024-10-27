import dayjs from 'dayjs';
import { Switch, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { generate as uniqueId } from 'shortid';
import color from '@/utilities/color';

export const moneyFormatter = ({ amount, currency_code = 'UZS' }) => {
  // Mintaqani valyuta kodiga qarab aniqlash
  const locale = currency_code === 'USD' ? 'en-US' : 'uz-UZ';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency_code,
    minimumFractionDigits: 2, // To display up to two decimal places
  }).format(amount);
};

export const dataForRead = ({ fields }) => {
  let columns = [];

  Object.keys(fields).forEach((key) => {
    let field = fields[key];
    columns.push({
      title: field.label ? field.label : key,
      dataIndex: field.dataIndex ? field.dataIndex.join('.') : key,
      isDate: field.type === 'date',
    });
  });

  return columns;
};

export function dataForTable({ fields, translate, dateFormat }) {
  let columns = [];

  Object.keys(fields).forEach((key, index) => {
    let field = fields[key];
    const keyIndex = field.dataIndex ? field.dataIndex : [key];

    const component = {
      boolean: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        onCell: () => ({
          props: {
            style: {
              width: '60px',
            },
          },
        }),
        render: (_, record) => (
          <Switch
            checked={record[key]}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        ),
      },
      date: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record) => {
          const date = dayjs(record[key]).format(dateFormat);
          return (
            <Tag bordered={false} color={field.color}>
              {date}
            </Tag>
          );
        },
      },
      currency: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        onCell: () => {
          return {
            style: {
              textAlign: 'right',
              whiteSpace: 'nowrap',
              color: field?.style?.color,
            },
          };
        },
        render: (_, record) => {
          return (
            <div style={record[key] < 0 ? { color: 'red' } : {}}>
              {moneyFormatter({ amount: record[key], currency_code: record.currency })}
            </div>
          );
        },
      },
      async: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={field.color || record[key]?.color || record.color}>
              {text}
            </Tag>
          );
        },
      },
      color: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={text}>
              {color.find((x) => x.value === text)?.label}
            </Tag>
          );
        },
      },
      stringWithColor: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={record.color || field.color}>
              {text}
            </Tag>
          );
        },
      },
      tag: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record) => {
          return (
            <Tag bordered={false} color={field.color}>
              {record[key] && record[key]}
            </Tag>
          );
        },
      },
      selectWithFeedback: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (text, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && record[key]}
              </Tag>
            );
          } else return record[key] && record[key];
        },
      },
      select: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && record[key]}
              </Tag>
            );
          } else return record[key] && record[key];
        },
      },
      selectWithTranslation: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && record[key]}
              </Tag>
            );
          } else return record[key] && record[key];
        },
      },
      array: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record) => {
          return record[key].map((x) => (
            <Tag bordered={false} key={`${uniqueId()}`} color={field.colors[x]}>
              {x}
            </Tag>
          ));
        },
      },
      index: {
        title: field.label ? field.label : key,
        dataIndex: keyIndex,
        render: (_, record, index) => {
          return index + 1;
        },
      },

      // quantity: {
      //   title: field.label ? field.label : key,
      //   dataIndex: keyIndex,
      //   render: (_, record) => {
      //     return (
      //       <span>
      //         {record[key]} {/* <Tag bordered={false} color={"slategray"}> */}
      //         {record[`${key}Unit`]}
      //         {/* </Tag> */}
      //       </span>
      //     );
      //   },
      // },
    };

    const defaultComponent = {
      title: field.label ? field.label : key,
      dataIndex: keyIndex,
    };

    const type = field.type;

    if (!field.disableForTable) {
      Object.keys(component).includes(type)
        ? columns.push(component[type])
        : columns.push(defaultComponent);
    }
  });

  return columns;
}
