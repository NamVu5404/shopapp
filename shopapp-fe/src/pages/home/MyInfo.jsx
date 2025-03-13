import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { getMyInfo, updateUser } from "../../api/user";
import UserForm from "../../components/UserForm";
import { getToken } from "../../services/localStorageService";
import { useDispatch } from "react-redux";
import { message } from "antd";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const customFormat = (value) => (value ? `${value.format(dateFormat)}` : null);

export default function MyInfo() {
  const { userDetails } = useOutletContext();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleUpdate = async (values) => {
    // Kiểm tra thời gian giữa các lần submit
    const currentTime = Date.now();
    const timeSinceLastSubmit = currentTime - lastSubmitTime;

    // Ngăn chặn submit nếu chưa đủ 2 giây kể từ lần submit trước
    if (timeSinceLastSubmit < 2000) {
      message.warning("Vui lòng đợi trước khi gửi lại.");
      return;
    }

    // Ngăn chặn submit nếu đang xử lý yêu cầu trước đó
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(currentTime);

    const data = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      dob: customFormat(values.dob),
      roles: userDetails.roles,
    };

    try {
      await updateUser(data, values.id);
      dispatch(getMyInfo(getToken()));
    } catch (e) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3 style={{ marginBottom: 20 }}>Thông Tin Cá Nhân</h3>

      <UserForm
        onSubmit={handleUpdate}
        submitButtonText="Chỉnh sửa thông tin"
        isDisabled={isSubmitting}
        isUpdate={true}
        initValues={userDetails}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
