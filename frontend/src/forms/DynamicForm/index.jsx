import { useState } from 'react';
import { DatePicker, Input, Form, Select, InputNumber, Switch, Tag } from 'antd';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
// import { useDate } from '@/settings';
// import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';
import { generate as uniqueId } from 'shortid';

// import { countryList } from '@/utils/countryList';
// import { selectLangDirection } from '@/redux/translate/selectors';

export default function DynamicForm({ fields, isUpdateForm = false }) {
  const [feedback, setFeedback] = useState();
  // const langDirection = useSelector(selectLangDirection);

  return (
    <div>
      {Object.keys(fields).map((key) => {
        let field = fields[key];

        if ((isUpdateForm && !field.disableForUpdate) || !field.disableForForm) {
          field.name = key;
          if (!field.label) field.label = key;
          if (field.hasFeedback)
            return (
              <FormElement feedback={feedback} setFeedback={setFeedback} key={key} field={field} />
            );
          else if (feedback && field.feedback) {
            if (feedback == field.feedback) return <FormElement key={key} field={field} />;
          } else {
            return <FormElement key={key} field={field} />;
          }
        }
      })}
    </div>
  );
}

function FormElement({ field, feedback, setFeedback }) {
  // const money = useMoney();
  // const { dateFormat } = useDate();

  const { TextArea } = Input;

  const SelectComponent = () => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        showSearch={field.showSearch}
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const SelectWithTranslationComponent = () => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              <Tag bordered={false} color={option.color}>
                {option.label}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const SelectWithFeedbackComponent = ({ feedbackValue, lanchFeedback }) => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        onSelect={(value) => lanchFeedback(value)}
        value={feedbackValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ColorComponent = () => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        showSearch
        defaultValue={field.defaultValue}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value} label={option.label}>
              <Tag bordered={false} color={option.color}>
                {option.label}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const TagComponent = () => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {option.label}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ArrayComponent = () => (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        mode={'multiple'}
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  // const CountryComponent = () => (
  //   <Form.Item
  //     label={translate(field.label)}
  //     name={field.name}
  //     rules={[
  //       {
  //         required: field.required || false,
  //         type: filedType[field.type] ?? 'any',
  //       },
  //     ]}
  //   >
  //     <Select
  //       showSearch
  //       defaultValue={field.defaultValue}
  //       optionFilterProp="children"
  //       filterOption={(input, option) =>
  //         (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  //       }
  //       filterSort={(optionA, optionB) =>
  //         (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
  //       }
  //       style={{
  //         width: '100%',
  //       }}
  //     >
  //       {countryList.map((language) => (
  //         <Select.Option
  //           key={language.value}
  //           value={language.value}
  //           label={translate(language.label)}
  //         >
  //           {language?.icon && language?.icon + ' '}
  //           {translate(language.label)}
  //         </Select.Option>
  //       ))}
  //     </Select>
  //   </Form.Item>
  // );

  // const SearchComponent = () => {
  //   return (
  //     <Form.Item
  //       label={translate(field.label)}
  //       name={field.name}
  //       rules={[
  //         {
  //           required: field.required || false,
  //           type: filedType[field.type] ?? 'any',
  //         },
  //       ]}
  //     >
  //       <AutoCompleteAsync
  //         entity={field.entity}
  //         displayLabels={field.displayLabels}
  //         searchFields={field.searchFields}
  //         outputValue={field.outputValue}
  //         withRedirect={field.withRedirect}
  //         urlToRedirect={field.urlToRedirect}
  //         redirectLabel={field.redirectLabel}
  //       ></AutoCompleteAsync>
  //     </Form.Item>
  //   );
  // };

  const InputWithUnitComponent = () => {
    const [unit, setUnit] = useState('kg');

    return (
      <Form.Item label={field.label} style={{ marginBottom: 0 }}>
        <Form.Item
          name={field.name}
          rules={[
            {
              required: field.required || false,
              type: filedType[field.type] ?? 'any',
            },
          ]}
          style={{ display: 'inline-block', width: 'calc(70% - 8px)' }}
        >
          <InputNumber placeholder="Enter value" style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item
          name={`${field.name}Unit`}
          initialValue={unit}
          style={{ display: 'inline-block', width: 'calc(30% - 8px)', marginLeft: '8px' }}
        >
          <Select defaultValue="kg" onChange={setUnit} style={{ width: '100%' }}>
            <Select.Option value="kg">kg</Select.Option>
            <Select.Option value="m">metr</Select.Option>
            <Select.Option value="l">litr</Select.Option>
            <Select.Option value="dona">dona</Select.Option>
            <Select.Option value="m2">m2</Select.Option>
          </Select>
        </Form.Item>
      </Form.Item>
    );
  };

  const CurrencyInput = () => {
    const [currency, setCurrency] = useState('UZS');

    // const handleCurrencyChange = (value) => {
    //   setCurrency(value);
    // };

    return (
      <div>
        <Form.Item label={field.label} style={{ marginBottom: 0 }}>
          <Form.Item
            name={field.name}
            rules={[
              {
                required: field.required || false,
                type: filedType[field.type] ?? 'any',
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(70% - 8px)' }}
          >
            <InputNumber
              className="moneyInput"
              min={0}
              controls={false}
              // addonBefore={currency === 'USD' ? '$' : 'UZS'}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
            />
          </Form.Item>
          <Form.Item
            name={`currency`}
            initialValue={currency}
            style={{ display: 'inline-block', width: 'calc(30% - 8px)', marginLeft: '8px' }}
          >
            <Select defaultValue="UZS" onChange={setCurrency} style={{ width: '100%' }}>
              <Select.Option value="UZS">🇺🇿 UZS (UZB So'm)</Select.Option>
              <Select.Option value="USD">🇺🇸 $ (US Dollar)</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>

        {/* <Select
          defaultValue="UZS"
          style={{ width: 90, marginRight: 10 }}
          onChange={handleCurrencyChange}
        >
          <Option value="UZS">UZS</Option>
          <Option value="USD">USD</Option>
        </Select>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          // addonBefore={currency === 'USD' ? '$' : 'UZS'}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|UZS|,/g, '')}
        /> */}
      </div>
    );
  };

  const formItemComponent = {
    select: <SelectComponent />,
    selectWithTranslation: <SelectWithTranslationComponent />,
    selectWithFeedback: (
      <SelectWithFeedbackComponent lanchFeedback={setFeedback} feedbackValue={feedback} />
    ),
    color: <ColorComponent />,

    tag: <TagComponent />,
    array: <ArrayComponent />,
    // country: <CountryComponent />,
    // search: <SearchComponent />,
    quantity: <InputWithUnitComponent />,
    currency: <CurrencyInput />,
  };

  const compunedComponent = {
    string: (
      <Input autoComplete="off" maxLength={field.maxLength} defaultValue={field.defaultValue} />
    ),
    url: <Input addonBefore="http://" autoComplete="off" placeholder="www.example.com" />,
    textarea: <TextArea rows={4} />,
    email: <Input autoComplete="off" placeholder="email@example.com" />,
    number: <InputNumber style={{ width: '100%' }} />,
    phone: <Input style={{ width: '100%' }} placeholder="+998 11 111 11 11" />,
    boolean: (
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        defaultValue={true}
      />
    ),
    date: (
      <DatePicker placeholder={'select_date'} style={{ width: '100%' }} format={'DD.MM.YYYY'} />
    ),
    async: (
      <SelectAsync
        entity={field.entity}
        displayLabels={field.displayLabels}
        outputValue={field.outputValue}
        loadDefault={field.loadDefault}
        withRedirect={field.withRedirect}
        urlToRedirect={field.urlToRedirect}
        redirectLabel={field.redirectLabel}
      ></SelectAsync>
    ),

    currencySelect: (
      <Select defaultValue="UZS" style={{ width: '100%' }}>
        <Select.Option value="UZS">🇺🇿 UZS (UZB So'm)</Select.Option>
        <Select.Option value="USD">🇺🇸 $ (US Dollar)</Select.Option>
      </Select>
    ),
    // currencyDollar: (
    //   <InputNumber
    //     className="moneyInput"
    //     min={0}
    //     controls={false}
    //     addonBefore={'$'}
    //     style={{ width: '100%' }}
    //     // formatter={(value) => moneyDollarFormatter({ amount: value })}
    //     parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // Removes the formatting to get the numeric value
    //   />
    // ),
    quantity: <InputWithUnitComponent />,
  };

  const filedType = {
    string: 'string',
    textarea: 'string',
    number: 'number',
    phone: 'string',
    //boolean: 'boolean',
    // method: 'method',
    // regexp: 'regexp',
    // integer: 'integer',
    // float: 'float',
    // array: 'array',
    // object: 'object',
    // enum: 'enum',
    // date: 'date',
    url: 'url',
    website: 'url',
    email: 'email',
  };

  const customFormItem = formItemComponent[field.type];
  let renderComponent = compunedComponent[field.type];

  if (!renderComponent) {
    renderComponent = compunedComponent['string'];
  }

  if (customFormItem) return <>{customFormItem}</>;
  else {
    return (
      <Form.Item
        label={field.label}
        name={field.name}
        rules={[
          {
            required: field.required || false,
            type: filedType[field.type] ?? 'any',
          },
        ]}
        valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
      >
        {renderComponent}
      </Form.Item>
    );
  }
}
