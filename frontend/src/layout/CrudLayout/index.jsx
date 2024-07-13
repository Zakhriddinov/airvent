import { useEffect, useState } from 'react';

import DefaultLayout from '../DefaultLayout';
import { Layout } from 'antd';
import CrudModal from '@/components/CrudModal';

const { Content } = Layout;

const ContentBox = ({ children }) => {
  //   const { state: stateCrud, crudContextAction } = useCrudContext();
  //   const { state: stateApp } = useAppContext();
  //   const { isModalOpen } = stateCrud;
  //   // const { isNavMenuClose } = stateApp;
  //   const { panel } = crudContextAction;

  //   const [isSidePanelClose, setSidePanel] = useState(isPanelClose);

  //   useEffect(() => {
  //     let timer = [];
  //     if (isPanelClose) {
  //       timer = setTimeout(() => {
  //         setSidePanel(isPanelClose);
  //       }, 200);
  //     } else {
  //       setSidePanel(isPanelClose);
  //     }

  //     return () => clearTimeout(timer);
  //   }, [isPanelClose]);

  // useEffect(() => {
  //   if (!isNavMenuClose) {
  //     panel.close();
  //   }
  // }, [isNavMenuClose]);
  return (
    <Content
      className="whiteBox shadow layoutPadding"
      style={{
        margin: '30px 0',
        width: '100%',
        maxWidth: '100%',
        flex: 'none',
        padding: '0 50px',
      }}
    >
      {children}
    </Content>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  createModalContent,
  fixHeaderPanel,
}) {
  return (
    <>
      <DefaultLayout>
        <CrudModal
          config={config}
          topContent={sidePanelTopContent}
          createContent={createModalContent}
          fixHeaderPanel={fixHeaderPanel}
        ></CrudModal>

        <ContentBox>{children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
