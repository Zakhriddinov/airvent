import { Modal } from 'antd';
import { useCrudContext } from '@/context/crud';
export default function CrudModal({ config, createContent, editContent }) {

  const { ADD_NEW_ENTITY, UPDATE_ENTITY } = config;
  const { state, crudContextAction } = useCrudContext();
  const { isAdvancedBoxOpen, isEditBoxOpen } = state;
  const { advancedBox, editBox } = crudContextAction;

  const handleCancel = () => {
    advancedBox.close();
    editBox.close();
  };
  return (
    <Modal
      title={isEditBoxOpen ? UPDATE_ENTITY : ADD_NEW_ENTITY}
      width={500}
      open={isEditBoxOpen ? isEditBoxOpen : isAdvancedBoxOpen}
      onCancel={handleCancel}
      footer={[]}
      centered
    >
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {isEditBoxOpen ? editContent : createContent}
      </div>
    </Modal>
  );
}
