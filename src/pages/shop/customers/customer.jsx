import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PagePattern from "@/layouts/PagePattern";
import useSearch from "@/hooks/useSearch";
import { criteria } from "@/utils/pagination";
import {
  isRegularCustomer,
  mockCustomers,
  mockOrders,
  paidTotal,
} from "@/mock/mockData";
import CustomerSearch from "./customerSearch";
import CustomerSummary from "./customerSummary";
import CustomerList from "./customerList";
import ModalCustomer from "./modalCustomer";

const Customer = () => {
  const [gridCriteria, setGridCriteria] = useState(criteria());
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    regular: 0,
    newThisMonth: 0,
  });
  const [modal, setModal] = useState({
    open: false,
    data: null,
  });

  const { control, getValues, reset } = useForm({
    defaultValues: {
      keyword: "",
      minOrders: null,
    },
  });

  useEffect(() => {
    onSearchForm(gridCriteria.page);
  }, [gridCriteria.page, gridCriteria.pageSize]);

  const getFavoriteMenus = (orders) => {
    const menuCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const count = menuCount[item.menuName] || 0;
        menuCount[item.menuName] = count + item.quantity;
      });
    });
    const menuNames = Object.keys(menuCount);
    menuNames.sort((a, b) => menuCount[b] - menuCount[a]);
    return menuNames.slice(0, 3);
  };

  const onSearchForm = (page = 1) => {
    const formValue = getValues();
    const pageSize = gridCriteria.pageSize;
    setIsLoading(true);

    const customers = mockCustomers.map((customer) => {
      const orders = mockOrders.filter((o) => {
        const isAccepted = !["paid", "cancelled"].includes(o.status);
        return o.customerId === customer.customerId && isAccepted;
      });
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      let totalSpent = 0;
      orders.forEach((o) => {
        if (o.status === "completed") totalSpent += paidTotal(o);
      });
      const lastOrder = orders[0];
      const firstOrder = orders[orders.length - 1];
      return {
        ...customer,
        orderCount: orders.length,
        totalSpent: totalSpent,
        isRegular: isRegularCustomer(customer.customerId),
        lastOrderAt: lastOrder ? lastOrder.createdAt : null,
        firstOrderAt: firstOrder ? firstOrder.createdAt : null,
        address: lastOrder ? lastOrder.deliveryAddress : "-",
        favoriteMenus: getFavoriteMenus(orders),
      };
    });

    const activeCustomers = customers.filter((c) => c.orderCount > 0);
    const now = new Date();
    setSummary({
      total: activeCustomers.length,
      regular: activeCustomers.filter((c) => c.isRegular).length,
      newThisMonth: activeCustomers.filter((c) => {
        const first = new Date(c.firstOrderAt);
        const sameYear = first.getFullYear() === now.getFullYear();
        return sameYear && first.getMonth() === now.getMonth();
      }).length,
    });

    const keyword = formValue.keyword?.trim() || "";
    const result = activeCustomers.filter((c) => {
      const matchName = c.displayName.includes(keyword);
      const matchOrders =
        formValue.minOrders === null || c.orderCount >= formValue.minOrders;
      return matchName && matchOrders;
    });
    result.sort((a, b) => b.orderCount - a.orderCount);

    setDataTable(result.slice((page - 1) * pageSize, page * pageSize));
    setGridCriteria({ ...gridCriteria, page, total: result.length });
    setIsLoading(false);
  };

  const { isEmpty } = useSearch(control, onSearchForm);

  return (
    <PagePattern
      title="ลูกค้าประจำ"
      subtitle="ข้อมูลลูกค้าเป็นของร้าน ใช้ดูแลลูกค้าที่กลับมาสั่งบ่อย"
    >
      <div className="grid grid-cols-1 gap-4">
        <CustomerSearch
          control={control}
          onSearchForm={onSearchForm}
          onClear={() => reset()}
          isEmpty={isEmpty}
        />
        <CustomerSummary summary={summary} />
        <CustomerList
          dataTable={dataTable}
          isLoading={isLoading}
          gridCriteria={gridCriteria}
          setGridCriteria={setGridCriteria}
          setModal={setModal}
        />
        <ModalCustomer modal={modal} setModal={setModal} />
      </div>
    </PagePattern>
  );
};

export default Customer;
