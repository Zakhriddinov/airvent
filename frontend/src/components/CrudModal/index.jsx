import { Modal } from 'antd';
import { useCrudContext } from '@/context/crud';
export default function CrudModal({ config, createContent }) {
  const { ADD_NEW_ENTITY } = config;
  const { state, crudContextAction } = useCrudContext();
  const { isAdvancedBoxOpen } = state;
  const { advancedBox } = crudContextAction;

  const handleCancel = () => {
    advancedBox.close();
  };
  return (
    <Modal
      title={ADD_NEW_ENTITY}
      width={500}
      open={isAdvancedBoxOpen}
      onCancel={handleCancel}
      footer={[]}
    >
      {createContent}
    </Modal>
  );
}
