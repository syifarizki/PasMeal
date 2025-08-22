import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImSpoonKnife } from "react-icons/im";
import { Menu } from "../services/Menu";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function NewMenuSlider() {
  const [newMenus, setNewMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewMenus = async () => {
      try {
        const data = await Menu.getNewMenus();
        setNewMenus(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal fetch menu baru:", err);
        setNewMenus([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNewMenus();
  }, []);

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

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading menu baru...</div>
    );
  }

  if (!newMenus.length) {
    return (
      <div className="text-white text-center py-10">
        Menu baru tidak tersedia
      </div>
    );
  }

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
            <div className="bg-white rounded-lg shadow p-2 text-center">
              <LazyLoadImage
                src={
                  menu.foto_menu
                    ? `${import.meta.env.VITE_API_URL}/uploads/${
                        menu.foto_menu
                      }`
                    : "/images/menudefault.jpg"
                }
                alt={menu.nama_menu}
                effect="blur"
                onError={(e) => {
                  e.target.src = "/images/menudefault.jpg";
                }}
                className="w-full aspect-video object-cover rounded-sm"
              />
              <div className="mt-2 text-lg md:text-xl font-bold">
                {menu.nama_menu}
              </div>
              <div className="text-lg md:text-xl text-primary">
                Rp. {Number(menu.harga).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
