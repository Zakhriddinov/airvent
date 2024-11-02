import { Button, Input, Result } from "antd";
import React from "react";
import { useParams } from "react-router-dom";

const MailVerification = () => {
  const pathname = useParams();
  const shortId = pathname?.shortId ?? null;
  const userId = pathname?.userId ?? null;

  const onFinish=()=>{

  }
  return (
    <Result
      title="Hisobingizni tasdiqlang"
      subTitle="E-pochta orqali olingan kodni kiritish orqali tasdiqlashni yakunlang"
      extra={[
        <Input
          style={{ width: "150px" }}
          placeholder="Kodni kiriting"
          defaultValue={pathname?.shortId}
        />,
        <Button type="primary" key="console">
          Tasdiqlang
        </Button>,
      ]}
    />
  );
};

export default MailVerification;
