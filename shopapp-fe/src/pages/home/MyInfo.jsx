import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useOutletContext } from "react-router-dom";
import { getMyInfo, updateUser } from "../../api/user";
import UserForm from "../../components/UserForm";
import { getToken } from "../../services/localStorageService";
import { useDispatch } from "react-redux";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => (value ? `${value.format(dateFormat)}` : null);

export default function MyInfo() {
  const { userDetails } = useOutletContext();
  const dispatch = useDispatch();

  const handleUpdate = async (values) => {
    const data = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      dob: customFormat(values.dob),
      roles: ["CUSTOMER"],
    };

    try {
      await updateUser(data, values.id);
      dispatch(getMyInfo(getToken()));
    } catch (e) {}
  };

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Thông Tin Cá Nhân</h2>

      <UserForm
        onSubmit={handleUpdate}
        submitButtonText="Chỉnh sửa thông tin"
        isDisabled={false}
        isUpdate={true}
        initValues={userDetails}
      />
    </>
  );
}
