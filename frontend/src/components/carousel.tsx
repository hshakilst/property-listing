"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { ImageData } from "@/lib/types";

type CarouselProps = {
  images: ImageData[];
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image src={image.src} alt={image.alt} width={500} height={400} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Carousel;
