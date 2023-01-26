import styles from "./PageLoading.module.scss";

import Lottie from "react-lottie-player";
import lottieJson from "public/image/lottie/loading.json";

export default function PageLoading() {
  return (
    <div className={styles.Wrapper}>
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{
          width: '140px',
          height: '140px'
        }}
      />
    </div>
  )
}