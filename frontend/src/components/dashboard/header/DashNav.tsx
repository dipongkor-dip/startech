import {UserRole} from "../../../store/slices/auth/interface";
const DashNav = ({role}: {role: string}) => {
  const options = [
    {
      role: UserRole.SUPER_ADMIN,
      item: [],
    },
  ];

  return (
    <header>
      <nav className="w-full">
        <ul className="mx-5 flex gap-5 py-2">
          <li>
            <button>Users</button>
          </li>
          <li>
            <button>Products</button>
          </li>
          <li>
            <button>Permissions</button>
          </li>
          <li>
            <button>Charts</button>
          </li>
          <li>
            <button>Docs</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashNav;
