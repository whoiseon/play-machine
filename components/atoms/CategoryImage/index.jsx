import {useCallback} from "react";
import Image from "next/image";

export default function CategoryImage({ category }) {
  const imageSize = 46;

  const categoryImageDetect = useCallback((category) => {
    switch (category) {
      case '일반음료':
        return <Image
          src="/image/icon/normal-drink-icon.svg"
          alt="normal drink"
          width={imageSize}
          height={imageSize}
        />
      case '탄산음료':
        return <Image
          src="/image/icon/carbonated-drink-icon.svg"
          alt="carbonated drink"
          width={imageSize}
          height={imageSize}
        />
      case '맥주':
        return <Image
          src="/image/icon/beer-drink-icon.svg"
          alt="beer drink"
          width={imageSize}
          height={imageSize}
        />
      case '커피':
        return <Image
          src="/image/icon/coffee-drink-icon.svg"
          alt="coffee drink"
          width={imageSize}
          height={imageSize}
        />
      default:
        return <Image
          src="/image/icon/normal-drink-icon.svg"
          alt="normal drink"
          width={imageSize}
          height={imageSize}
        />
    }
  }, [imageSize]);

  return categoryImageDetect(category)
}