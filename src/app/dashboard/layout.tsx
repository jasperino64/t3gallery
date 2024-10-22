import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return <div>Navbar</div>;
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
