function HorizontalCard({
  title,
  price,
  image,
  quantity,
  option,
}: {
  title: string;
  price: number;
  image: string;
  quantity: number;
  option: string;
}) {
  return (
    <div
      style={{
        maxHeight: "238px",
        maxWidth: "100%",
      }}
      className="flex border border-gray-200 rounded-md p-5">
      <div style={{ flex: "0 0 110px" }}>
        <img
          className="rounded-md rounded-b-none object-cover w-full h-full"
          src={image}
          alt="Card"
        />
      </div>

      <div className="p-2 flex-1">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-left font-medium text-md pb-2">
            {title}
            {option && (
              <span className="bg-zinc-500 text-gray-200 rounded-full p-1 mx-1">
                {" "}
                {option}
              </span>
            )}
          </h2>
        </div>

        <div className="flex justify-between items-center w-full">
          <h2 className="text-left font-medium text-md pb-2">
            Quantity : {quantity}
          </h2>
        </div>

        <h2 className="font-semibold text-lg text-left pb-2 text-primaryui">
          {price}.00 DA <span className="text-xs">/ piece</span>
        </h2>
      </div>
    </div>
  );
}

export default HorizontalCard;
