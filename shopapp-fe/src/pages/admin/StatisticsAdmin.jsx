import { Breadcrumb, Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getBottom5ProductsByRevenue,
  getCategoryReport,
  getOrderSummary,
  getRevenueByOrderType,
  getSupplierReport,
  getTop5ProductsByRevenue,
  getUserGrowth,
  getWeeklyRevenueTrend,
} from "../../api/report";
import { Link } from "react-router-dom";

const StatisticsAdmin = () => {
  const [orderSummary, setOrderSummary] = useState(null);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [categoryReport, setCategoryReport] = useState([]);
  const [supplierReport, setSupplierReport] = useState([]);
  const [revenueByOrderType, setRevenueByOrderType] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [bottomProducts, setBottomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Các màu cho biểu đồ
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  const toMillionVND = (value) => {
    return value ? `${(value / 1000000).toFixed(2)} triệu VND` : "0 triệu VND";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [os, wr, cr, sr, rbot, ug, top5, bottom5] = await Promise.all([
          getOrderSummary(),
          getWeeklyRevenueTrend(),
          getCategoryReport(),
          getSupplierReport(),
          getRevenueByOrderType(),
          getUserGrowth(),
          getTop5ProductsByRevenue(),
          getBottom5ProductsByRevenue(),
        ]);

        setOrderSummary({
          totalOrders: os.totalOrders || 0,
          totalRevenue: os.totalRevenue || 0,
          totalInventoryPrice: os.totalInventoryPrice || 0,
        });

        // Sắp xếp dữ liệu theo thứ tự thời gian tăng dần
        setWeeklyRevenue(
          wr
            .sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return a.weekOfYear - b.weekOfYear;
            })
            .map((item) => ({
              name: `Tuần ${item.weekOfYear}/${item.year}`,
              revenue: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
              orders: item.totalOrders || 0,
            }))
        );

        // Lọc danh mục có doanh thu > 0 và sắp xếp theo doanh thu giảm dần
        setCategoryReport(
          cr
            .filter((item) => item.totalRevenue > 0)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .map((item) => ({
              name: item.categoryName || "Không xác định",
              value: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
              quantity: item.totalSoldQuantity || 0,
              avgValue:
                item.totalSoldQuantity > 0
                  ? (
                      item.totalRevenue /
                      item.totalSoldQuantity /
                      1000000
                    ).toFixed(2)
                  : 0,
            }))
        );

        // Lọc nhà cung cấp có doanh thu > 0 và sắp xếp theo doanh thu giảm dần
        setSupplierReport(
          sr
            .filter((item) => item.totalRevenue > 0)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .map((item) => ({
              name: item.supplierName || "Không xác định",
              value: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
              quantity: item.totalSoldQuantity || 0,
              avgValue:
                item.totalSoldQuantity > 0
                  ? (
                      item.totalRevenue /
                      item.totalSoldQuantity /
                      1000000
                    ).toFixed(2)
                  : 0,
            }))
        );

        // Tính tổng doanh thu cho tỷ lệ phần trăm
        const totalOrderTypeRevenue = rbot.reduce(
          (sum, item) => sum + (item.totalRevenue || 0),
          0
        );

        setRevenueByOrderType(
          rbot.map((item) => ({
            name: item.orderType === "ONLINE" ? "Trực tuyến" : "Tại cửa hàng",
            value: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
            orders: item.totalOrders || 0,
            percentage:
              totalOrderTypeRevenue > 0
                ? (
                    ((item.totalRevenue || 0) / totalOrderTypeRevenue) *
                    100
                  ).toFixed(1)
                : 0,
            avgOrderValue:
              item.totalOrders > 0
                ? (item.totalRevenue / item.totalOrders / 1000000).toFixed(2)
                : 0,
          }))
        );

        // Sắp xếp dữ liệu theo thứ tự thời gian tăng dần và tính tổng tích lũy
        let accumulatedUsers = 0;
        setUserGrowth(
          ug
            .sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return a.weekOfYear - b.weekOfYear;
            })
            .map((item) => {
              accumulatedUsers += item.newUsers || 0;
              return {
                name: `Tuần ${item.weekOfYear}/${item.year}`,
                newUsers: item.newUsers || 0,
                totalUsers: accumulatedUsers,
              };
            })
        );

        // Set top and bottom products data
        setTopProducts(
          top5.map((item) => ({
            name: item.name,
            revenue: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
            quantity: item.totalSoldQuantity || 0,
          }))
        );

        setBottomProducts(
          bottom5.map((item) => ({
            name: item.name,
            revenue: item.totalRevenue ? item.totalRevenue / 1000000 : 0,
            quantity: item.totalSoldQuantity || 0,
          }))
        );
      } catch (error) {
        console.error("Lỗi tải dữ liệu bảng điều khiển:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Custom label cho biểu đồ tròn
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" />
        <div style={{ marginLeft: 8 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <Link to="/admin">Admin</Link> },
          { title: "Báo cáo & Thống kê" },
        ]}
      />

      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Card
            title="Tổng quan đơn hàng"
            style={{ fontSize: "16px" }}
            headStyle={{ fontSize: "18px" }}
          >
            <p>
              🛒 Tổng đơn:{" "}
              {orderSummary?.totalOrders.toLocaleString("vi-VN") || 0}
            </p>
            <p>💰 Tổng doanh thu: {toMillionVND(orderSummary?.totalRevenue)}</p>
            <p>
              📦 Tổng giá nhập hàng:{" "}
              {toMillionVND(orderSummary?.totalInventoryPrice)}
            </p>
            <p>
              📊 Lợi nhuận:{" "}
              {toMillionVND(
                orderSummary.totalRevenue - orderSummary.totalInventoryPrice
              )}
            </p>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Phân bổ đơn hàng theo loại (Tại cửa hàng và Online)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueByOrderType}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "Doanh thu (triệu VND)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Số đơn hàng",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Doanh thu")
                      return [
                        `${value.toFixed(2)} triệu VND (${
                          revenueByOrderType.find(
                            (item) => item.value === value
                          )?.percentage
                        }%)`,
                        name,
                      ];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="value"
                  name="Doanh thu"
                  fill="#82ca9d"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Số đơn hàng"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Xu hướng doanh thu hàng tuần"
            headStyle={{ fontSize: "18px" }}
            // style={{ height: "300px" }}
          >
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart
                data={weeklyRevenue}
                margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14 }}
                  height={60}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "Doanh thu (triệu VND)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 14,
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Số đơn hàng",
                    angle: -90,
                    position: "insideRight",
                    fontSize: 14,
                  }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Doanh thu")
                      return [`${value.toFixed(2)} triệu VND`, name];
                    return [value, name];
                  }}
                  contentStyle={{ fontSize: "14px" }}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }} />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Số đơn hàng"
                  fill="#8884d8"
                  barSize={40}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Doanh thu theo danh mục"
            headStyle={{ fontSize: "18px" }}
            style={{ height: "500px" }}
          >
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={true}
                  data={categoryReport}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={40}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {categoryReport.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toFixed(2)} triệu VND`}
                  contentStyle={{ fontSize: "14px" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "14px", paddingLeft: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Doanh thu theo nhà cung cấp"
            headStyle={{ fontSize: "18px" }}
            style={{ height: "500px" }}
          >
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={true}
                  data={supplierReport}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={40}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {supplierReport.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toFixed(2)} triệu VND`}
                  contentStyle={{ fontSize: "14px" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "14px", paddingLeft: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Top 5 sản phẩm có doanh thu cao nhất"
            headStyle={{ fontSize: "18px" }}
          >
            <ResponsiveContainer width="100%" height={400}>
              {/* Add this after one of your existing Col components */}
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={topProducts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 14 }}
                    height={60}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Doanh thu (triệu VND)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Số lượng bán",
                      angle: -90,
                      position: "insideRight",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Doanh thu")
                        return [`${value.toFixed(2)} triệu VND`, name];
                      return [value, name];
                    }}
                    contentStyle={{ fontSize: "14px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="#82ca9d"
                    barSize={40}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#82ca9d" />
                    ))}
                  </Bar>
                  <Bar
                    yAxisId="right"
                    dataKey="quantity"
                    name="Số lượng bán"
                    fill="#8884d8"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Top 5 sản phẩm có doanh thu thấp nhất"
            headStyle={{ fontSize: "18px" }}
          >
            <ResponsiveContainer width="100%" height={400}>
              {/* Bottom 5 Products by Revenue */}
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={bottomProducts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 14 }}
                    height={60}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Doanh thu (triệu VND)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Số lượng bán",
                      angle: -90,
                      position: "insideRight",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Doanh thu")
                        return [`${value.toFixed(2)} triệu VND`, name];
                      return [value, name];
                    }}
                    contentStyle={{ fontSize: "14px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="#82ca9d"
                    barSize={40}
                  >
                    {bottomProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#82ca9d" />
                    ))}
                  </Bar>
                  <Bar
                    yAxisId="right"
                    dataKey="quantity"
                    name="Số lượng bán"
                    fill="#8884d8"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Tăng trưởng người dùng">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={userGrowth}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "Tổng người dùng",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Người dùng mới",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalUsers"
                  name="Tổng người dùng"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="right"
                  dataKey="newUsers"
                  name="Người dùng mới"
                  fill="#82ca9d"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatisticsAdmin;
