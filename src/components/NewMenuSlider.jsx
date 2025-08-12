import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImSpoonKnife } from "react-icons/im";

export default function NewMenuSlider() {
  const newMenus = [
    { name: "Risol", price: "Rp. 2.000", image: "/images/asd.jpeg" },
    { name: "Nasgor Kari", price: "Rp. 15.000", image: "/images/asd.jpeg" },
    { name: "Es Teh Susu", price: "Rp. 5.000", image: "/images/asd.jpeg" },
    { name: "Nasgor Kari", price: "Rp. 15.000", image: "/images/asd.jpeg" },
    { name: "Es Teh Susu", price: "Rp. 5.000", image: "/images/asd.jpeg" },
  ];

const sliderSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  pauseOnHover: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 768, settings: { slidesToShow: 3 } }, 
    { breakpoint: 480, settings: { slidesToShow: 2 } }, 
  ],
};


  return (
    <div
      className="px-4 py-4 mb-6 rounded-xl"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: "800px auto",
        backgroundRepeat: "repeat",
        backgroundPosition: "top center",
      }}
    >
      <h3 className="flex items-center gap-2 font-bold text-white mb-4 ml-2 text-xl md:text-2xl drop-shadow">
        Coba menu baru di PasMeal!
        <ImSpoonKnife className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 inline-block" />
      </h3>

      <Slider {...sliderSettings}>
        {newMenus.map((menu, index) => (
          <div key={index} className="px-2">
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-24 object-cover rounded-md"
              />
              <div className="mt-2 text-xl font-bold">{menu.name}</div>
              <div className="text-xl text-primary">
                {menu.price}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
