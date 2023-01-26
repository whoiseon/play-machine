import {useSelector} from "react-redux";

import styles from "./Root.module.scss";

import AdminPage from "../AdminPage";
import Article from "../../blocks/Article";
import EmptyProducts from "../../atoms/EmptyProducts";
import ProductCard from "../../atoms/ProductCard";

export default function Root() {
  const { userInfo } = useSelector((state) => state.user);
  const { productList } = useSelector((state) => state.product);

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
                          />
                        )
                      })
                    }
                  </div>
                )
            }
          </Article>
        </div>
      )
  );
};
