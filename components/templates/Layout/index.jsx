import styles from "./Layout.module.scss";

import Logo from "../../atoms/Logo";
import Nav from "../../blocks/Nav";

export default function Layout({ children }) {
  return (
    <>
      <header className={styles.header}>
        <Logo />
      </header>
      <main className={styles.wrapper}>
        <div className={styles.container}>
          <Nav />
          {children}
        </div>
      </main>
    </>
  );
};
