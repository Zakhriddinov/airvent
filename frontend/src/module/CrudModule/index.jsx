import { useLayoutEffect, useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import CreateForm from '@/components/CreateForm';
import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
// import ReadItem from '@/components/ReadItem';
// import SearchItem from '@/components/SearchItem';
import DataTable from '@/components/DataTable';

import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentItem } from '@/redux/crud/selectors';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';

import CrudLayout from '@/layout/CrudLayout';

function SidePanelTopContent({ config, formElements, withUpload }) {
  const { crudContextAction, state } = useCrudContext();
  const { deleteModalLabels } = config;
  const { modal, editBox } = crudContextAction;

  const { isReadBoxOpen, isEditBoxOpen } = state;
  const { result: currentItem } = useSelector(selectCurrentItem);
  const dispatch = useDispatch();

  const [labels, setLabels] = useState('');
  useEffect(() => {
    if (currentItem) {
      const currentlabels = deleteModalLabels.map((x) => currentItem[x]).join(' ');

      setLabels(currentlabels);
    }
  }, [currentItem]);

  const removeItem = () => {
    dispatch(crud.currentAction({ actionType: 'delete', data: currentItem }));
    modal.open();
  };
  const editItem = () => {
    dispatch(crud.currentAction({ actionType: 'update', data: currentItem }));
    editBox.open();
  };

  const show = isReadBoxOpen || isEditBoxOpen ? { opacity: 1 } : { opacity: 0 };
  return (
    <>
      <Row style={show} gutter={(24, 24)}>
        <Col span={10}>
          <p style={{ marginBottom: '10px' }}>{labels}</p>
        </Col>
      </Row>
      {/* <ReadItem config={config} /> */}
      <UpdateForm config={config} formElements={formElements} withUpload={withUpload} />
    </>
  );
}

function CrudModule({ config, createForm, updateForm, withUpload = false, isUpdateForm = false }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      config={config}
      isUpdateForm={isUpdateForm}
      //   fixHeaderPanel={<FixHeaderPanel config={config} />}
      createModalContent={
        <CreateForm config={config} formElements={createForm} withUpload={withUpload} />
      }
      editModalContent={
        <UpdateForm config={config} formElements={updateForm} withUpload={withUpload} />
      }
    >
      <DataTable config={config} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default CrudModule;
