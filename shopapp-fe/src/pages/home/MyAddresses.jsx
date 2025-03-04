import { Button, Card, Col, Divider, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createAddress,
  deleteAddress,
  getAddressesByUserId,
  updateAddress,
} from "../../api/address";
import AddressModal from "../../components/AddressModal";
import MyButton from "../../components/MyButton";
import { getToken } from "../../services/localStorageService";

const { Text } = Typography;

const MyAddresses = () => {
  const userDetails = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = getToken();
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    const getAddressData = async () => {
      const result = await getAddressesByUserId(userDetails.id);
      setData(result);
    };

    if (token) {
      getAddressData();
    }
  }, [userDetails, token]);

  const refreshAddressList = async () => {
    const updatedData = await getAddressesByUserId(userDetails.id);
    setData(updatedData);
  };

  const handleAddAddress = () => {
    setInitValues(null);
    setIsModalOpen(true);
  };

  const handleUpdateAddress = (address) => {
    setInitValues(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    await deleteAddress(addressId);
    await refreshAddressList();
  };

  const handleModalSubmit = async (address) => {
    if (initValues?.id) {
      await updateAddress(initValues.id, address);
    } else {
      address.userId = userDetails.id;
      await createAddress(address);
    }
    setIsModalOpen(false);
    await refreshAddressList();
  };

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Địa Chỉ Của Tôi</h2>
      <MyButton onClick={handleAddAddress}>Thêm địa chỉ</MyButton>
      <Divider />
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {(data || []).map((address) => (
          <Card key={address.id}>
            <Row>
              <Col xl={18}>
                <div>
                  <Text strong>{address.fullName}</Text> | {address.phone}
                </div>
                <div>{address.detail}</div>
                <div>
                  {address.ward}, {address.district}, {address.province}
                </div>
              </Col>

              <Col xl={6} style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="link"
                  onClick={() => handleUpdateAddress(address)}
                >
                  Cập nhật
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
      </Space>

      <AddressModal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initValues={initValues}
      />
    </>
  );
};

export default MyAddresses;
