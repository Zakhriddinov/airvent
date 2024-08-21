import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Select, Tag } from 'antd';

import { ApartmentOutlined, LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Container, Profile, ProfileDropdownWrap } from './style';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

export default function Header() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const ProfileDropdown = () => {
    return (
      <ProfileDropdownWrap>
        <Avatar
          size="large"
          className="last"
          style={{
            color: '#f56a00',
            backgroundColor: false ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
          }}
        >
          {currentAdmin.name.slice(0, 1).toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name ?? 'test'} {currentAdmin?.surname ?? ''}
          </p>
          <p>{currentAdmin?.email ?? 'test@gmail.com'}</p>
        </div>
      </ProfileDropdownWrap>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'} style={{ fontWeight: '550' }}>
          <DropdownMenu text="Profil sozlamalari" />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: (
        <Link to={'/settings'} style={{ fontWeight: '550' }}>
          Dastur sozlamalari
        </Link>
      ),
    },

    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: (
        <Link to={'/logout'} style={{ fontWeight: 'bold' }}>
          Chiqish
        </Link>
      ),
      danger: true,
    },
  ];
  return (
    <Container>
      <Select
        style={{ width: 130 }}
        defaultValue="2.0.0"
        options={[{ value: '2.0.0', label: 'v2.0.0 (beta)' }]}
      ></Select>
      {currentAdmin?.role ? (
        <Tag
          icon={<ApartmentOutlined />}
          color="geekblue"
          style={{ fontWeight: 600, padding: '4px 10px' }}
        >
          {currentAdmin?.role}
        </Tag>
      ) : (
        ''
      )}
      <Profile
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: ' 15px',
          flexDirection: 'row-reverse',
        }}
      >
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          placement="bottomRight"
          style={{ width: '280px', float: 'right', fontWeight: 'bold' }}
        >
          <Avatar
            className="last"
            style={{
              color: '#f56a00',
              backgroundColor: false ? 'none' : '#fde3cf',
              boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 10px 2px',
              float: 'right',
              cursor: 'pointer',
            }}
            size="large"
          >
            {currentAdmin.name.slice(0, 1).toUpperCase()}
          </Avatar>
        </Dropdown>
      </Profile>
    </Container>
  );
}
