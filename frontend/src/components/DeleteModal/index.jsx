import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCrudContext } from '@/context/crud';
import { selectDeletedItem } from '@/redux/crud/selectors';
import { crud } from '@/redux/crud/actions';

export default function DeleteModal({ config }) {
  const { entity, modalTitle } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem);
  const { state, crudContextAction } = useCrudContext();
  const { isModalOpen } = state;
  const { modal } = crudContextAction;
  const [displayItem, setDisplayItem] = useState('');

  useEffect(() => {
    if (isSuccess) {
      console.log('🚀 ~ useEffect ~ DeleteModal isSuccess:', isSuccess);
      modal.close();
      dispatch(crud.list({ entity }));
    }
    if (current) {
      setDisplayItem(current?.name);
    }
  }, [isSuccess, current]);

  const handleOk = () => {
    const id = current._id;
    dispatch(crud.delete({ entity, id }));
    modal.close();
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>
        Haqiqatan ham o'chirishni istaysizmi:{' '}
        <span className="font-weight-800">{displayItem}</span>
      </p>
    </Modal>
  );
}
