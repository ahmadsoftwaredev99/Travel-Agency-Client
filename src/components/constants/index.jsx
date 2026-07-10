import {
  GiftOutlined,
  MessageOutlined,
  UserOutlined,
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
  ContactsOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

export const adminPaths = [
  {
    id: 1,
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/admin-dashboard",
    end: true,
  },
  {
    id: 2,
    label: "Packages",
    icon: <GiftOutlined />,
    path: "/admin-dashboard/packages",
  },
  {
    id: 3,
    label: "Bookings",
    icon: <CalendarOutlined />,
    path: "/admin-dashboard/booking",
  },
  {
    id: 4,
    label: "Enquiries",
    icon: <MessageOutlined />,
    path: "/admin-dashboard/enquiries",
  },
  {
    id: 5,
    label: "Users",
    icon: <TeamOutlined />,
    path: "/admin-dashboard/user",
  },
];

export const customerPath = [
  {
    id: 1,
    label: "Packages",
    icon: <GiftOutlined />,
    path: "/customer-dashboard",
    end: true,
  },
  {
    id: 2,
    label: "My Bookings",
    icon: <CalendarOutlined />,
    path: "/customer-dashboard/my-booking",
  },
  {
    id: 3,
    label: "My Enquiries",
    icon: <MessageOutlined />,
    path: "/customer-dashboard/my-enquiries",
  },
  {
    id: 4,
    label: "Contact",
    icon: <ContactsOutlined />,
    path: "/customer-dashboard/contact",
  },
  {
    id: 5,
    label: "Profile",
    icon: <UserOutlined />,
    path: "/customer-dashboard/profile",
  },
  {
    id: 6,
    label: "Back to Home",
    icon: <ArrowLeftOutlined />,
    path: "/",
  },
];
