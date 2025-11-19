import React, { memo, useCallback } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(() => {
    if (location.pathname === "/product-detail") {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  if (location.pathname === "/") return <div className="px-2" />;

  return (
    <button onClick={handleClick} className="px-4">
      <IconArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
    </button>
  );
};

export default memo(BackButton);
