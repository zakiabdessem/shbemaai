export const TitlePage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      {children}
    </h1>
  );
};
