import styles from "./Article.module.scss";

export default function Article({ children, title }) {
  return (
    <article className={styles.wrapper}>
      <h2 className={styles.title}>{ title }</h2>
      { children }
    </article>
  )
}