const Loader = ({ children, isLoading, className }) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className={className}>
      <h3>Loading...</h3>
    </div>
  );
};

export { Loader };
