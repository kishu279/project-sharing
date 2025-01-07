export default function ValidatingPage() {
  return (
    <div className="flex justify-center items-center">
      <nav className="border rounded-xl h-[250px] w-[600px] flex flex-col justify-center items-center gap-5 shadow-lg drop-shadow-lg">
        <input
          type="text"
          placeholder="Username ..."
          className="border rounded-lg"
        />
        <input
          type="text"
          placeholder="Email ..."
          className="border rounded-lg"
        />
        <input
          type="text"
          placeholder="Password ..."
          className="border rounded-lg"
        />
        <input
          type="submit"
          className="border h-[50px] w-[80px] rounded-lg cursor-pointer"
        />
      </nav>
    </div>
  );
}
