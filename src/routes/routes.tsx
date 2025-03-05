import Loader from "@/components/common/Loader";
import PageTitle from "@/components/common/PageTitle";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Login from "@/pages/Login";
import { ComponentType, lazy, ReactNode, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import PublicRoute from "@/components/common/PublicRoute";
import PrivateRoute from "@/components/common/PrivateRoute";
import Home from "@/pages/Home";
import { MainContent } from "@/components/layout/Partials/MainContent";

const Loadable = <P extends object>(
  Component: ComponentType<P>
): React.FC<P> => {
  return (props: P): ReactNode => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

const Product = Loadable(
  lazy(() => import("@/pages/ProductManagement/Product"))
);
const AddProduct = Loadable(
  lazy(() => import("@/pages/ProductManagement/Product/Add"))
);
const ProductType = Loadable(
  lazy(() => import("@/pages/ProductManagement/ProductType"))
);
const Unit = Loadable(lazy(() => import("@/pages/ProductManagement/Unit")));
const DiscountType = Loadable(
  lazy(() => import("@/pages/ProductManagement/DiscountType"))
);
const WarrantyTime = Loadable(
  lazy(() => import("@/pages/ProductManagement/WarrantyTime"))
);

function AppRouter() {
  const routes = [
    {
      path: "/",
      element: (
        // <PrivateRoute>
        <DefaultLayout />
        // </PrivateRoute>
        // <DefaultLayout />
      ),
      children: [
        {
          path: "/",
          index: true,
          element: (
            <>
              <PageTitle title="Home" />
              <MainContent title="trang chủ">
                <Home />
              </MainContent>
            </>
          ),
        },
        {
          path: "/san-pham",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách sản phẩm" />
                  <MainContent title="Quản lý sản phẩm">
                    <Product />
                  </MainContent>
                </>
              ),
            },
            {
              path: "them-moi",
              element: (
                <>
                  <PageTitle title="Thêm sản phẩm" />
                  <MainContent
                  title="Thêm sản phẩm"
                    breadcrumb={{
                      parent: { title: "Sản phẩm", url: "/san-pham" },
                      current: "Thêm mới",
                    }}
                  >
                    <AddProduct />
                  </MainContent>
                </>
              ),
            },
          ],
        },
        {
          path: "/loai-san-pham",
          element: (
            <>
              <PageTitle title="Danh sách loại sản phẩm" />
              <MainContent title="Quản lý loại sản phẩm">
                <ProductType />
              </MainContent>
            </>
          ),
        },
        {
          path: "/don-vi-tinh",
          element: (
            <>
              <PageTitle title="Danh sách đơn vị tính" />
              <MainContent title="Quản lý đơn vị tính">
                <Unit />
              </MainContent>
            </>
          ),
        },
        {
          path: "/loai-giam-gia",
          element: (
            <>
              <PageTitle title="Danh sách loại giảm giá" />
              <MainContent title="Quản lý Loại giảm giá">
                <DiscountType />
              </MainContent>
            </>
          ),
        },
        {
          path: "/thoi-gian-bao-hanh",
          element: (
            <>
              <PageTitle title="Danh sách thời gian bảo hành" />
              <MainContent title="Quản lý thời gian bảo hành">
                <WarrantyTime />
              </MainContent>
            </>
          ),
        },
      ],
    },
    {
      path: "/dang-nhap",
      element: (
        <>
          <PageTitle title="Đăng nhập" />
          <PublicRoute>
            <Login />
          </PublicRoute>
        </>
      ),
    },
  ];

  return useRoutes(routes);
}

export default AppRouter;
