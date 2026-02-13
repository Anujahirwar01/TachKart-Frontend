import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { SkeletonLoader } from "../../components/loader";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import type { CustomError } from "../../types/api-types";
import type { UserReducerInitialState } from "../../types/reducer-types";


interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {

  const { user } = useSelector(
    (state: { user: UserReducerInitialState }) => state.user
  )

  const { isLoading, isError, error, data } = useAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data?.message || "Failed to fetch orders");
  }

  useEffect(() => {
    if (data?.orders) {
      setRows(data.orders.map((order) => ({
        user: order.user.name,
        amount: order.total,
        discount: order.discount,
        quantity: order.orderItems.length,
        status: order.status === "processing" ?
          <span className="red">{order.status}</span> :
          order.status === "shipped" ?
            <span className="green">{order.status}</span> :
            <span className="purple">{order.status}</span>,
        action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
      })));
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkeletonLoader /> : Table}</main>
    </div>
  );
};

export default Transaction;
