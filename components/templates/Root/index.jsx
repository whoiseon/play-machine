import {useSelector} from "react-redux";

import styles from "./Root.module.scss";

import AdminPage from "components/templates/AdminPage";
import Article from "components/blocks/Article";
import ProductCard from "components/atoms/ProductCard";
import useModalControl from "hooks/common/useModalControl";
import Alert from "components/atoms/Alret";
import EmptyText from "../../atoms/EmptyText";

export default function Root() {
  const { myInfo } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

  const [alert, setAlert, openAlert, closeAlert] = useModalControl(false);

  return (
    myInfo.admin
      ? <AdminPage />
      : (
        <div className={styles.wrapper}>
          <Article title="상품 목록">
            {
              productList.length === 0
                ? <EmptyText type="상품" />
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
