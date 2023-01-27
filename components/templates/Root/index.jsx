import {useSelector} from "react-redux";

import styles from "./Root.module.scss";

import AdminPage from "../AdminPage";
import Article from "../../blocks/Article";
import EmptyProducts from "../../atoms/EmptyProducts";
import ProductCard from "../../atoms/ProductCard";
import useModalControl from "../../../hooks/common/useModalControl";
import Alert from "../../atoms/Alret";

export default function Root() {
  const { userInfo } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

  const [alert, setAlert, openAlert, closeAlert] = useModalControl(false);

  return (
    userInfo.admin
      ? <AdminPage />
      : (
        <div className={styles.wrapper}>
          <Article title="상품 목록">
            {
              productList.length === 0
                ? <EmptyProducts />
                : (
                  <div className={styles.productList}>
                    {
                      productList.map((product, i) => {
                        return (
                          <ProductCard
                            key={product.name}
                            data={product}
                            alert={alert}
                            openAlert={openAlert}
                          />
                        )
                      })
                    }
                  </div>
                )
            }
          </Article>
          {
            alert && (
              <Alert closeAlert={closeAlert}>
                투입 금액이 부족합니다.
              </Alert>
            )
          }
        </div>
      )
  );
};
