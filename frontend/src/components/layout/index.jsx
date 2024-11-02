import React, { useEffect, useState } from 'react';
import { Container, LinkLogo, Main, MenuWrap, Sidebar } from './style';
import logo from '../../assets/icons/img/logo.png';
import Header from './header';
import { Outlet, useNavigate } from 'react-router-dom';
import { sidebar } from '../../utilities/routing/sidebar';
import { Menu } from 'antd';
import storePersist from '@/redux/storePersist';

const Layouts = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('1');

  useEffect(() => {
    const { key } = storePersist.get('selectedKey');
    if (key) setSelectedKey(key);

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  const onClickParent = (parent, e) => {
    const { id, items, path, title } = parent;
    if (!items || items.length === 0) {
      setSelectedKey(id.toString());
      storePersist.set('selectedKey', { key: id.toString() });
      navigate(path, { state: { parent: title } });
    }
  };

  const onClickChild = (parent, child, e) => {
    const childKey = `${parent.id}-${child.id}`;
    setSelectedKey(childKey);
    storePersist.set('selectedKey', { key: childKey });
    navigate(child.path, {
      state: { parent: parent.title, child: child.label },
    });
  };

  const navigateDashboard = () => {
    navigate('/');
    setSelectedKey('1');
  };

  return (
    <Container>
      <Sidebar
        trigger={null}
        collapsible
        style={{ background: 'transparent', position: 'fixed', top: 0, height: '100vh' }}
      >
        <LinkLogo onClick={navigateDashboard}>
          <img src={logo} alt="icon" />
        </LinkLogo>
        <MenuWrap theme="transparent" mode="inline" selectedKeys={[selectedKey]}>
          {sidebar.map((parent) => {
            const { icon: Icon } = parent;
            return !parent.hidden ? (
              <React.Fragment key={parent.id}>
                {parent.items && parent.items.length > 0 ? (
                  <Menu.SubMenu key={parent.id} title={parent.title} icon={<Icon />}>
                    {parent.items.map((child) => (
                      <Menu.Item
                        key={`${parent.id}-${child.id}`}
                        onClick={(e) => onClickChild(parent, child, e)}
                      >
                        {child.label}
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                ) : (
                  <Menu.Item
                    key={parent.id}
                    icon={<Icon />}
                    onClick={(e) => onClickParent(parent, e)}
                  >
                    {parent.title}
                  </Menu.Item>
                )}
              </React.Fragment>
            ) : null;
          })}
        </MenuWrap>
      </Sidebar>
      <Container style={{ marginInlineStart: 256 }}>
        <Header />
        <Main>
          <Outlet />
        </Main>
      </Container>
    </Container>
  );
};

export default Layouts;
