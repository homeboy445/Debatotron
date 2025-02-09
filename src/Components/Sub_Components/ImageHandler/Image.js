import React from "react";

const Image = React.memo(({ src, alt }) => {
    console.log("Image rendered");
    return <img src={src} alt={alt || ""} />;
  }, (prevProps, nextProps) => {
    console.log("## Comparing props:", prevProps, " <> ", nextProps);
    return prevProps.src === nextProps.src && prevProps.alt === nextProps.alt;
});

export default Image;
