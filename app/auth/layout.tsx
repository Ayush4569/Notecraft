import SessionProviderWrapper from "@/components/sesion-provider";
import React from "react";

const Authlayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProviderWrapper>
      <div className="h-full flex items-center justify-center">
        {children}
      </div>
    </SessionProviderWrapper>
  );
};

export default Authlayout;
