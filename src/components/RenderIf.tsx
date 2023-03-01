import React from 'react';

const RenderIf = ({
  children,
  isTrue,
}: {
  children: React.ReactNode;
  isTrue: boolean;
}) => {
  return <>{isTrue ? children : null}</>;
};

export default RenderIf;
