import React from "react";

const Image = React.memo(({ src, alt }) => {
    return <img src={src} alt={alt || ""} />;
  }, (prevProps, nextProps) => {
    return prevProps.src === nextProps.src && prevProps.alt === nextProps.alt;
});

export default Image;
