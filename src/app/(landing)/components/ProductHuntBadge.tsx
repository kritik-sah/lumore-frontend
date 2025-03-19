import React from "react";

const ProductHuntBadge: React.FC = () => {
  return (
    <a
      href="https://www.producthunt.com/posts/lumore?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lumore"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=943859&theme=light&t=1742398876915"
        alt="Lumore - Helps you socialize your way! | Product Hunt"
        width="250"
        height="54"
        style={{ width: "250px", height: "54px" }}
      />
    </a>
  );
};

export default ProductHuntBadge;
